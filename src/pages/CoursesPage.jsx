import React, { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import StudentRequestForm from '../shared/StudentRequestForm.jsx'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [registerModal, setRegisterModal] = useState({ open: false, course: null });
  useEffect(() => {
	api.get('/courses').then(r => setCourses(r.data)).catch(() => setCourses([]))
  }, [])

  function openRegisterModal(name) {
	setRegisterModal({ open: true, course: name });
  }

  return (
	<div style={{ fontFamily: 'Inter, sans-serif', background: '#181f2a', minHeight: '100vh', color: '#e6e6e6', position: 'relative', overflow: 'hidden' }}>
	  {/* Featured SAP Banner */}
	  <section className="section" style={{ background: 'linear-gradient(90deg, #232b39 60%, #ffd16622 100%)', borderRadius: 18, margin: '2.5rem auto 1.5rem auto', maxWidth: 1100, padding: '2.5rem 2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
		<h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#ffd166', marginBottom: 12, letterSpacing: '-1px' }}>SAP Training Programs</h1>
		<p style={{ fontSize: '1.15rem', color: '#b6c8ff', maxWidth: 700, margin: '0 auto', opacity: 0.95 }}>
		  Master SAP with hands-on, job-oriented courses. Real projects, expert trainers, and placement support for your career success.
		</p>
	  </section>

	  {/* Main flex row: left sidebar, main, right sidebar */}
	  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', width: '100%', maxWidth: 1500, margin: '0 auto', gap: 0 }}>
		{/* Left SAP facts/sidebar */}
		<aside style={{
		  position: 'sticky',
		  top: 110,
		  left: 0,
		  width: 280,
		  minWidth: 220,
		  maxWidth: 320,
		  height: 'fit-content',
		  background: 'none',
		  zIndex: 2,
		  padding: '0 0 0 8px',
		  display: 'flex',
		  flexDirection: 'column',
		  gap: 24,
		  pointerEvents: 'auto',
		}}>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#ffd166', boxShadow: '0 2px 12px #0002', marginBottom: 8 }}>
			<b>Did you know?</b><br />
			SAP is used by 99 of the 100 largest companies in the world for their business operations.
		  </div>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#b6c8ff', boxShadow: '0 2px 12px #0002' }}>
			<b>Career Tip:</b><br />
			SAP consultants earn among the highest salaries in the IT sector, especially with certifications in FICO, ABAP, or HANA.
		  </div>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#b6c8ff', boxShadow: '0 2px 12px #0002' }}>
			<b>Popular SAP Modules:</b>
			<ul style={{ margin: '8px 0 0 16px', color: '#ffd166', fontSize: '0.98rem' }}>
			  <li>FICO (Finance & Controlling)</li>
			  <li>ABAP (Programming)</li>
			  <li>SD (Sales & Distribution)</li>
			  <li>MM (Materials Management)</li>
			  <li>HCM (Human Capital)</li>
			</ul>
		  </div>
		</aside>

		{/* Main content area (courses grid and below) */}
		<div style={{ flex: 1, minWidth: 0, maxWidth: 900, padding: '0 18px' }}>
		  {/* SAP Courses Grid */}
		  <section className="section" style={{ margin: '2rem 0', padding: '0 1rem', position: 'relative', zIndex: 1 }}>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
			  {courses.length === 0 && (
				<div className="card" style={{ textAlign: 'center', padding: '28px', minWidth: 320, background: '#232b39', borderRadius: 18 }}>
				  <div className="feature-icon" style={{ margin: '0 auto 12px', fontSize: '2.2rem' }}>📚</div>
				  <h3>No courses available yet</h3>
				  <p>We're working on adding exciting new courses. Check back soon!</p>
				</div>
			  )}
			  {courses.map(c => (
				<div key={c.id} className="card course-card-small" style={{ background: '#232b39', borderRadius: 18, minWidth: 320, maxWidth: 370, boxShadow: '0 2px 16px #0003', padding: '2rem 1.5rem', margin: '0.5rem 0' }}>
				  <h3 style={{ color: '#ffd166', fontSize: '1.3rem', marginBottom: 8 }}>{c.name}</h3>
				  <div className="meta-row" style={{ fontSize: '1rem', color: '#b6c8ff', marginBottom: 8 }}>
					<span><strong>Faculty:</strong> {c.facultyName || 'TBA'}</span><br />
					<span><strong>Start:</strong> {c.startDate || 'TBA'}</span><br />
					<span><strong>Time:</strong> {c.timings || 'TBA'}</span>
				  </div>
				  {c.description && <p className="desc-sm" style={{ color: '#e6e6e6', fontSize: '1.05rem', marginBottom: 10 }}>{c.description}</p>}
				  <div className="row-actions" style={{ marginTop: 10 }}>
					<button onClick={() => openRegisterModal(c.name)} style={{ background: '#ffd166', color: '#232b39', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', cursor: 'pointer' }}>Register Now</button>
				  </div>
				</div>
			  ))}
			</div>
			{/* Course Registration Modal (rendered once, outside the map) */}
			{registerModal.open && (
			  <div style={{
				position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
			  }}>
				<div style={{ background: '#232b39', borderRadius: 16, padding: 32, minWidth: 340, maxWidth: '90vw', boxShadow: '0 8px 32px #000a', position: 'relative' }}>
				  <button onClick={() => setRegisterModal({ open: false, course: null })} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>&times;</button>
				  <h2 style={{ color: '#ffd166', marginBottom: 12 }}>Register for {registerModal.course}</h2>
				  <StudentRequestForm courseName={registerModal.course} onSuccess={() => setRegisterModal({ open: false, course: null })} />
				</div>
			  </div>
			)}
		  </section>

		  {/* Why Ram Tech for SAP? */}
		  <section className="section" style={{ margin: '2rem 0', padding: '0 1rem' }}>
			<div className="card" style={{ padding: 32, background: '#202736', borderRadius: 18, boxShadow: '0 2px 12px #0002' }}>
			  <h2 style={{ color: '#ffd166', marginBottom: 18 }}>Why learn SAP with Ram Tech?</h2>
			  <ul className="bulleted" style={{ fontSize: '1.08rem', color: '#b6c8ff', marginBottom: 0 }}>
				<li>Industry‑aligned syllabus: FICO, ABAP, SD, MM, HCM, SuccessFactors, EWM, and more.</li>
				<li>Hands‑on labs with real business scenarios and guided case studies.</li>
				<li>Interview prep: resume building, mock interviews, and FAQs for each module.</li>
				<li>Placement assistance via partner companies and alumni network.</li>
				<li>Software installation support and lifetime technical doubt clearing.</li>
			  </ul>
			</div>
		  </section>

		  {/* SAP Career & Testimonials */}
		  <section className="section" style={{ margin: '2rem 0 3rem 0', padding: '0 1rem' }}>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
			  <div className="card" style={{ flex: '1 1 340px', minWidth: 320, background: '#232b39', borderRadius: 18, padding: '2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
				<div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🚀</div>
				<h3 style={{ color: '#ffd166', fontSize: '1.2rem', marginBottom: 8 }}>SAP Career Opportunities</h3>
				<p style={{ fontSize: '1.08rem', color: '#b6c8ff' }}>SAP professionals are in high demand across industries. Roles include SAP Consultant, Analyst, Developer, and Project Manager. Our alumni work at top MNCs and IT firms.</p>
			  </div>
			  <div className="card" style={{ flex: '1 1 340px', minWidth: 320, background: '#232b39', borderRadius: 18, padding: '2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
				<div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🌟</div>
				<h3 style={{ color: '#ffd166', fontSize: '1.2rem', marginBottom: 8 }}>Student Success Stories</h3>
				<p style={{ fontSize: '1.08rem', color: '#b6c8ff' }}>
				  "Ram Tech's SAP course helped me land my first job as an SAP FICO consultant! The hands-on labs and interview prep were game changers."<br /><span style={{ color: '#ffd166' }}>– Priya S.</span>
				</p>
				<p style={{ fontSize: '1.08rem', color: '#b6c8ff' }}>
				  "Great trainers and real-world projects. I got placed at Infosys after completing the ABAP module!"<br /><span style={{ color: '#ffd166' }}>– Rahul K.</span>
				</p>
			  </div>
			</div>
		  </section>
		</div>

		{/* Right SAP info/sidebar */}
		<aside style={{
		  position: 'sticky',
		  top: 110,
		  right: 0,
		  width: 280,
		  minWidth: 220,
		  maxWidth: 320,
		  height: 'fit-content',
		  background: 'none',
		  zIndex: 2,
		  padding: '0 8px 0 0',
		  display: 'flex',
		  flexDirection: 'column',
		  gap: 24,
		  alignItems: 'flex-end',
		  pointerEvents: 'auto',
		}}>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#ffd166', boxShadow: '0 2px 12px #0002', marginBottom: 8, textAlign: 'right' }}>
			<b>Career Fact:</b><br />
			SAP certification can increase your job opportunities and salary potential by 20-30%.
		  </div>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#b6c8ff', boxShadow: '0 2px 12px #0002', textAlign: 'right' }}>
			<b>Certification Tip:</b><br />
			SAP offers global certifications for modules like FICO, ABAP, and HANA. Certification exams are available online and at authorized centers.
		  </div>
		  <div style={{ background: '#232b39', borderRadius: 14, padding: '1.1rem 1rem', fontSize: '1.01rem', color: '#b6c8ff', boxShadow: '0 2px 12px #0002', textAlign: 'right' }}>
			<b>About SAP:</b><br />
			Founded in 1972, SAP is the world leader in enterprise application software, helping companies of all sizes run better.
		  </div>
		</aside>
	  </div>
	</div>
  )
}

