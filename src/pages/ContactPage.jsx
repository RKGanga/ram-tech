import React, { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function ContactPage() {
  const [contact, setContact] = useState({});

  useEffect(() => {
	api.get('/contact-info').then(r => setContact(r.data || {})).catch(() => setContact({}));
  }, []);

  return (
	<div style={{ fontFamily: 'Inter, sans-serif', background: '#181f2a', minHeight: '100vh', color: '#e6e6e6' }}>

	  {/* Page Title and Subtitle */}
	  <section className="section" style={{ margin: '2.5rem auto 0 auto', maxWidth: 900, padding: '0 1rem', textAlign: 'center' }}>
		<h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: '#ffd166', marginBottom: 12, letterSpacing: '-1px' }}>Contact Us</h1>
		<p style={{ fontSize: '1.15rem', color: '#b6c8ff', maxWidth: 700, margin: '0 auto', opacity: 0.95 }}>
		  Get in touch for SAP training queries, partnership opportunities, or career guidance. We’re here to help you succeed!
		</p>
	  </section>

	  <section className="section" style={{ margin: '3rem auto', maxWidth: 1200, padding: '0 1rem' }}>
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
		  <div style={{ flex: '1 1 340px', minWidth: 340, background: '#232b39', borderRadius: 18, padding: '2.5rem 2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
			<div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📧</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.2rem', marginBottom: 8 }}>Email Us</h3>
			<p style={{ fontSize: '1.1rem', marginBottom: 4 }}>{contact.email || 'info@ramtech.example'}</p>
			<p style={{ fontSize: '0.98rem', color: '#b6c8ff' }}>We typically respond within 24 hours</p>
		  </div>
		  <div style={{ flex: '1 1 340px', minWidth: 340, background: '#232b39', borderRadius: 18, padding: '2.5rem 2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
			<div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📞</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.2rem', marginBottom: 8 }}>Call Us</h3>
			<p style={{ fontSize: '1.1rem', marginBottom: 4 }}>{contact.phone || '+91-90000 00000'}</p>
			<p style={{ fontSize: '0.98rem', color: '#b6c8ff' }}>Mon-Fri, 9 AM - 6 PM IST</p>
		  </div>
		  <div style={{ flex: '1 1 340px', minWidth: 340, background: '#232b39', borderRadius: 18, padding: '2.5rem 2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center' }}>
			<div style={{ fontSize: '2.5rem', marginBottom: 10 }}>💬</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.2rem', marginBottom: 8 }}>WhatsApp</h3>
			<p style={{ fontSize: '1.1rem', marginBottom: 4 }}>Quick responses for urgent queries</p>
			<a className="btn link" href={contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : 'https://wa.me/919000000000'} target="_blank" rel="noreferrer" style={{ color: '#3a86ff', fontWeight: 600, textDecoration: 'underline' }}>Chat on WhatsApp</a>
		  </div>
		</div>
	  </section>

	  <section className="section" style={{ margin: '3rem auto', maxWidth: 1200, padding: '0 1rem' }}>
		<h2 className="section-title" style={{ textAlign: 'center', color: '#ffd166', marginBottom: '2.5rem', fontSize: '2rem' }}>Follow Us</h2>
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
		  <div style={{ flex: '1 1 320px', minWidth: 320, background: '#202736', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 8px #0002', textAlign: 'center' }}>
			<div style={{ fontSize: '2.2rem', marginBottom: 10 }}>📱</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.1rem' }}>Instagram</h3>
			<p>Follow us for updates, tips, and student stories</p>
			<a
			  className="btn link"
			  href={contact.instagram || "https://instagram.com"}
			  target="_blank"
			  rel="noreferrer"
			  style={{ color: '#3a86ff', fontWeight: 600, textDecoration: 'underline' }}
			>
			  Follow on Instagram
			</a>
		  </div>
		  <div style={{ flex: '1 1 320px', minWidth: 320, background: '#202736', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 8px #0002', textAlign: 'center' }}>
			<div style={{ fontSize: '2.2rem', marginBottom: 10 }}>💼</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.1rem' }}>LinkedIn</h3>
			<p>Connect with our professional network</p>
			<a
			  className="btn link"
			  href={contact.linkedin || "https://linkedin.com"}
			  target="_blank"
			  rel="noreferrer"
			  style={{ color: '#3a86ff', fontWeight: 600, textDecoration: 'underline' }}
			>
			  Connect on LinkedIn
			</a>
		  </div>
		  <div style={{ flex: '1 1 320px', minWidth: 320, background: '#202736', borderRadius: 16, padding: '2rem', boxShadow: '0 2px 8px #0002', textAlign: 'center' }}>
			<div style={{ fontSize: '2.2rem', marginBottom: 10 }}>📺</div>
			<h3 style={{ color: '#ffd166', fontSize: '1.1rem' }}>YouTube</h3>
			<p>Watch our training videos and tutorials</p>
			<a
			  className="btn link"
			  href={contact.youtube || "https://youtube.com"}
			  target="_blank"
			  rel="noreferrer"
			  style={{ color: '#3a86ff', fontWeight: 600, textDecoration: 'underline' }}
			>
			  Subscribe on YouTube
			</a>
		  </div>
		</div>
	  </section>

	  <section className="section" style={{ margin: '3rem auto', maxWidth: 700, padding: '0 1rem' }}>
		<h2 className="section-title" style={{ textAlign: 'center', color: '#ffd166', marginBottom: '2rem', fontSize: '2rem' }}>Visit Our Center</h2>
		<div style={{ background: '#232b39', borderRadius: 18, padding: '2.5rem 2rem', boxShadow: '0 2px 16px #0003', textAlign: 'center', fontSize: '1.15rem' }}>
		  <div style={{ fontSize: '2rem', marginBottom: 10 }}>📍</div>
		  <div style={{ fontWeight: 600, color: '#ffd166', marginBottom: 8 }}>Ram Tech Solutions Training Center</div>
		  <div>123, Main Road, Hyderabad, Telangana, India</div>
		  <div style={{ color: '#b6c8ff', marginTop: 8 }}>Open: Mon-Sat, 9 AM - 7 PM</div>
		</div>
	  </section>
	</div>
  );
}

