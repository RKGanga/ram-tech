import nodemailer from 'nodemailer';

const {
	SMTP_HOST,
	SMTP_PORT,
	SMTP_SECURE,
	SMTP_USER,
	SMTP_PASS,
	SMTP_FROM
} = process.env;

let transporter = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
	transporter = nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT || 587),
		secure: String(SMTP_SECURE || 'false') === 'true',
		auth: {
			user: SMTP_USER,
			pass: SMTP_PASS
		}
	});
}

export async function sendMail({ to, subject, text, html }) {
	if (!transporter) {
		// Email disabled; act as no-op
		return { skipped: true };
	}
	const from = SMTP_FROM || SMTP_USER;
	return transporter.sendMail({ from, to: to || SMTP_USER, subject, text, html });
}

