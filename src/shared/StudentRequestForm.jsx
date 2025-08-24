import React, { useState, useMemo } from 'react'
import { api } from '../lib/api.js'
import { useToast } from './ToastContext.jsx'
import { useSearchParams } from 'react-router-dom'

const DEFAULT_COURSES = ['FICO','ABAP','MM','SD','HR/HCM','SuccessFactors','PP','Basis','EWM']

export default function StudentRequestForm({ courseName, onSuccess }) {
	const [params] = useSearchParams()
	const urlCourse = (params.get('course') || '').trim()
	const coursesList = useMemo(() => {
		if (urlCourse && !DEFAULT_COURSES.includes(urlCourse)) {
			return [urlCourse, ...DEFAULT_COURSES]
		}
		return DEFAULT_COURSES
	}, [urlCourse])

	const [form, setForm] = useState({ name: '', email: '', phone: '', course: courseName || urlCourse || coursesList[0], preferredDate: '', message: '' })
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()

	function update(k, v) { setForm(s => ({ ...s, [k]: v })) }

	async function handleSubmit(e) {
		e.preventDefault()
		setLoading(true)
		try {
			await api.post('/requests', form)
			addToast('Thank you! We will contact you soon.', 'success')
			setForm({ name: '', email: '', phone: '', course: courseName || urlCourse || coursesList[0], preferredDate: '', message: '' })
			if (onSuccess) onSuccess();
		} catch (err) {
			addToast(err?.response?.data?.error || 'Submission failed. Please try again.', 'error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
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
						<label>Select Course *</label>
						{courseName ? (
							<input value={courseName} disabled style={{ background: '#232b39', color: '#b6c8ff', border: 'none', fontWeight: 600 }} />
						) : (
							<select value={form.course} onChange={e => update('course', e.target.value)}>
								{coursesList.map(c => <option key={c} value={c}>{c}</option>)}
							</select>
						)}
					</div>
				</div>
				<div className="row two">
					<div>
						<label>Preferred Start Date</label>
						<input type="date" value={form.preferredDate} onChange={e => update('preferredDate', e.target.value)} />
					</div>
					<div>
						<label>Additional Message</label>
						<input value={form.message} onChange={e => update('message', e.target.value)} placeholder="Any specific requirements or questions?" />
					</div>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? <span className="loading"></span> : 'Submit Request'}
				</button>
			</form>
		</div>
	)
}

