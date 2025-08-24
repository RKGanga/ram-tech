import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentRequestForm from '../shared/StudentRequestForm';
import { api } from '../lib/api';



function HomePage() {
  const cubeFaceStyle = {
	position: 'absolute',
	width: 150,
	height: 150,
	background: 'rgba(255,255,255,0.05)',
	border: '1px solid rgba(255,255,255,0.2)',
	backdropFilter: 'blur(10px)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontWeight: 700,
	color: '#fff',
	fontSize: 16,
	textShadow: '0 0 20px currentColor'
  };
  const moduleCardStyle = {
	position: 'absolute',
	padding: '20px 30px',
	background: 'rgba(255,255,255,0.05)',
	backdropFilter: 'blur(20px)',
	border: '1px solid rgba(255,255,255,0.1)',
	borderRadius: 20,
	fontWeight: 600,
	fontSize: 14,
	textTransform: 'uppercase',
	letterSpacing: 1,
	transition: 'all 0.3s',
	cursor: 'pointer',
	zIndex: 100
  };
  const FEATURES = [
	{
	  icon: '👨‍🏫',
	  title: 'Expert Faculty',
	  description: 'Learn from experienced SAP professionals with real-world expertise and industry insights.'
	},
	{
	  icon: '⏰',
	  title: 'Flexible Timings',
	  description: 'Weekday and weekend batches to suit your schedule and personal commitments.'
	},
	{
	  icon: '🎯',
	  title: '100% Placement Assistance',
	  description: 'Resume preparation, interview guidance, and direct placement support for your career growth.'
	},
	{
	  icon: '💻',
	  title: 'Software Installation Support',
	  description: 'Complete setup assistance for SAP software and development environment configuration.'
	},
	{
	  icon: '📚',
	  title: 'Comprehensive Curriculum',
	  description: 'Industry-aligned course content covering all major SAP modules and latest technologies.'
	},
	{
	  icon: '🤝',
	  title: 'Lifetime Support',
	  description: 'Ongoing technical support and career guidance even after course completion.'
	}
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [registerModal, setRegisterModal] = useState({ open: false, course: null });
  // Open modal if navigated from CoursesPage with state
  useEffect(() => {
	if (location.state && location.state.register && location.state.course) {
	  setRegisterModal({ open: true, course: location.state.course });
	  // Remove state after opening modal to prevent reopening on refresh
	  navigate(location.pathname, { replace: true, state: {} });
	}
  }, [location, navigate]);
  // --- Animated Hero Section JS Effects ---
  // Particle system, cube mouse movement, ripple effect (unchanged)
  React.useEffect(() => {
	// Particle system
	const particlesContainer = document.getElementById('particles');
	if (particlesContainer && particlesContainer.childElementCount === 0) {
	  const particleCount = 50;
	  for (let i = 0; i < particleCount; i++) {
		const particle = document.createElement('div');
		particle.className = 'particle';
		particle.style.left = Math.random() * 100 + '%';
		particle.style.animationDelay = Math.random() * 20 + 's';
		particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
		particle.style.animation = `particleFloat ${particle.style.animationDuration} infinite linear`;
		particlesContainer.appendChild(particle);
	  }
	}
	// Mouse movement effect
	const mouseMoveHandler = (e) => {
	  const x = e.clientX / window.innerWidth;
	  const y = e.clientY / window.innerHeight;
	  document.querySelectorAll('.cube').forEach((cube, index) => {
		const speed = (index + 1) * 0.5;
		cube.style.transform = `
		  translateX(${(x - 0.5) * speed * 20}px)
		  translateY(${(y - 0.5) * speed * 20}px)
		  rotateX(${360 * x}deg)
		  rotateY(${360 * y}deg)
		`;
	  });
	};
	document.addEventListener('mousemove', mouseMoveHandler);
	// Ripple effect
	const clickHandler = (e) => {
	  const ripple = document.createElement('div');
	  ripple.style.position = 'fixed';
	  ripple.style.left = e.clientX + 'px';
	  ripple.style.top = e.clientY + 'px';
	  ripple.style.width = '1px';
	  ripple.style.height = '1px';
	  ripple.style.background = 'rgba(255, 255, 255, 0.5)';
	  ripple.style.borderRadius = '50%';
	  ripple.style.pointerEvents = 'none';
	  ripple.style.transform = 'translate(-50%, -50%)';
	  ripple.style.animation = 'rippleEffect 1s ease-out';
	  document.body.appendChild(ripple);
	  setTimeout(() => ripple.remove(), 1000);
	};
	document.addEventListener('click', clickHandler);
	// Ripple animation keyframes
	const style = document.createElement('style');
	style.textContent = `@keyframes rippleEffect { to { width: 300px; height: 300px; opacity: 0; } }`;
	document.head.appendChild(style);
	return () => {
	  document.removeEventListener('mousemove', mouseMoveHandler);
	  document.removeEventListener('click', clickHandler);
	  if (style.parentNode) style.parentNode.removeChild(style);
	};
  }, []);

  // --- Animated SAP Module Cards ---
  // Each module card will orbit in an ellipse with unique parameters
  const moduleOrbitParams = [
	// [radiusX, radiusY, centerX, centerY, speed, phase]
	[120, 60, 0.18, 0.18, 0.7, 0],      // SAP FICO
	[120, 60, 0.82, 0.15, 0.8, Math.PI/2], // SAP ABAP
	[100, 80, 0.22, 0.45, 0.6, Math.PI],   // SAP MM
	[100, 80, 0.78, 0.38, 0.65, Math.PI*1.5], // SAP SD
	[90, 50, 0.68, 0.22, 0.9, Math.PI/3], // SAP HR/HCM
	[80, 60, 0.28, 0.32, 0.85, Math.PI*1.2], // SAP Basis
  ];
  const [modulePositions, setModulePositions] = React.useState(
	moduleOrbitParams.map(([rx, ry, cx, cy, speed, phase]) => ({ top: '0%', left: '0%' }))
  );
  React.useEffect(() => {
	let running = true;
	function animate() {
	  const t = performance.now() / 1000;
	  setModulePositions(
		moduleOrbitParams.map(([rx, ry, cx, cy, speed, phase]) => {
		  // cx, cy are as a fraction of container width/height
		  const angle = t * speed + phase;
		  const x = cx + Math.cos(angle) * rx / 1000; // 1000 = container width normalization
		  const y = cy + Math.sin(angle) * ry / 1000;
		  return {
			left: `calc(${(x * 100).toFixed(2)}% - 70px)`, // 70px = half card width
			top: `calc(${(y * 100).toFixed(2)}% - 30px)`,  // 30px = half card height
		  };
		})
	  );
	  if (running) requestAnimationFrame(animate);
	}
	animate();
	return () => { running = false; };
  }, []);
  const [demoClasses, setDemoClasses] = useState([])
  const [demoModal, setDemoModal] = useState({ open: false, demo: null });
  const [courses, setCourses] = useState([])
  const [stats, setStats] = useState({
	years: 0,
	courses: 0,
	students: 0,
	placements: 0
  })
  const [statsLoaded, setStatsLoaded] = useState(false)
  const [animatedStats, setAnimatedStats] = useState({ years: 0, courses: 0, students: 0, placements: 0 })
  const [hasAnimated, setHasAnimated] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
	// Load demo classes
	api.get('/demo-classes').then(res => setDemoClasses(res.data)).catch(console.error)
	// Load courses
	api.get('/courses').then(res => setCourses(res.data)).catch(console.error)
	// Load statistics
	api.get('/stats').then(res => {
	  setStats(res.data)
	  setStatsLoaded(true)
	}).catch(() => {
	  // Use default stats if API fails
	  setStats({
		years: 5,
		courses: 12,
		students: 1250,
		placements: 980
	  })
	  setStatsLoaded(true)
	})
  }, [])

  // Helper: filter for upcoming demos (today or future)
  function getUpcomingDemos() {
	const today = new Date();
	today.setHours(0,0,0,0);
	return demoClasses.filter(d => {
	  if (!d.startDate) return false;
	  const demoDate = new Date(d.startDate);
	  demoDate.setHours(0,0,0,0);
	  return demoDate >= today;
	});
  }

  // Count-up animation triggered when stats section enters viewport
  useEffect(() => {
	if (!statsLoaded || !statsRef.current || hasAnimated) return
	const el = statsRef.current
	const observer = new IntersectionObserver(entries => {
	  entries.forEach(entry => {
		if (entry.isIntersecting && !hasAnimated) {
		  const durationMs = 1600
		  const start = performance.now()
		  const startVals = { years: 0, courses: 0, students: 0, placements: 0 }
		  function tick(now) {
			const progress = Math.min(1, (now - start) / durationMs)
			setAnimatedStats({
			  years: Math.round(startVals.years + progress * stats.years),
			  courses: Math.round(startVals.courses + progress * stats.courses),
			  students: Math.round(startVals.students + progress * stats.students),
			  placements: Math.round(startVals.placements + progress * stats.placements)
			})
			if (progress < 1) requestAnimationFrame(tick)
		  }
		  requestAnimationFrame(tick)
		  setHasAnimated(true)
		  observer.disconnect()
		}
	  })
	}, { threshold: 0.3 })
	observer.observe(el)
	return () => observer.disconnect()
  }, [statsLoaded, stats, hasAnimated])

  function formatNumber(n) {
	return n.toLocaleString()
  }

	// ...existing code...
	return (
		<div>
	   {/* Animated Hero Section */}
	   <section className="hero-container" style={{position: 'relative', width: '100%', minHeight: '100vh', background: '#000', overflow: 'hidden', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', paddingTop: 80}}>
		 {/* Advanced Gradient Background */}
		 <div className="gradient-bg" style={{position: 'absolute', width: '200%', height: '200%', top: '-50%', left: '-50%', background: 'radial-gradient(circle at 20% 80%, #4338ca 0%, transparent 50%), radial-gradient(circle at 80% 20%, #dc2626 0%, transparent 50%), radial-gradient(circle at 40% 40%, #0891b2 0%, transparent 50%), radial-gradient(circle at 90% 90%, #7c3aed 0%, transparent 50%)', animation: 'rotateGradient 30s linear infinite', opacity: 0.6, zIndex: 1}}></div>
		 {/* Cyber Grid */}
		 <div className="cyber-grid" style={{position: 'absolute', width: '100%', height: '100%', backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.03, animation: 'gridPulse 4s ease-in-out infinite', zIndex: 2}}></div>
		 {/* 3D Rotating Cubes */}
		 <div className="cube-container" style={{position: 'absolute', width: '100%', height: '100%', perspective: '1000px', zIndex: 10}}>
		   {[1,2,3].map((n, i) => (
			 <div key={n} className="cube" style={{position: 'absolute', width: 150, height: 150, transformStyle: 'preserve-3d', animation: `rotateCube ${20 + i*5}s infinite linear`, top: i===0?'5%':i===1?'50%':'20%', left: i===0?'5%':i===2?'85%':undefined, right: i===1?'5%':undefined, animationDelay: i===1?'-5s':i===2?'-10s':'0s'}}>
			   <div className="cube-face front" style={{...cubeFaceStyle, ...{transform: 'rotateY(0deg) translateZ(75px)', background: 'rgba(220, 38, 38, 0.1)'}}}>{['SAP','Learn','Future'][i]}</div>
			   <div className="cube-face back" style={{...cubeFaceStyle, ...{transform: 'rotateY(180deg) translateZ(75px)', background: 'rgba(67, 56, 202, 0.1)'}}}>{['FICO','Code','Tech'][i]}</div>
			   <div className="cube-face right" style={{...cubeFaceStyle, ...{transform: 'rotateY(90deg) translateZ(75px)', background: 'rgba(8, 145, 178, 0.1)'}}}>{['ABAP','Deploy','Skills'][i]}</div>
			   <div className="cube-face left" style={{...cubeFaceStyle, ...{transform: 'rotateY(-90deg) translateZ(75px)', background: 'rgba(124, 58, 237, 0.1)'}}}>{['MM','Scale','Career'][i]}</div>
			   <div className="cube-face top" style={{...cubeFaceStyle, ...{transform: 'rotateX(90deg) translateZ(75px)', background: 'rgba(236, 72, 153, 0.1)'}}}>{['SD','Grow','Success'][i]}</div>
			   <div className="cube-face bottom" style={{...cubeFaceStyle, ...{transform: 'rotateX(-90deg) translateZ(75px)', background: 'rgba(34, 197, 94, 0.1)'}}}>{['HR','Excel','Vision'][i]}</div>
			 </div>
		   ))}
		 </div>
		 {/* Particle System */}
		 <div className="particles" id="particles" style={{position: 'absolute', width: '100%', height: '100%', zIndex: 5}}></div>
	   {/* Floating SAP Modules - animated orbit */}
	   <div className="modules-orbit" style={{position: 'absolute', width: '100%', height: '75%', top: 0, zIndex: 50, pointerEvents: 'none'}}>
		 {[
		   { label: 'SAP FICO', color: '#ff006e' },
		   { label: 'SAP ABAP', color: '#8338ec' },
		   { label: 'SAP MM', color: '#3a86ff' },
		   { label: 'SAP SD', color: '#06ffa5' },
		   { label: 'SAP HR/HCM', color: '#ffbe0b' },
		   { label: 'SAP Basis', color: '#fb5607' },
		 ].map((mod, i) => (
		   <div
			 key={mod.label}
			 className={`module-card module-${i+1}`}
			 style={{
			   ...moduleCardStyle,
			   ...modulePositions[i],
			   color: mod.color,
			   borderColor: mod.color,
			   pointerEvents: 'auto',
			   boxShadow: `0 2px 16px ${mod.color}33`,
			   background: 'rgba(255,255,255,0.08)',
			   transition: 'box-shadow 0.3s',
			 }}
		   >
			 {mod.label}
		   </div>
		 ))}
	   </div>
		 {/* Main Content */}
		 <div className="hero-content" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 150, width: '90%', maxWidth: 1200, padding: 20}}>
		   <h1 className="hero-title" style={{fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px', marginBottom: 20, position: 'relative', animation: 'textGlow 3s ease-in-out infinite alternate'}}>MASTER SAP</h1>
		   <p className="hero-subtitle" style={{fontSize: 'clamp(18px, 3vw, 32px)', fontWeight: 300, color: 'rgba(255,255,255,0.9)', marginBottom: 30, letterSpacing: 2, opacity: 1, animation: 'fadeInUp 1s 0.5s forwards'}}>TRANSFORM YOUR CAREER WITH ELITE TRAINING</p>
		   <p className="hero-description" style={{fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 50, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto', opacity: 1, animation: 'fadeInUp 1s 0.8s forwards'}}>Welcome to Ram Tech Solutions - Where SAP Excellence Begins. Join our comprehensive training programs led by industry experts. With 100% placement assistance and hands-on practical experience, we're your gateway to becoming a certified SAP professional.</p>
		   <div className="cta-container" style={{display: 'flex', gap: 30, justifyContent: 'center', flexWrap: 'wrap', opacity: 1, animation: 'fadeInUp 1s 1.1s forwards'}}>
		   <a href="#request" className="cta-button cta-primary" style={{position: 'relative', padding: '18px 40px', fontSize: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, border: 'none', cursor: 'pointer', overflow: 'hidden', transition: 'all 0.3s', textDecoration: 'none', display: 'inline-block', color: '#fff', background: 'linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)', backgroundSize: '300% 300%', animation: 'gradientShift 3s ease infinite', boxShadow: '0 4px 15px rgba(131,56,236,0.4)'}}>START YOUR JOURNEY</a>
		   <button
			 type="button"
			 className="cta-button cta-secondary"
			 style={{position: 'relative', padding: '18px 40px', fontSize: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, border: '2px solid rgba(255,255,255,0.3)', background: 'transparent', backdropFilter: 'blur(10px)', color: '#fff', overflow: 'hidden', transition: 'all 0.3s', textDecoration: 'none', display: 'inline-block', cursor: 'pointer'}}
			 onClick={() => navigate('/courses')}
		   >
			 EXPLORE COURSES
		   </button>
		   </div>

		 </div>
	   </section>

	   {/* ...removed Our Alumni Work At section... */}
	   {/* How it Works Section */}
	   <section className="section" style={{background: '#232b39', margin: '2rem 0', borderRadius: 8, padding: '2rem 1rem'}}>
		 <h2 className="section-title" style={{textAlign: 'center', color: '#ffd166', marginBottom: '2rem'}}>How It Works</h2>
		 <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem'}}>
		   <div style={{flex: '1 1 180px', maxWidth: 220, background: '#181f2a', borderRadius: 8, padding: '1.5rem 1rem', textAlign: 'center', color: '#b6c8ff', boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.2rem', marginBottom: 10}}>📝</div>
			 <h3 style={{color: '#ffd166', fontSize: '1.1rem'}}>1. Enroll Online</h3>
			 <p style={{fontSize: '0.98rem'}}>Submit your details and choose your SAP course.</p>
		   </div>
		   <div style={{flex: '1 1 180px', maxWidth: 220, background: '#181f2a', borderRadius: 8, padding: '1.5rem 1rem', textAlign: 'center', color: '#b6c8ff', boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.2rem', marginBottom: 10}}>🎓</div>
			 <h3 style={{color: '#ffd166', fontSize: '1.1rem'}}>2. Attend Classes</h3>
			 <p style={{fontSize: '0.98rem'}}>Join live sessions with expert trainers and hands-on practice.</p>
		   </div>
		   <div style={{flex: '1 1 180px', maxWidth: 220, background: '#181f2a', borderRadius: 8, padding: '1.5rem 1rem', textAlign: 'center', color: '#b6c8ff', boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.2rem', marginBottom: 10}}>💼</div>
			 <h3 style={{color: '#ffd166', fontSize: '1.1rem'}}>3. Get Certified</h3>
			 <p style={{fontSize: '0.98rem'}}>Complete your course and earn your SAP certification.</p>
		   </div>
		   <div style={{flex: '1 1 180px', maxWidth: 220, background: '#181f2a', borderRadius: 8, padding: '1.5rem 1rem', textAlign: 'center', color: '#b6c8ff', boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.2rem', marginBottom: 10}}>🚀</div>
			 <h3 style={{color: '#ffd166', fontSize: '1.1rem'}}>4. Get Placed</h3>
			 <p style={{fontSize: '0.98rem'}}>Receive placement support and start your SAP career.</p>
		   </div>
		 </div>
	   </section>

	   {/* Testimonials Section - dark theme */}
	   <section className="section" style={{background: '#232b39', padding: '2rem 1rem', margin: '2rem 0', borderRadius: '8px'}}>
			   <h2 className="section-title" style={{textAlign: 'center', marginBottom: '1.5rem', color: '#ffd166'}}>What Our Students Say</h2>
			   <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem'}}>
					   <blockquote style={{fontStyle: 'italic', maxWidth: '320px', borderLeft: '4px solid #007bff', paddingLeft: '1rem', background: '#181f2a', borderRadius: 8, margin: 0, color: '#b6c8ff'}}>
							   "Ram Tech helped me land my dream SAP job!"<br/><span style={{fontWeight: 600, color: '#ffd166'}}>– Priya S.</span>
					   </blockquote>
					   <blockquote style={{fontStyle: 'italic', maxWidth: '320px', borderLeft: '4px solid #007bff', paddingLeft: '1rem', background: '#181f2a', borderRadius: 8, margin: 0, color: '#b6c8ff'}}>
							   "Excellent trainers and real-time projects."<br/><span style={{fontWeight: 600, color: '#ffd166'}}>– Rahul K.</span>
					   </blockquote>
					   <blockquote style={{fontStyle: 'italic', maxWidth: '320px', borderLeft: '4px solid #007bff', paddingLeft: '1rem', background: '#181f2a', borderRadius: 8, margin: 0, color: '#b6c8ff'}}>
							   "The placement support was amazing and the classes were flexible."<br/><span style={{fontWeight: 600, color: '#ffd166'}}>– Sneha M.</span>
					   </blockquote>
			   </div>
	   </section>

			<section className="section">
  <h2 className="section-title">Why Choose Us?</h2>
  <div className="whychooseus-cards whychooseus-grid">
  {FEATURES.map((feature, index) => (
	<div key={index} className="whychooseus-card">
	  <div className="whychooseus-icon">{feature.icon}</div>
	  <div className="whychooseus-content">
		<h3>{feature.title}</h3>
		<p>{feature.description}</p>
	  </div>
	</div>
  ))}
</div>
</section>

			<section className="section">
				<h2 className="section-title">Upcoming Demo Classes</h2>
				<div className="grid grid-3">
					{getUpcomingDemos().length > 0 ? (
						getUpcomingDemos().map(c => (
							<div key={c.id} className="card" onClick={e => e.stopPropagation()}>
								<h3>{c.name}</h3>
								<p><strong>Date:</strong> {c.startDate ? new Date(c.startDate).toLocaleDateString() : 'TBD'}</p>
								<p><strong>Time:</strong> {c.timings || 'TBD'}</p>
								<p><strong>Faculty:</strong> {c.facultyName || 'TBD'}</p>
								<button className="btn link" type="button" onClick={() => setDemoModal({ open: true, demo: c })}>Join Demo</button>
							</div>
						))
					) : (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>📅</div>
							<h3>No upcoming classes</h3>
							<p>Check back soon for new demo class schedules!</p>
						</div>
					)}
				</div>
				{/* Demo Modal */}
				{demoModal.open && demoModal.demo && (
				  <div style={{
					position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.65)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
				  }}>
					<div style={{ background: '#232b39', borderRadius: 16, padding: 32, minWidth: 340, maxWidth: '90vw', boxShadow: '0 8px 32px #000a', position: 'relative' }}>
					  <button onClick={() => setDemoModal({ open: false, demo: null })} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>&times;</button>
					  <h2 style={{ color: '#ffd166', marginBottom: 12 }}>Demo: {demoModal.demo.name}</h2>
					  <p><strong>Date:</strong> {demoModal.demo.startDate ? new Date(demoModal.demo.startDate).toLocaleDateString() : 'TBD'}</p>
					  <p><strong>Time:</strong> {demoModal.demo.timings || 'TBD'}</p>
					  <p><strong>Faculty:</strong> {demoModal.demo.facultyName || 'TBD'}</p>
					  {demoModal.demo.description && <p style={{ marginTop: 10 }}>{demoModal.demo.description}</p>}
					  {/* Optionally add a registration or join link here */}
					  <button className="btn link" style={{ marginTop: 18 }} onClick={() => setRegisterModal({ open: true, course: demoModal.demo.name })}>Register for this Demo</button>
					</div>
				  </div>
				)}
			</section>

			<section className="section">
				<h2 className="section-title">Available Courses</h2>
				<div className="grid grid-3">
					{courses.length > 0 ? (
						courses.map(c => (
							<div key={c.id} className="card" tabIndex={-1}>
								<h3>{c.name}</h3>
								<p><strong>Faculty:</strong> {c.facultyName || 'TBD'}</p>
								<p><strong>Start Date:</strong> {c.startDate || 'TBD'}</p>
								<p><strong>Timings:</strong> {c.timings || 'TBD'}</p>
								{c.description && <p>{c.description}</p>}
								<button
								  className="btn link"
								  type="button"
								  onClick={e => {
									e.preventDefault();
									setRegisterModal({ open: true, course: c.name });
								  }}
								>
								  Register Now
								</button>
							</div>
						))
					) : (
						<div className="card" style={{ textAlign: 'center', padding: '40px' }}>
							<div className="feature-icon" style={{ margin: '0 auto 16px' }}>📚</div>
							<h3>No courses available</h3>
							<p>New courses will be announced soon!</p>
						</div>
					)}
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

	   {/* Statistics Section - visually appealing */}
	   <section className="section stats-section" ref={statsRef} style={{background: '#181f2a', borderRadius: 8, margin: '2rem 0', padding: '2rem 0'}}>
		 <h2 className="section-title" style={{textAlign: 'center', color: '#ffd166', marginBottom: '2rem'}}>Our Achievements</h2>
		 <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2.5rem'}}>
		   <div style={{background: '#232b39', borderRadius: 10, padding: '1.5rem 2.5rem', textAlign: 'center', minWidth: 150, boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.5rem', color: '#ffd166', marginBottom: 8}}>📅</div>
			 <div className="stat-number" style={{fontSize: '2.2rem', fontWeight: 700, color: '#b6c8ff'}} data-target={stats.years}>{formatNumber(animatedStats.years)}</div>
			 <div className="stat-label" style={{color: '#cfd8e3', fontWeight: 500}}>Years of Excellence</div>
		   </div>
		   <div style={{background: '#232b39', borderRadius: 10, padding: '1.5rem 2.5rem', textAlign: 'center', minWidth: 150, boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.5rem', color: '#ffd166', marginBottom: 8}}>📚</div>
			 <div className="stat-number" style={{fontSize: '2.2rem', fontWeight: 700, color: '#b6c8ff'}} data-target={stats.courses}>{formatNumber(animatedStats.courses)}</div>
			 <div className="stat-label" style={{color: '#cfd8e3', fontWeight: 500}}>Courses Offered</div>
		   </div>
		   <div style={{background: '#232b39', borderRadius: 10, padding: '1.5rem 2.5rem', textAlign: 'center', minWidth: 150, boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.5rem', color: '#ffd166', marginBottom: 8}}>👨‍🎓</div>
			 <div className="stat-number" style={{fontSize: '2.2rem', fontWeight: 700, color: '#b6c8ff'}} data-target={stats.students}>{formatNumber(animatedStats.students)}</div>
			 <div className="stat-label" style={{color: '#cfd8e3', fontWeight: 500}}>Students Trained</div>
		   </div>
		   <div style={{background: '#232b39', borderRadius: 10, padding: '1.5rem 2.5rem', textAlign: 'center', minWidth: 150, boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.5rem', color: '#ffd166', marginBottom: 8}}>💼</div>
			 <div className="stat-number" style={{fontSize: '2.2rem', fontWeight: 700, color: '#b6c8ff'}} data-target={stats.placements}>{formatNumber(animatedStats.placements)}</div>
			 <div className="stat-label" style={{color: '#cfd8e3', fontWeight: 500}}>Placements</div>
		   </div>
		   <div style={{background: '#232b39', borderRadius: 10, padding: '1.5rem 2.5rem', textAlign: 'center', minWidth: 150, boxShadow: '0 2px 8px #0002'}}>
			 <div style={{fontSize: '2.5rem', color: '#ffd166', marginBottom: 8}}>🕑</div>
			 <div className="stat-number" style={{fontSize: '2.2rem', fontWeight: 700, color: '#b6c8ff'}}>24/7</div>
			 <div className="stat-label" style={{color: '#cfd8e3', fontWeight: 500}}>Support</div>
		   </div>
		 </div>
	   </section>

			<section className="section">
				<h2 className="section-title">Get Started Today</h2>
				<div id="request" className="card">
					<h3>Request Information</h3>
					<p>Fill out the form below and we'll get back to you with course details and enrollment information.</p>
					<StudentRequestForm />
				</div>
			</section>
		</div>
	);
}

export default HomePage;
