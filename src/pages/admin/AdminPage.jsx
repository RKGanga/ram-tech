import React, { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { adminApi, api, setAdminToken } from '../../lib/api.js'
import ContactInfoAdmin from './ContactInfoAdmin.jsx';
import { useToast } from '../../shared/ToastContext.jsx'

function useAdminAuth() {
	const [userId, setUserId] = useState('')
	const [password, setPassword] = useState('')
	const [valid, setValid] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	// Load saved token on mount and validate automatically
	useEffect(() => {
		console.log('useAdminAuth: checking for saved token')
		const token = localStorage.getItem('adminToken')
		if (token) {
			console.log('useAdminAuth: found token, setting and validating')
			setAdminToken(token)
			validate()
		} else {
			console.log('useAdminAuth: no token found')
		}
	}, [])

	async function login() {
		setLoading(true)
		setError('')
		try {
			const res = await adminApi.post('/login', { userId, password })
			const token = res.data?.token
			if (!token) throw new Error('No token returned')
			localStorage.setItem('adminToken', token)
			setAdminToken(token)
			await validate()
		} catch (e) {
			const msg = e?.response?.data?.error || e?.message || 'Login failed'
			setError(String(msg))
			setValid(false)
		} finally {
			setLoading(false)
		}
	}

	async function validate() {
		setLoading(true)
		setError('')
		try {
			await adminApi.get('/teachers')
			setValid(true)
		} catch (e) {
			setValid(false)
			const msg = e?.response?.data?.error || e?.message || 'Unauthorized'
			setError(String(msg))
		}
		finally { setLoading(false) }
	}

	function logout() {
		localStorage.removeItem('adminToken')
		setAdminToken(null)
		setValid(false)
	}

	return { userId, setUserId, password, setPassword, valid, loading, error, login, validate, logout }
}

function AdminLayout() {
	console.log('AdminLayout rendering')
	return (
		<div>
			<div className="admin-nav">
				<NavLink to="trainers" className={({ isActive }) => isActive ? 'active' : ''}>Trainers</NavLink>
				<NavLink to="courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
				<NavLink to="demo-classes" className={({ isActive }) => isActive ? 'active' : ''}>Demo Classes</NavLink>
				<NavLink to="statistics" className={({ isActive }) => isActive ? 'active' : ''}>Statistics</NavLink>
				<NavLink to="requests" className={({ isActive }) => isActive ? 'active' : ''}>Requests</NavLink>
				<NavLink to="contact-info" className={({ isActive }) => isActive ? 'active' : ''}>Contact Info</NavLink>
			</div>
			<Routes>
				<Route index element={<TeachersAdmin />} />
				<Route path="trainers" element={<TeachersAdmin />} />
				<Route path="courses" element={<CoursesAdmin />} />
				<Route path="demo-classes" element={<DemoClassesAdmin />} />
				<Route path="statistics" element={<StatisticsAdmin />} />
				<Route path="requests" element={<RequestsAdmin />} />
				<Route path="contact-info" element={<ContactInfoAdmin />} />
			</Routes>
		</div>
	)
}


export default function AdminPage() {
  const { userId, setUserId, password, setPassword, valid, loading, error, login } = useAdminAuth();
  if (!valid) {
	return (
	  <div style={{ maxWidth: 480, margin: '80px auto' }}>
		<h2>🔐 Admin Login</h2>
		<div className="card">
		  <label>User ID</label>
		  <input
			value={userId}
			onChange={e => setUserId(e.target.value)}
			placeholder="Enter admin user ID"
		  />
		  <label style={{ marginTop: 12 }}>Password</label>
		  <input
			type="password"
			value={password}
			onChange={e => setPassword(e.target.value)}
			placeholder="Enter password"
			onKeyDown={e => { if (e.key === 'Enter') login() }}
		  />
		  {error && <p style={{ color: 'crimson', marginTop: 8 }}>{error}</p>}
		  <div style={{ marginTop: 12 }}>
			<button onClick={login} disabled={loading || !userId || !password}>{loading ? <span className="loading"></span> : 'Login'}</button>
		  </div>
		  <p style={{ fontSize: 14, color: '#888' }}>Use your admin user ID and password.</p>
		</div>
	  </div>
	)
  }
  // Full page admin when logged in
  return (
	<div className="admin-root">
	  <AdminLayout />
	</div>
  )
}


function TeachersAdmin() {
	console.log('TeachersAdmin rendering')
	const [list, setList] = useState([])
	const [filter, setFilter] = useState('all')
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()
	
	async function loadTeachers() {
		setLoading(true)
		try {
			const url = filter === 'all' ? '/teachers' : `/teachers?status=${filter}`
			const response = await adminApi.get(url)
			setList(response.data)
		} catch (error) {
			console.error('Error loading teachers:', error)
			addToast('Failed to load teachers', 'error')
			setList([])
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { loadTeachers() }, [filter])
	
	async function act(id, action) {
		setLoading(true)
		try {
			await adminApi.post(`/teachers/${id}/${action}`)
			setList(s => s.filter(x => x.id !== id))
			addToast(`Trainer ${action}d successfully!`, 'success')
		} catch (error) {
			console.error(`Error ${action}ing teacher:`, error)
			addToast(`Failed to ${action} trainer. Please try again.`, 'error')
		} finally {
			setLoading(false)
		}
	}
	
	return (
		<div>
			<div className="segmented" style={{ marginBottom: 16 }}>
				<button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
				<button className={filter === 'pending' ? 'active' : ''} onClick={() => setFilter('pending')}>Pending</button>
				<button className={filter === 'approved' ? 'active' : ''} onClick={() => setFilter('approved')}>Approved</button>
				<button className={filter === 'rejected' ? 'active' : ''} onClick={() => setFilter('rejected')}>Rejected</button>
			</div>
			
			{loading && (
				<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
					<span className="loading"></span> Loading teachers...
				</div>
			)}
			
			{!loading && (
				<>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Expertise</th>
								<th>Experience</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{list.map(t => (
								<tr key={t.id}>
									<td><strong>{t.name}</strong></td>
									<td>{t.email}</td>
									<td>{t.phone}</td>
									<td>{t.expertise}</td>
									<td>{t.experience ? `${t.experience} years` : '-'}</td>
									<td><span className={`status ${t.status}`}>{t.status}</span></td>
									<td>
										{t.status === 'pending' && (
											<div style={{ display: 'flex', gap: 8 }}>
												<button onClick={() => act(t.id, 'approve')} disabled={loading}>✅ Approve</button>
												<button className="danger" onClick={() => act(t.id, 'reject')} disabled={loading}>❌ Reject</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{list.length === 0 && (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>👥</div>
							<h3>No teachers found</h3>
							<p>No teachers match the current filter criteria.</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

function CoursesAdmin() {
	const empty = { name: '', facultyName: '', startDate: '', timings: '', description: '', isPublished: true }
	const [form, setForm] = useState(empty)
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()
	
	function update(k, v) { setForm(s => ({ ...s, [k]: v })) }
	
	async function load() {
		setLoading(true)
		try {
			// Use the public API to get courses since there's no admin endpoint for listing
			const response = await api.get('/courses')
			setList(response.data)
		} catch (error) {
			console.error('Error loading courses:', error)
			addToast('Failed to load courses', 'error')
			setList([])
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { load() }, [])
	
	async function createCourse(e) {
		e.preventDefault()
		setLoading(true)
		try {
			await adminApi.post('/courses', { ...form })
			setForm(empty)
			await load()
			addToast('Course created successfully!', 'success')
		} catch (error) {
			console.error('Error creating course:', error)
			addToast('Failed to create course. Please try again.', 'error')
		} finally {
			setLoading(false)
		}
	}
	
	async function togglePublish(c) {
		setLoading(true)
		try {
			await adminApi.put(`/courses/${c.id}`, { isPublished: !c.isPublished })
			await load()
			addToast(`Course ${c.isPublished ? 'unpublished' : 'published'} successfully!`, 'success')
		} catch (error) {
			console.error('Error updating course:', error)
			addToast('Failed to update course. Please try again.', 'error')
		} finally {
			setLoading(false)
		}
	}
	
	async function remove(c) {
		if (confirm('Are you sure you want to delete this course?')) {
			setLoading(true)
			try {
				await adminApi.delete(`/courses/${c.id}`)
				await load()
				addToast('Course deleted successfully!', 'success')
			} catch (error) {
				console.error('Error deleting course:', error)
				addToast('Failed to delete course. Please try again.', 'error')
			} finally {
				setLoading(false)
			}
		}
	}
	
	return (
		<div>
			<div className="card">
				<h3>➕ Create New Course</h3>
				<form onSubmit={createCourse}>
					<div className="row two">
						<div>
							<label>Course Name *</label>
							<input value={form.name} onChange={e => update('name', e.target.value)} required />
						</div>
						<div>
							<label>Faculty Name</label>
							<input value={form.facultyName} onChange={e => update('facultyName', e.target.value)} />
						</div>
					</div>
					<div className="row two">
						<div>
							<label>Start Date</label>
							<input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} />
						</div>
						<div>
							<label>Timings</label>
							<input value={form.timings} onChange={e => update('timings', e.target.value)} placeholder="e.g., 7-9 PM IST" />
						</div>
					</div>
					<div>
						<label>Description</label>
						<textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)} />
					</div>
					<div>
						<label>
							<input type="checkbox" checked={form.isPublished} onChange={e => update('isPublished', e.target.checked)} /> 
							Published (visible to students)
						</label>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? <span className="loading"></span> : 'Add Course'}
					</button>
				</form>
			</div>

			<div className="spacer" />

			<h3>📚 Manage Courses</h3>
			{loading && (
				<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
					<span className="loading"></span> Loading courses...
				</div>
			)}
			{!loading && (
				<>
					<table>
						<thead>
							<tr>
								<th>Course Name</th>
								<th>Faculty</th>
								<th>Start Date</th>
								<th>Timings</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{list.map(c => (
								<tr key={c.id}>
									<td><strong>{c.name}</strong></td>
									<td>{c.facultyName || '-'}</td>
									<td>{c.startDate || '-'}</td>
									<td>{c.timings || '-'}</td>
									<td>
										<span className={`status ${c.isPublished ? 'approved' : 'pending'}`}>
											{c.isPublished ? 'Published' : 'Draft'}
										</span>
									</td>
									<td>
										<div style={{ display: 'flex', gap: 8 }}>
											<button onClick={() => togglePublish(c)} disabled={loading}>
												{c.isPublished ? '📝 Unpublish' : '✅ Publish'}
											</button>
											<button className="danger" onClick={() => remove(c)} disabled={loading}>🗑️ Delete</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{list.length === 0 && (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>📚</div>
							<h3>No courses available</h3>
							<p>Create your first course using the form above.</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

function RequestsAdmin() {
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	
	async function loadRequests() {
		setLoading(true)
		try {
			const response = await adminApi.get('/requests')
			setList(response.data)
		} catch (error) {
			console.error('Error loading requests:', error)
			setList([])
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { loadRequests() }, [])
	
	return (
		<div>
			<h3>📋 Student Requests</h3>
			{loading && (
				<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
					<span className="loading"></span> Loading requests...
				</div>
			)}
			{!loading && (
				<>
					<table>
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Course</th>
								<th>Preferred Date</th>
								<th>Message</th>
								<th>Received</th>
							</tr>
						</thead>
						<tbody>
							{list.map(r => (
								<tr key={r.id}>
									<td><strong>{r.name}</strong></td>
									<td>{r.email}</td>
									<td>{r.phone}</td>
									<td><span className="status approved">{r.course}</span></td>
									<td>{r.preferredDate || '-'}</td>
									<td>{r.message || '-'}</td>
									<td>{new Date(r.createdAt).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
					{list.length === 0 && (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>📋</div>
							<h3>No student requests yet</h3>
							<p>Student inquiries will appear here once they submit requests.</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

function DemoClassesAdmin() {
	const [list, setList] = useState([])
	const [loading, setLoading] = useState(false)
	const [showForm, setShowForm] = useState(false)
	const [editing, setEditing] = useState(null)
	const [form, setForm] = useState({ name: '', facultyName: '', startDate: '', timings: '', description: '', isPublished: true })
	const { addToast } = useToast()
	
	async function loadDemoClasses() {
		setLoading(true)
		try {
			const response = await adminApi.get('/demo-classes')
			setList(response.data)
		} catch (error) {
			console.error('Error loading demo classes:', error)
			addToast('Failed to load demo classes', 'error')
			setList([])
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { loadDemoClasses() }, [])
	
	function resetForm() {
		setForm({ name: '', facultyName: '', startDate: '', timings: '', description: '', isPublished: true })
		setEditing(null)
		setShowForm(false)
	}
	
	async function handleSubmit(e) {
		e.preventDefault()
		setLoading(true)
		try {
			if (editing) {
				await adminApi.put(`/demo-classes/${editing.id}`, form)
				addToast('Demo class updated successfully!', 'success')
			} else {
				await adminApi.post('/demo-classes', form)
				addToast('Demo class created successfully!', 'success')
			}
			resetForm()
			loadDemoClasses()
		} catch (error) {
			const msg = error?.response?.data?.error || 'Failed to save demo class'
			addToast(msg, 'error')
		} finally {
			setLoading(false)
		}
	}
	
	async function remove(demoClass) {
		if (!confirm(`Delete demo class "${demoClass.name}"?`)) return
		setLoading(true)
		try {
			await adminApi.delete(`/demo-classes/${demoClass.id}`)
			addToast('Demo class deleted successfully!', 'success')
			loadDemoClasses()
		} catch (error) {
			addToast('Failed to delete demo class', 'error')
		} finally {
			setLoading(false)
		}
	}
	
	function edit(demoClass) {
		setForm({
			name: demoClass.name,
			facultyName: demoClass.facultyName || '',
			startDate: demoClass.startDate || '',
			timings: demoClass.timings || '',
			description: demoClass.description || '',
			isPublished: demoClass.isPublished
		})
		setEditing(demoClass)
		setShowForm(true)
	}
	
	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
				<h3>🎓 Demo Classes Management</h3>
				<button onClick={() => setShowForm(true)} disabled={loading}>
					{showForm ? '❌ Cancel' : '➕ Add Demo Class'}
				</button>
			</div>
			
			{showForm && (
				<div className="card" style={{ marginBottom: 20 }}>
					<h4>{editing ? 'Edit Demo Class' : 'Add New Demo Class'}</h4>
					<form onSubmit={handleSubmit}>
						<div className="row two">
							<div>
								<label>Demo Class Name *</label>
								<input 
									value={form.name} 
									onChange={e => setForm(s => ({ ...s, name: e.target.value }))} 
									required 
									placeholder="e.g., SAP FICO Demo Class"
								/>
							</div>
							<div>
								<label>Faculty Name</label>
								<input 
									value={form.facultyName} 
									onChange={e => setForm(s => ({ ...s, facultyName: e.target.value }))} 
									placeholder="e.g., John Doe"
								/>
							</div>
						</div>
						<div className="row two">
							<div>
								<label>Start Date</label>
								<input 
									type="date" 
									value={form.startDate} 
									onChange={e => setForm(s => ({ ...s, startDate: e.target.value }))} 
								/>
							</div>
							<div>
								<label>Timings</label>
								<input 
									value={form.timings} 
									onChange={e => setForm(s => ({ ...s, timings: e.target.value }))} 
									placeholder="e.g., 10:00 AM - 12:00 PM"
								/>
							</div>
						</div>
						<div>
							<label>Description</label>
							<textarea 
								value={form.description} 
								onChange={e => setForm(s => ({ ...s, description: e.target.value }))} 
								placeholder="Brief description of the demo class"
								rows={3}
							/>
						</div>
						<div style={{ marginTop: 12 }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<input 
									type="checkbox" 
									checked={form.isPublished} 
									onChange={e => setForm(s => ({ ...s, isPublished: e.target.checked }))} 
								/>
								Publish immediately
							</label>
						</div>
						<div style={{ marginTop: 16 }}>
							<button type="submit" disabled={loading}>
								{loading ? <span className="loading"></span> : (editing ? 'Update Demo Class' : 'Create Demo Class')}
							</button>
							{editing && (
								<button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
									Cancel
								</button>
							)}
						</div>
					</form>
				</div>
			)}
			
			{loading && !showForm && (
				<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
					<span className="loading"></span> Loading demo classes...
				</div>
			)}
			
			{!loading && (
				<>
					<table>
						<thead>
							<tr>
								<th>Demo Class</th>
								<th>Faculty</th>
								<th>Date</th>
								<th>Time</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{list.map(d => (
								<tr key={d.id}>
									<td>
										<strong>{d.name}</strong>
										{d.description && <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>{d.description}</div>}
									</td>
									<td>{d.facultyName || '-'}</td>
									<td>{d.startDate ? new Date(d.startDate).toLocaleDateString() : '-'}</td>
									<td>{d.timings || '-'}</td>
									<td>
										<span className={`status ${d.isPublished ? 'approved' : 'pending'}`}>
											{d.isPublished ? 'Published' : 'Draft'}
										</span>
									</td>
									<td>
										<div style={{ display: 'flex', gap: 8 }}>
											<button onClick={() => edit(d)} disabled={loading}>
												✏️ Edit
											</button>
											<button className="danger" onClick={() => remove(d)} disabled={loading}>
												🗑️ Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{list.length === 0 && (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>🎓</div>
							<h3>No demo classes available</h3>
							<p>Create your first demo class using the form above.</p>
						</div>
					)}
				</>
			)}
		</div>
	)
}

function StatisticsAdmin() {
	const [stats, setStats] = useState({ years: 0, courses: 0, students: 0, placements: 0 })
	const [loading, setLoading] = useState(false)
	const { addToast } = useToast()
	
	async function loadStats() {
		setLoading(true)
		try {
			const response = await adminApi.get('/stats')
			setStats(response.data)
		} catch (error) {
			console.error('Error loading statistics:', error)
			addToast('Failed to load statistics', 'error')
		} finally {
			setLoading(false)
		}
	}
	
	useEffect(() => { loadStats() }, [])
	
	async function handleSubmit(e) {
		e.preventDefault()
		setLoading(true)
		try {
			await adminApi.put('/stats', stats)
			addToast('Statistics updated successfully!', 'success')
		} catch (error) {
			const msg = error?.response?.data?.error || 'Failed to update statistics'
			addToast(msg, 'error')
		} finally {
			setLoading(false)
		}
	}
	
	function updateField(field, value) {
		const numValue = parseInt(value) || 0
		setStats(prev => ({ ...prev, [field]: numValue }))
	}
	
	return (
		<div>
			<h3>📊 Statistics Management</h3>
			<p style={{ color: '#888', marginBottom: 20 }}>Update the statistics displayed on the homepage.</p>
			
			<div className="card">
				<form onSubmit={handleSubmit}>
					<div className="row two">
						<div>
							<label>Years of Experience</label>
							<input 
								type="number" 
								min="0"
								value={stats.years} 
								onChange={e => updateField('years', e.target.value)} 
								placeholder="e.g., 5"
							/>
						</div>
						<div>
							<label>Number of Courses</label>
							<input 
								type="number" 
								min="0"
								value={stats.courses} 
								onChange={e => updateField('courses', e.target.value)} 
								placeholder="e.g., 12"
							/>
						</div>
					</div>
					<div className="row two">
						<div>
							<label>Total Students</label>
							<input 
								type="number" 
								min="0"
								value={stats.students} 
								onChange={e => updateField('students', e.target.value)} 
								placeholder="e.g., 1250"
							/>
						</div>
						<div>
							<label>Successful Placements</label>
							<input 
								type="number" 
								min="0"
								value={stats.placements} 
								onChange={e => updateField('placements', e.target.value)} 
								placeholder="e.g., 980"
							/>
						</div>
					</div>
					<button type="submit" disabled={loading}>
						{loading ? <span className="loading"></span> : 'Update Statistics'}
					</button>
				</form>
			</div>
			
			<div className="spacer" />
			
			<h4>Preview</h4>
			<div className="card" style={{ background: 'var(--surface-dark)' }}>
				<div className="stats-container" style={{ maxWidth: '100%', gap: '15px' }}>
					<div className="stat-item" style={{ padding: '15px', margin: 0 }}>
						<div className="stat-number">{stats.years}</div>
						<div className="stat-label">No. of Years</div>
					</div>
					<div className="stat-item" style={{ padding: '15px', margin: 0 }}>
						<div className="stat-number">{stats.courses}</div>
						<div className="stat-label">Courses</div>
					</div>
					<div className="stat-item" style={{ padding: '15px', margin: 0 }}>
						<div className="stat-number">{stats.students.toLocaleString()}</div>
						<div className="stat-label">Students</div>
					</div>
					<div className="stat-item" style={{ padding: '15px', margin: 0 }}>
						<div className="stat-number">{stats.placements.toLocaleString()}</div>
						<div className="stat-label">Placements</div>
					</div>
				</div>
			</div>
		</div>
	)
}

