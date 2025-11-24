const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());

// Serve index.html manually
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve static files (css, js) from root folder
app.use(express.static(__dirname));

// DB setup
const db = new sqlite3.Database("./todo.db");

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`);

app.get("/api/todos", (req, res) => {
  db.all("SELECT id, text FROM todos ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: "db error" });
    res.json(rows);
  });
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text.trim()) return res.status(400).json({ error: "text required" });

  db.run("INSERT INTO todos (text) VALUES (?)", [text.trim()], function (err) {
    if (err) return res.status(500).json({ error: "db error" });
    res.json({ id: this.lastID, text: text.trim() });
  });
});

app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);

  db.run("DELETE FROM todos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "db error" });
    res.json({ ok: true });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
