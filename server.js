const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("✅ Connected to SQLite database.");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    urgency TEXT,
    date_added TEXT,
    due_date TEXT,
    status TEXT DEFAULT 'pending'
  )
`);

// Routes
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks WHERE status != 'done'", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { name, urgency, date_added, due_date } = req.body;
  db.run(
    "INSERT INTO tasks (name, urgency, date_added, due_date, status) VALUES (?, ?, ?, ?, 'pending')",
    [name, urgency, date_added, due_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put("/tasks/:id/done", (req, res) => {
  const { id } = req.params;
  db.run("UPDATE tasks SET status = 'done' WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
