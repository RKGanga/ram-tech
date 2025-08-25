
import { Router } from 'express';
import { db } from '../db.js';
import { parseBody, TeacherRegistrationSchema, StudentRequestSchema } from '../validators.js';
import { sendMail } from '../mailer.js';

export const publicRouter = Router();

// Public endpoint for contact info
publicRouter.get('/contact-info', (req, res) => {
  const row = db.prepare('SELECT * FROM contact_info ORDER BY updated_at DESC LIMIT 1').get();
  res.json(row || {});
});

publicRouter.get('/health', (req, res) => {
	res.json({ ok: true });
});

publicRouter.post('/teachers/register', (req, res, next) => {
	try {
		const data = parseBody(TeacherRegistrationSchema, req.body);
		const stmt = db.prepare(`
			INSERT INTO teachers (name, email, phone, expertise, experience, bio, status)
			VALUES (@name, @email, @phone, @expertise, @experience, @bio, 'pending')
		`);
		const experience = data.experience === undefined ? null : Number(data.experience);
		const info = stmt.run({ ...data, experience });
		res.status(201).json({ id: info.lastInsertRowid, status: 'pending' });
	} catch (err) {
		if (String(err.message || '').includes('UNIQUE constraint failed: teachers.email')) {
			err = new Error('A teacher with this email already exists.');
			err.status = 409;
		}
		next(err);
	}
});

publicRouter.get('/teachers', (req, res) => {
	const status = (req.query.status || 'approved');
	const rows = db.prepare(`SELECT id, name, email, phone, expertise, experience, bio, status, created_at as createdAt FROM teachers WHERE status = ? ORDER BY created_at DESC`).all(status);
	res.json(rows);
});

publicRouter.get('/courses', (req, res) => {
	const rows = db.prepare(`
		SELECT id, name, faculty_name as facultyName, start_date as startDate, timings, description, is_published as isPublished
		FROM courses
		WHERE is_published = 1
		ORDER BY COALESCE(start_date, '9999-12-31') ASC, id DESC
	`).all();
	res.json(rows);
});

publicRouter.get('/demo-classes', (req, res) => {
	const today = new Date().toISOString().slice(0, 10);
	const rows = db.prepare(`
		SELECT id, name, faculty_name as facultyName, start_date as startDate, timings, description
		FROM courses
		WHERE is_published = 1 AND start_date IS NOT NULL AND start_date >= ?
		ORDER BY start_date ASC
	`).all(today);
	res.json(rows);
});

publicRouter.get('/stats', (req, res) => {
	// Get the first (and only) statistics record, or create default if none exists
	let stats = db.prepare(`SELECT years, courses, students, placements FROM statistics ORDER BY id DESC LIMIT 1`).get();
	
	if (!stats) {
		// Insert default statistics if none exist
		const defaultStats = { years: 5, courses: 12, students: 1250, placements: 980 };
		db.prepare(`INSERT INTO statistics (years, courses, students, placements) VALUES (@years, @courses, @students, @placements)`).run(defaultStats);
		stats = defaultStats;
	}
	
	res.json(stats);
});

publicRouter.post('/requests', async (req, res, next) => {
	try {
		const data = parseBody(StudentRequestSchema, req.body);
		const stmt = db.prepare(`
			INSERT INTO student_requests (name, email, phone, course, preferred_date, message)
			VALUES (@name, @email, @phone, @course, @preferredDate, @message)
		`);
		const info = stmt.run(data);

		try {
			await sendMail({
				subject: `New Course Inquiry: ${data.course}`,
				text: `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nCourse: ${data.course}\nPreferred Date: ${data.preferredDate || '-'}\nMessage: ${data.message || '-'}`
			});
		} catch (mailErr) {
			// ignore email errors for UX, still return 201
		}

		res.status(201).json({ id: info.lastInsertRowid });
	} catch (err) {
		next(err);
	}
});

