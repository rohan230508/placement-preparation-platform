const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
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

// ── Database ──────────────────────────────────────────────
const DB_PATH = path.join(__dirname, 'placeprep.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) { console.error('DB Error:', err.message); return; }
    console.log('Connected to SQLite.');

    db.serialize(() => {
        // Users table with stream + real stats
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
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
        )`);

        // Solved problems per user
        db.run(`CREATE TABLE IF NOT EXISTS solved_problems (
            user_id    INTEGER NOT NULL,
            problem_id INTEGER NOT NULL,
            solved_at  TEXT DEFAULT (datetime('now')),
            PRIMARY KEY (user_id, problem_id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Progress/activity log
        db.run(`CREATE TABLE IF NOT EXISTS activity_log (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id   INTEGER NOT NULL,
            type      TEXT,
            score     INTEGER DEFAULT 0,
            xp_gained INTEGER DEFAULT 0,
            timestamp TEXT DEFAULT (datetime('now')),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);

        // Migration: add stream column if existing DB doesn't have it
        db.run(`ALTER TABLE users ADD COLUMN stream TEXT DEFAULT 'software'`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN problems_solved INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN quizzes_done INTEGER DEFAULT 0`, () => {});
        db.run(`ALTER TABLE users ADD COLUMN tests_done INTEGER DEFAULT 0`, () => {});
    });
});

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
        db.run(
            `INSERT INTO users (name, email, password, stream) VALUES (?, ?, ?, ?)`,
            [name, email, hashed, stream],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered.' });
                    return res.status(500).json({ error: err.message });
                }
                const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '30d' });
                res.json({
                    token,
                    user: { id: this.lastID, name, email, stream, level: 1, xp: 0, streak: 0, problems_solved: 0, quizzes_done: 0, tests_done: 0 }
                });
            }
        );
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

// ── Login ─────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

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
            db.run(`UPDATE users SET last_active = ?, streak = ? WHERE id = ?`, [today, newStreak, user.id]);
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
    });
});

// ── Profile ───────────────────────────────────────────────
app.get('/api/user/profile', auth, (req, res) => {
    db.get(
        `SELECT id, name, email, stream, level, xp, streak, problems_solved, quizzes_done, tests_done FROM users WHERE id = ?`,
        [req.user.id],
        (err, user) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!user) return res.status(404).json({ error: 'User not found.' });
            res.json({ user: { ...user, stream: user.stream || 'software' } });
        }
    );
});

// ── Get Solved Problems ───────────────────────────────────
app.get('/api/user/solved-problems', auth, (req, res) => {
    db.all(`SELECT problem_id FROM solved_problems WHERE user_id = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ solved: rows.map(r => r.problem_id) });
    });
});

// ── Mark Problem Solved ───────────────────────────────────
app.post('/api/user/solve-problem', auth, (req, res) => {
    const { problem_id } = req.body;
    if (!problem_id) return res.status(400).json({ error: 'problem_id required' });

    // Insert only if not already solved (PRIMARY KEY constraint handles duplicates)
    db.run(
        `INSERT OR IGNORE INTO solved_problems (user_id, problem_id) VALUES (?, ?)`,
        [req.user.id, problem_id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });

            if (this.changes > 0) {
                // It was a new solve — increment the counter
                db.run(
                    `UPDATE users SET problems_solved = problems_solved + 1 WHERE id = ?`,
                    [req.user.id],
                    (err2) => {
                        if (err2) return res.status(500).json({ error: err2.message });
                        db.get(`SELECT problems_solved FROM users WHERE id = ?`, [req.user.id], (e, row) => {
                            res.json({ success: true, new_solve: true, problems_solved: row ? row.problems_solved : 0 });
                        });
                    }
                );
            } else {
                // Already solved before
                db.get(`SELECT problems_solved FROM users WHERE id = ?`, [req.user.id], (e, row) => {
                    res.json({ success: true, new_solve: false, problems_solved: row ? row.problems_solved : 0 });
                });
            }
        }
    );
});

// ── Update XP ─────────────────────────────────────────────
app.post('/api/user/xp', auth, (req, res) => {
    const { xp_gain, type } = req.body;
    db.get(`SELECT xp, level, quizzes_done, tests_done FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'User lookup failed.' });

        const newXp = user.xp + (xp_gain || 0);
        const newLevel = Math.floor(newXp / 500) + 1;
        const quizInc = type === 'quiz' ? 1 : 0;
        const testInc = type === 'test' ? 1 : 0;

        db.run(
            `UPDATE users SET xp = ?, level = ?, quizzes_done = quizzes_done + ?, tests_done = tests_done + ? WHERE id = ?`,
            [newXp, newLevel, quizInc, testInc, req.user.id],
            (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                // Log activity
                db.run(`INSERT INTO activity_log (user_id, type, xp_gained) VALUES (?, ?, ?)`, [req.user.id, type || 'activity', xp_gain]);
                res.json({ xp: newXp, level: newLevel });
            }
        );
    });
});

// ── Activity Log (for heatmap) ────────────────────────────
app.get('/api/user/activity', auth, (req, res) => {
    db.all(
        `SELECT date(timestamp) as day, COUNT(*) as count
         FROM activity_log WHERE user_id = ?
         GROUP BY day ORDER BY day DESC LIMIT 120`,
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ activity: rows });
        }
    );
});

// ── Leaderboard (real signed-up users only, auth required) ────────────────
app.get('/api/leaderboard', auth, (req, res) => {
    db.all(
        `SELECT id, name, stream, level, xp, streak, problems_solved, tests_done
         FROM users
         ORDER BY xp DESC, streak DESC, problems_solved DESC
         LIMIT 50`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            const badges = ['\uD83C\uDFC6 Topper', '\u26A1 Speedster', '\uD83D\uDD25 On Fire', '\uD83D\uDCA1 Solver',
                            '\uD83C\uDFAF Consistent', '\uD83C\uDF1F Rising Star', '\uD83D\uDCC8 Improving',
                            '\uD83D\uDCBB Coder', '\uD83C\uDF31 Growing', '\uD83D\uDE80 Climber'];
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
                badge: badges[i] || '\uD83C\uDF31 Member',
                isCurrentUser: u.id === req.user.id
            }));
            res.json({ leaderboard: result, total: result.length });
        }
    );
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

        const response = await genAI.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
        let text = response.text.trim();
        if (text.startsWith('```json')) text = text.slice(7, text.lastIndexOf('```')).trim();
        else if (text.startsWith('```')) text = text.slice(3, text.lastIndexOf('```')).trim();

        const questions = JSON.parse(text);
        if (!Array.isArray(questions)) throw new Error('Invalid AI response format');
        res.json({ questions });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
    }
});

app.listen(port, () => console.log(`PlacePrep running on http://localhost:${port}`));
