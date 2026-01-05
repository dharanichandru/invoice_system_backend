const Database = require('better-sqlite3');
const path = require('path');

const dbFile = path.join("/tmp", "data.db");
const db = new Database(dbFile);

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  invoiceId TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  date TEXT,
  card_last4 TEXT,
  card_name TEXT,
  card_expiry TEXT,
  FOREIGN KEY(invoiceId) REFERENCES invoices(id)
);
`);

// Ensure new columns exist (safe ALTER TABLE for older DBs)
const existing = db.prepare("PRAGMA table_info(invoices)").all();
const cols = existing.map(r => r.name);
if (!cols.includes('customer')) {
  db.exec("ALTER TABLE invoices ADD COLUMN customer TEXT;");
}
if (!cols.includes('due_date')) {
  db.exec("ALTER TABLE invoices ADD COLUMN due_date TEXT;");
}
if (!cols.includes('description')) {
  db.exec("ALTER TABLE invoices ADD COLUMN description TEXT;");
}

module.exports = db;
