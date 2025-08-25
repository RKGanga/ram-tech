import { z } from 'zod';

export const TeacherRegistrationSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(7),
	expertise: z.string().min(2),
	experience: z.union([z.number().int().nonnegative(), z.string()]).optional(),
	bio: z.string().max(2000).optional()
});

export const StudentRequestSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	phone: z.string().min(7),
	course: z.string().min(2),
	preferredDate: z.string().optional(),
	message: z.string().max(2000).optional()
});

export const CourseCreateSchema = z.object({
	name: z.string().min(2),
	facultyName: z.string().min(2).optional(),
	startDate: z.string().optional(),
	timings: z.string().optional(),
	description: z.string().optional(),
	isPublished: z.boolean().optional()
});

export const CourseUpdateSchema = CourseCreateSchema.partial();

export function parseBody(schema, body) {
	const parsed = schema.safeParse(body);
	if (!parsed.success) {
		const message = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
		const error = new Error(message);
		error.status = 400;
		throw error;
	}
	return parsed.data;
}

