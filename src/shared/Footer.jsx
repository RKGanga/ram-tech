import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Footer() {
	const [courses, setCourses] = useState([])
	const year = new Date().getFullYear()

	useEffect(() => {
		api.get('/courses').then(res => setCourses(res.data)).catch(() => setCourses([]))
	}, [])

	return (
		<footer className="footer">
			<div className="container footer-columns">
				<div>
					<h4>Ram Tech Solutions</h4>
					<p>Professional SAP training with expert faculty, flexible timings and strong placement assistance.</p>
					<div className="footer-social">
						<a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">📱</a>
						<a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">💼</a>
						<a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">📺</a>
					</div>
				</div>

				<div>
					<h4>Available Courses</h4>
					<ul className="footer-list">
						{(courses || []).slice(0, 10).map(c => (
							<li key={c.id}><span>➜</span> {c.name}</li>
						))}
						{courses.length === 0 && (
							<li>Courses will be announced soon</li>
						)}
					</ul>
				</div>

				<div>
					<h4>Quick Links</h4>
					<ul className="footer-links">
						<li><Link to="/">Home</Link></li>
						<li><Link to="/courses">Courses</Link></li>
						<li><Link to="/trainer-register">Trainer Register</Link></li>
						<li><Link to="/about">About</Link></li>
						<li><Link to="/contact">Contact</Link></li>
					</ul>
				</div>

				<div>
					<h4>Contact</h4>
					<ul className="footer-list">
						<li>📍 123 Tech Park, Innovation Street, Bangalore - 560001</li>
						<li>📧 info@ramtech.example</li>
						<li>📞 +91-90000 00000</li>
						<li>🕘 Mon - Sat, 9:00 AM - 7:00 PM</li>
					</ul>
				</div>
			</div>

			<div className="footer-bottom">
				<div className="container">
					<span>© {year} Ram Tech Solutions Pvt Ltd. All rights reserved.</span>
					<span>Crafted with ❤️ for learners of SAP.</span>
				</div>
			</div>
		</footer>
	)
}
