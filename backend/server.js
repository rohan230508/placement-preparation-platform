const express = require('express');
const cors = require('cors');
const postgres = require('postgres');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'index.html')));

// ── Database (PostgreSQL via Supabase) ────────────────────
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL is not set in .env! Cannot connect to database.');
    process.exit(1);
}
// Initialize postgres connection. Supabase requires ssl, and postgres package handles it generally by default if pg connection string contains it, but we can enforce ssl by connection option just in case, or default to the connection string's properties.
const sql = postgres(connectionString, { ssl: 'require' });

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id              SERIAL PRIMARY KEY,
                name            TEXT NOT NULL,
                email           TEXT UNIQUE NOT NULL,
                password        TEXT NOT NULL,
                stream          TEXT DEFAULT 'software',
                level           INTEGER DEFAULT 1,
                xp              INTEGER DEFAULT 0,
                streak          INTEGER DEFAULT 0,
                last_active     TEXT,
                problems_solved INTEGER DEFAULT 0,
                quizzes_done    INTEGER DEFAULT 0,
                tests_done      INTEGER DEFAULT 0
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS solved_problems (
                user_id    INTEGER NOT NULL REFERENCES users(id),
                problem_id INTEGER NOT NULL,
                solved_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, problem_id)
            )
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS activity_log (
                id        SERIAL PRIMARY KEY,
                user_id   INTEGER NOT NULL REFERENCES users(id),
                type      TEXT,
                score     INTEGER DEFAULT 0,
                xp_gained INTEGER DEFAULT 0,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Connected to PostgreSQL and verified tables.');
    } catch (err) {
        console.error('DB Init Error:', err);
    }
}
initDB();

// ── Auth Middleware ───────────────────────────────────────
const auth = (req, res, next) => {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ── Register ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, stream = 'software' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required.' });
    if (!['software', 'hardware'].includes(stream)) return res.status(400).json({ error: 'Invalid stream.' });

    try {
        const hashed = await bcrypt.hash(password, 10);
        const [newUser] = await sql`
            INSERT INTO users (name, email, password, stream) 
            VALUES (${name}, ${email}, ${hashed}, ${stream})
            RETURNING id
        `;
        const token = jwt.sign({ id: newUser.id, email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            user: { id: newUser.id, name, email, stream, level: 1, xp: 0, streak: 0, problems_solved: 0, quizzes_done: 0, tests_done: 0 }
        });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: 'Email already registered.' }); // PostgreSQL unique violation
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ── Login ─────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const users = await sql`SELECT * FROM users WHERE email = ${email}`;
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });
        const user = users[0];

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

        // Streak logic
        const today = new Date().toISOString().split('T')[0];
        let newStreak = user.streak;
        if (user.last_active !== today) {
            const last = user.last_active ? new Date(user.last_active) : null;
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (!last || last < new Date(yesterday.toDateString())) newStreak = 1;
            else if (last.toDateString() === yesterday.toDateString()) newStreak++;
            await sql`UPDATE users SET last_active = ${today}, streak = ${newStreak} WHERE id = ${user.id}`;
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            user: {
                id: user.id, name: user.name, email: user.email,
                stream: user.stream || 'software',
                level: user.level, xp: user.xp, streak: newStreak,
                problems_solved: user.problems_solved || 0,
                quizzes_done: user.quizzes_done || 0,
                tests_done: user.tests_done || 0
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Profile ───────────────────────────────────────────────
app.get('/api/user/profile', auth, async (req, res) => {
    try {
        const users = await sql`
            SELECT id, name, email, stream, level, xp, streak, problems_solved, quizzes_done, tests_done 
            FROM users WHERE id = ${req.user.id}
        `;
        if (users.length === 0) return res.status(404).json({ error: 'User not found.' });
        const user = users[0];
        res.json({ user: { ...user, stream: user.stream || 'software' } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Get Solved Problems ───────────────────────────────────
app.get('/api/user/solved-problems', auth, async (req, res) => {
    try {
        const rows = await sql`SELECT problem_id FROM solved_problems WHERE user_id = ${req.user.id}`;
        res.json({ solved: rows.map(r => r.problem_id) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Mark Problem Solved ───────────────────────────────────
app.post('/api/user/solve-problem', auth, async (req, res) => {
    const { problem_id } = req.body;
    if (!problem_id) return res.status(400).json({ error: 'problem_id required' });

    try {
        const insertResult = await sql`
            INSERT INTO solved_problems (user_id, problem_id) 
            VALUES (${req.user.id}, ${problem_id})
            ON CONFLICT (user_id, problem_id) DO NOTHING
        `;
        
        if (insertResult.count > 0) {
            // It was a new solve — increment the counter
            const users = await sql`
                UPDATE users SET problems_solved = problems_solved + 1 
                WHERE id = ${req.user.id}
                RETURNING problems_solved
            `;
            const problems_solved = users.length > 0 ? users[0].problems_solved : 0;
            res.json({ success: true, new_solve: true, problems_solved });
        } else {
            // Already solved before
            const users = await sql`SELECT problems_solved FROM users WHERE id = ${req.user.id}`;
            const problems_solved = users.length > 0 ? users[0].problems_solved : 0;
            res.json({ success: true, new_solve: false, problems_solved });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Update XP ─────────────────────────────────────────────
app.post('/api/user/xp', auth, async (req, res) => {
    const { xp_gain, type } = req.body;
    try {
        const users = await sql`SELECT xp, level, quizzes_done, tests_done FROM users WHERE id = ${req.user.id}`;
        if (users.length === 0) return res.status(500).json({ error: 'User lookup failed.' });
        const user = users[0];

        const newXp = user.xp + (xp_gain || 0);
        const newLevel = Math.floor(newXp / 500) + 1;
        const quizInc = type === 'quiz' ? 1 : 0;
        const testInc = type === 'test' ? 1 : 0;

        await sql`
            UPDATE users SET xp = ${newXp}, level = ${newLevel}, 
            quizzes_done = quizzes_done + ${quizInc}, tests_done = tests_done + ${testInc}
            WHERE id = ${req.user.id}
        `;
        await sql`
            INSERT INTO activity_log (user_id, type, xp_gained) 
            VALUES (${req.user.id}, ${type || 'activity'}, ${xp_gain})
        `;
        
        res.json({ xp: newXp, level: newLevel });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Activity Log (for heatmap) ────────────────────────────
app.get('/api/user/activity', auth, async (req, res) => {
    try {
        const rows = await sql`
            SELECT DATE(timestamp) as day, COUNT(*)::INT as count
            FROM activity_log 
            WHERE user_id = ${req.user.id}
            GROUP BY day 
            ORDER BY day DESC 
            LIMIT 120
        `;
        
        const serialized = rows.map(r => {
            // DATE() returns a string or a JS Date Date object without time natively, handle gracefully
            const dateStr = r.day instanceof Date 
                ? new Date(r.day.getTime() - (r.day.getTimezoneOffset() * 60000)).toISOString().split('T')[0]
                : String(r.day).split('T')[0];

            return { day: dateStr, count: r.count };
        });
        
        res.json({ activity: serialized });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── Leaderboard (real signed-up users only, auth required) ────────────────
app.get('/api/leaderboard', auth, async (req, res) => {
    try {
        const rows = await sql`
            SELECT id, name, stream, level, xp, streak, problems_solved, tests_done
            FROM users
            ORDER BY xp DESC, streak DESC, problems_solved DESC
            LIMIT 50
        `;
        
        const badges = ['🏆 Topper', '⚡ Speedster', '🔥 On Fire', '💡 Solver',
                        '🎯 Consistent', '🌟 Rising Star', '📈 Improving',
                        '💻 Coder', '🌱 Growing', '🚀 Climber'];
        const gradients = [
            'linear-gradient(135deg,#6366f1,#8b5cf6)',
            'linear-gradient(135deg,#ec4899,#f43f5e)',
            'linear-gradient(135deg,#10b981,#059669)',
            'linear-gradient(135deg,#f59e0b,#d97706)',
            'linear-gradient(135deg,#14b8a6,#0d9488)',
            'linear-gradient(135deg,#8b5cf6,#7c3aed)',
            'linear-gradient(135deg,#0078d4,#50e6ff)',
            'linear-gradient(135deg,#ef4444,#dc2626)',
            'linear-gradient(135deg,#6366f1,#4f46e5)',
            'linear-gradient(135deg,#10b981,#34d399)'
        ];
        
        const result = rows.map((u, i) => ({
            name: u.name,
            avatar: u.name.charAt(0).toUpperCase(),
            gradient: gradients[i % gradients.length],
            xp: u.xp || 0,
            solved: u.problems_solved || 0,
            streak: u.streak || 0,
            track: u.stream || 'software',
            level: u.level || 1,
            tests: u.tests_done || 0,
            badge: badges[i] || '🌱 Member',
            isCurrentUser: u.id === req.user.id
        }));
        
        res.json({ leaderboard: result, total: result.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ── AI Question Generation ────────────────────────────────
app.post('/api/generate-questions', auth, async (req, res) => {
    const { category, type, stream } = req.body;
    const keyToUse = process.env.GEMINI_API_KEY;
    if (!keyToUse) return res.status(500).json({ error: 'Server configuration error: Missing Gemini API Key in backend.' });

    try {
        const { GoogleGenAI } = require('@google/genai');
        const genAI = new GoogleGenAI({ apiKey: keyToUse });

        const streamContext = stream === 'hardware'
            ? 'hardware/electronics engineering (focus on digital electronics, circuits, VLSI, embedded systems, signals & systems)'
            : 'software engineering campus placements (focus on programming, algorithms, data structures, OS, DBMS)';

        const prompt = `Generate 5 multiple-choice questions for "${category}" aptitude for ${streamContext}.
Respond ONLY with a valid JSON array. Each object must have:
- "question" (string)
- "options" (array of exactly 4 strings)
- "correctAnswer" (integer 0-3)
- "explanation" (string)
No markdown, no code blocks, only raw JSON array.`;

        const response = await genAI.models.generateContent({ model: 'gemini-1.5-flash', contents: prompt });
        let text = response.text.trim();
        if (text.startsWith('\`\`\`json')) text = text.slice(7, text.lastIndexOf('\`\`\`')).trim();
        else if (text.startsWith('\`\`\`')) text = text.slice(3, text.lastIndexOf('\`\`\`')).trim();

        const questions = JSON.parse(text);
        if (!Array.isArray(questions)) throw new Error('Invalid AI response format');
        res.json({ questions });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
    }
});

if (require.main === module) {
    app.listen(port, () => console.log(`PlacePrep running on http://localhost:${port}`));
}
module.exports = app;
