import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'app.db');

if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new Database(dbFile);

db.pragma('journal_mode = WAL');

// Schema initialization
db.exec(`
CREATE TABLE IF NOT EXISTS contact_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  linkedin TEXT,
  youtube TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teachers (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT NOT NULL,
	expertise TEXT NOT NULL,
	experience INTEGER,
	bio TEXT,
	status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);

CREATE TABLE IF NOT EXISTS courses (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	faculty_name TEXT,
	start_date TEXT,
	timings TEXT,
	description TEXT,
	is_published INTEGER NOT NULL DEFAULT 1,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS student_requests (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT NOT NULL,
	course TEXT NOT NULL,
	preferred_date TEXT,
	message TEXT,
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS statistics (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	years INTEGER NOT NULL DEFAULT 0,
	courses INTEGER NOT NULL DEFAULT 0,
	students INTEGER NOT NULL DEFAULT 0,
	placements INTEGER NOT NULL DEFAULT 0,
	updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_courses_start_date ON courses(start_date);
CREATE INDEX IF NOT EXISTS idx_requests_created ON student_requests(created_at);
`);

export function runInTransaction(work) {
	const transaction = db.transaction(work);
	return transaction();
}

