const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me-later';

app.use(cors());
app.use(express.json());

// Serve static frontend from parent directory
const path = require('path');
app.use(express.static(path.join(__dirname, '..')));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Database
const db = new sqlite3.Database('./placeprep.db', (err) => {
    if (err) { console.error('Error opening database:', err.message); return; }
    console.log('Connected to SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, email TEXT UNIQUE, password TEXT,
        level INTEGER DEFAULT 1, xp INTEGER DEFAULT 0,
        streak INTEGER DEFAULT 0, last_active TEXT
    )`, () => {});
    db.run(`CREATE TABLE IF NOT EXISTS progress (
        user_id INTEGER, category TEXT, type TEXT,
        score INTEGER, total INTEGER, timestamp TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`, () => {});
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header && header.split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth ---
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });
    try {
        const hashed = await bcrypt.hash(password, 10);
        db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashed], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email already registered.' });
                return res.status(500).json({ error: err.message });
            }
            const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });
            res.json({ token, user: { id: this.lastID, name, email, level: 1, xp: 0, streak: 0 } });
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });

        const today = new Date().toISOString().split('T')[0];
        let newStreak = user.streak;
        if (user.last_active !== today) {
            const last = user.last_active ? new Date(user.last_active) : null;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (!last || last < new Date(yesterday.toDateString())) { newStreak = 1; }
            else if (last.toDateString() === yesterday.toDateString()) { newStreak++; }
            db.run(`UPDATE users SET last_active = ?, streak = ? WHERE id = ?`, [today, newStreak, user.id]);
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, level: user.level, xp: user.xp, streak: newStreak } });
    });
});

app.get('/api/user/profile', authenticateToken, (req, res) => {
    db.get(`SELECT id, name, email, level, xp, streak FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ user });
    });
});

app.post('/api/user/xp', authenticateToken, (req, res) => {
    const { xp_gain } = req.body;
    db.get(`SELECT xp, level FROM users WHERE id = ?`, [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ error: 'User lookup failed.' });
        const newXp = user.xp + xp_gain;
        const newLevel = Math.floor(newXp / 500) + 1;
        db.run(`UPDATE users SET xp = ?, level = ? WHERE id = ?`, [newXp, newLevel, req.user.id], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ xp: newXp, level: newLevel });
        });
    });
});

// --- AI Question Generation ---
app.post('/api/generate-questions', authenticateToken, async (req, res) => {
    const { category, type, apiKey } = req.body;
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    if (!keyToUse) return res.status(400).json({ error: 'No Gemini API Key provided. Add it in Settings.' });

    try {
        // Dynamic import to handle both ESM and CJS
        let genAI;
        try {
            const { GoogleGenAI } = require('@google/genai');
            genAI = new GoogleGenAI({ apiKey: keyToUse });
        } catch (e) {
            return res.status(500).json({ error: 'AI library error: ' + e.message });
        }

        const prompt = `Generate 5 multiple-choice questions for "${category}" aptitude for campus placements (${type}).
Respond ONLY with a valid JSON array. Each object must have:
- "question" (string)
- "options" (array of exactly 4 strings)
- "correctAnswer" (integer 0-3, index of correct option)
- "explanation" (string, brief explanation)
No markdown, no code fences, just raw JSON array.`;

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        let text = response.text.trim();
        if (text.startsWith('```json')) text = text.slice(7, text.lastIndexOf('```')).trim();
        else if (text.startsWith('```')) text = text.slice(3, text.lastIndexOf('```')).trim();

        const questions = JSON.parse(text);
        if (!Array.isArray(questions)) throw new Error('Invalid AI response format');
        res.json({ questions });
    } catch (error) {
        console.error('AI Error:', error);
        res.status(500).json({ error: 'Failed to generate questions. ' + error.message });
    }
});

app.listen(port, () => {
    console.log(`PlacePrep server running on http://localhost:${port}`);
});
