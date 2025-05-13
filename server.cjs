// server.cjs
const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const usersDir = path.join(__dirname, 'src', 'Users');
if (!fs.existsSync(usersDir)) {
  fs.mkdirSync(usersDir, { recursive: true });
}

app.post('/api/saveUserData', (req, res) => {
  const { userName, measurements, recommendations, photo } = req.body;
  const fileName = `${userName || 'guest'}_${Date.now()}.json`;
  const filePath = path.join(usersDir, fileName);
  const dataToSave = { userName, measurements, recommendations, photo };

  fs.writeFile(filePath, JSON.stringify(dataToSave, null, 2), (err) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    res.json({ success: true, file: fileName });
  });
});

// *s*NEW**: list endpoint for testing
app.get('/api/getUsers', (req, res) => {
  const files = fs.readdirSync(usersDir).filter(f => f.endsWith('.json'));
  const users = files.map(f => {
    try { return JSON.parse(fs.readFileSync(path.join(usersDir, f), 'utf-8')); }
    catch { return null; }
  }).filter(Boolean);
  res.json(users);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`▶️  API listening on http://localhost:${PORT}`));
