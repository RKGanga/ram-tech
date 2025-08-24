
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { parseBody, CourseCreateSchema, CourseUpdateSchema } from '../validators.js';

export const adminRouter = Router();

// Contact Info Management
adminRouter.get('/contact-info', (req, res) => {
  const row = db.prepare('SELECT * FROM contact_info ORDER BY updated_at DESC LIMIT 1').get();
  res.json(row || {});
});

adminRouter.post('/contact-info', (req, res) => {
  const { email, phone, whatsapp, instagram, linkedin, youtube } = req.body || {};
  db.prepare('INSERT INTO contact_info (email, phone, whatsapp, instagram, linkedin, youtube, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))')
	.run(email, phone, whatsapp, instagram, linkedin, youtube);
  res.json({ success: true });
});

adminRouter.put('/contact-info', (req, res) => {
  const { email, phone, whatsapp, instagram, linkedin, youtube } = req.body || {};
  db.prepare('UPDATE contact_info SET email=?, phone=?, whatsapp=?, instagram=?, linkedin=?, youtube=?, updated_at=datetime("now") WHERE id=(SELECT id FROM contact_info ORDER BY updated_at DESC LIMIT 1)')
	.run(email, phone, whatsapp, instagram, linkedin, youtube);
  res.json({ success: true });
});

// Public: admin login (username/password) returns JWT
adminRouter.post('/login', (req, res) => {
  const { userId, password } = req.body || {};
  const cfgUser = process.env.ADMIN_USER || 'admin';
  const cfgPass = process.env.ADMIN_PASS || 'changeme123';
  if (!userId || !password) return res.status(400).json({ error: 'Missing credentials' });
  if (userId !== cfgUser || password !== cfgPass) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: 'admin', userId }, process.env.JWT_SECRET || 'super-secret-dev-key', { expiresIn: '1d' });
  res.json({ token });
});

// Auth middleware: prefer JWT Bearer, fallback to legacy x-admin-key
adminRouter.use((req, res, next) => {
  const auth = req.header('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (m) {
	try {
	  const payload = jwt.verify(m[1], process.env.JWT_SECRET || 'super-secret-dev-key');
	  req.admin = payload;
	  return next();
	} catch (err) {
	  return res.status(401).json({ error: 'Invalid token' });
	}
  }
  // Legacy key support
  const key = req.header('x-admin-key');
  const expected = process.env.ADMIN_API_KEY || 'dev-admin-key';
  if (key && key === expected) return next();
  return res.status(401).json({ error: 'Unauthorized' });
});

adminRouter.get('/teachers', (req, res) => {
  const status = req.query.status;
  let rows;
  if (status) {
	rows = db.prepare(`SELECT id, name, email, phone, expertise, experience, bio, status, created_at as createdAt FROM teachers WHERE status = ? ORDER BY created_at DESC`).all(status);
  } else {
	rows = db.prepare(`SELECT id, name, email, phone, expertise, experience, bio, status, created_at as createdAt FROM teachers ORDER BY created_at DESC`).all();
  }
  res.json(rows);
});

adminRouter.post('/teachers/:id/approve', (req, res) => {
	const id = Number(req.params.id);
	const info = db.prepare(`UPDATE teachers SET status = 'approved' WHERE id = ?`).run(id);
	res.json({ updated: info.changes });
});

adminRouter.post('/teachers/:id/reject', (req, res) => {
	const id = Number(req.params.id);
	const info = db.prepare(`UPDATE teachers SET status = 'rejected' WHERE id = ?`).run(id);
	res.json({ updated: info.changes });
});

adminRouter.get('/requests', (req, res) => {
	const rows = db.prepare(`SELECT id, name, email, phone, course, preferred_date as preferredDate, message, created_at as createdAt FROM student_requests ORDER BY created_at DESC`).all();
	res.json(rows);
});

adminRouter.post('/courses', (req, res, next) => {
	try {
		const data = parseBody(CourseCreateSchema, req.body);
		const stmt = db.prepare(`
			INSERT INTO courses (name, faculty_name, start_date, timings, description, is_published)
			VALUES (@name, @facultyName, @startDate, @timings, @description, @isPublished)
		`);
		const row = {
			name: data.name,
			facultyName: data.facultyName || null,
			startDate: data.startDate || null,
			timings: data.timings || null,
			description: data.description || null,
			isPublished: data.isPublished === false ? 0 : 1
		};
		const info = stmt.run(row);
		res.status(201).json({ id: info.lastInsertRowid });
	} catch (err) {
		next(err);
	}
});

adminRouter.put('/courses/:id', (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const data = parseBody(CourseUpdateSchema, req.body);
		const existing = db.prepare(`SELECT * FROM courses WHERE id = ?`).get(id);
		if (!existing) return res.status(404).json({ error: 'Not found' });
		const row = {
			name: data.name ?? existing.name,
			facultyName: data.facultyName ?? existing.faculty_name,
			startDate: data.startDate ?? existing.start_date,
			timings: data.timings ?? existing.timings,
			description: data.description ?? existing.description,
			isPublished: data.isPublished === undefined ? existing.is_published : (data.isPublished ? 1 : 0)
		};
		const info = db.prepare(`
			UPDATE courses SET name=@name, faculty_name=@facultyName, start_date=@startDate, timings=@timings, description=@description, is_published=@isPublished WHERE id=${id}
		`).run(row);
		res.json({ updated: info.changes });
	} catch (err) {
		next(err);
	}
});

adminRouter.delete('/courses/:id', (req, res) => {
	const id = Number(req.params.id);
	const info = db.prepare(`DELETE FROM courses WHERE id = ?`).run(id);
	res.json({ deleted: info.changes });
});

// Demo Classes Management
adminRouter.get('/demo-classes', (req, res) => {
	const rows = db.prepare(`
		SELECT id, name, faculty_name as facultyName, start_date as startDate, timings, description, is_published as isPublished
		FROM courses
		WHERE start_date IS NOT NULL
		ORDER BY start_date ASC
	`).all();
	res.json(rows);
});

adminRouter.post('/demo-classes', (req, res, next) => {
	try {
		const data = parseBody(CourseCreateSchema, req.body);
		const stmt = db.prepare(`
			INSERT INTO courses (name, faculty_name, start_date, timings, description, is_published)
			VALUES (@name, @facultyName, @startDate, @timings, @description, @isPublished)
		`);
		const row = {
			name: data.name,
			facultyName: data.facultyName || null,
			startDate: data.startDate || null,
			timings: data.timings || null,
			description: data.description || null,
			isPublished: data.isPublished === false ? 0 : 1
		};
		const info = stmt.run(row);
		res.status(201).json({ id: info.lastInsertRowid });
	} catch (err) {
		next(err);
	}
});

adminRouter.put('/demo-classes/:id', (req, res, next) => {
	try {
		const id = Number(req.params.id);
		const data = parseBody(CourseUpdateSchema, req.body);
		const existing = db.prepare(`SELECT * FROM courses WHERE id = ?`).get(id);
		if (!existing) return res.status(404).json({ error: 'Not found' });
		const row = {
			name: data.name ?? existing.name,
			facultyName: data.facultyName ?? existing.faculty_name,
			startDate: data.startDate ?? existing.start_date,
			timings: data.timings ?? existing.timings,
			description: data.description ?? existing.description,
			isPublished: data.isPublished === undefined ? existing.is_published : (data.isPublished ? 1 : 0)
		};
		const info = db.prepare(`
			UPDATE courses SET name=@name, faculty_name=@facultyName, start_date=@startDate, timings=@timings, description=@description, is_published=@isPublished WHERE id=${id}
		`).run(row);
		res.json({ updated: info.changes });
	} catch (err) {
		next(err);
	}
});

adminRouter.delete('/demo-classes/:id', (req, res) => {
	const id = Number(req.params.id);
	const info = db.prepare(`DELETE FROM courses WHERE id = ?`).run(id);
	res.json({ deleted: info.changes });
});

// Statistics Management
adminRouter.get('/stats', (req, res) => {
	const stats = db.prepare(`SELECT years, courses, students, placements FROM statistics ORDER BY id DESC LIMIT 1`).get();
	res.json(stats || { years: 0, courses: 0, students: 0, placements: 0 });
});

adminRouter.put('/stats', (req, res, next) => {
	try {
		const { years, courses, students, placements } = req.body;
		
		// Validate input
		if (typeof years !== 'number' || typeof courses !== 'number' || typeof students !== 'number' || typeof placements !== 'number') {
			return res.status(400).json({ error: 'All fields must be numbers' });
		}
		
		// Check if stats exist
		const existing = db.prepare(`SELECT id FROM statistics ORDER BY id DESC LIMIT 1`).get();
		
		if (existing) {
			// Update existing stats
			const info = db.prepare(`UPDATE statistics SET years = @years, courses = @courses, students = @students, placements = @placements, updated_at = datetime('now') WHERE id = @id`).run({
				years, courses, students, placements, id: existing.id
			});
			res.json({ updated: info.changes });
		} else {
			// Create new stats
			const info = db.prepare(`INSERT INTO statistics (years, courses, students, placements) VALUES (@years, @courses, @students, @placements)`).run({
				years, courses, students, placements
			});
			res.status(201).json({ created: info.lastInsertRowid });
		}
	} catch (err) {
		next(err);
	}
});

