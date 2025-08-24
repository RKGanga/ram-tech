import React, { useState } from 'react'
import { api } from '../lib/api.js'
import { useToast } from '../shared/ToastContext.jsx'

export default function TrainerRegisterPage() {
	const [form, setForm] = useState({ name: '', email: '', phone: '', expertise: '', experience: '', bio: '' })
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()

	async function handleSubmit(e) {
		e.preventDefault()
		setLoading(true)
		try {
			const payload = { ...form, experience: form.experience ? Number(form.experience) : undefined }
			await api.post('/trainers/register', payload)
			addToast('Application submitted successfully! Await admin approval.', 'success')
			setForm({ name: '', email: '', phone: '', expertise: '', experience: '', bio: '' })
		} catch (err) {
			addToast(err?.response?.data?.error || 'Failed to submit application. Please try again.', 'error')
		} finally {
			setLoading(false)
		}
	}

	function update(k, v) { setForm(s => ({ ...s, [k]: v })) }

	return (
		<div>
			<section className="hero">
				<h1>Trainer Registration</h1>
				<p>Join our team of expert SAP instructors and help shape the future of technology education</p>
			</section>

			<section className="section">
				<form onSubmit={handleSubmit}>
					<div className="row two">
						<div>
							<label>Full Name *</label>
							<input value={form.name} onChange={e => update('name', e.target.value)} required />
						</div>
						<div>
							<label>Email Address *</label>
							<input type="email" value={form.email} onChange={e => update('email', e.target.value)} required />
						</div>
					</div>
					<div className="row two">
						<div>
							<label>Phone Number *</label>
							<input value={form.phone} onChange={e => update('phone', e.target.value)} required />
						</div>
						<div>
							<label>SAP Expertise (Course) *</label>
							<input value={form.expertise} onChange={e => update('expertise', e.target.value)} placeholder="e.g., FICO, ABAP, MM, SD" required />
						</div>
					</div>
					<div className="row two">
						<div>
							<label>Years of Experience</label>
							<input type="number" min="0" value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="e.g., 5" />
						</div>
						<div>
							<label>Short Bio</label>
							<input value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell us about your background" />
						</div>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? <span className="loading"></span> : 'Submit Application'}
					</button>
				</form>
			</section>
		</div>
	)
}
