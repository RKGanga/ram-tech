import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
import './db.js';

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
	origin: (origin, cb) => {
		if (!origin) return cb(null, true);
		if (corsOrigins.length === 0 || corsOrigins.includes(origin)) return cb(null, true);
		cb(new Error('Not allowed by CORS'));
	}
}));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

// Error handler
app.use((err, req, res, next) => {
	const status = err.status || 500;
	res.status(status).json({ error: err.message || 'Internal Server Error' });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Backend listening on http://localhost:${port}`));

