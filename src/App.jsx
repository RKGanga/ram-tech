import React from 'react'
import { useLocation } from 'react-router-dom';
// ScrollToTop utility: scrolls to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
	window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
import { NavLink, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import TrainerRegisterPage from './pages/TrainerRegisterPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import AdminPage from './pages/admin/AdminPage.jsx'
import { ToastContainer } from './shared/Toast.jsx'
import { ToastProvider, useToast } from './shared/ToastContext.jsx'
import Footer from './shared/Footer.jsx'

function AppContent() {
	const { toasts, removeToast } = useToast()
	
  return (
	<div>
	  <ScrollToTop />
			<header>
				<div className="container">
					<nav>
						<div className="logo">
							<img src="/logo.png" alt="Ram Tech Solutions" className="brand-logo" onError={(e) => { e.currentTarget.style.display='none'; }} />
							<span className="brand-text">Ram Tech Solutions</span>
						</div>
						<div className="nav-links">
							<NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
							<NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink>
							<NavLink to="/trainer-register" className={({ isActive }) => isActive ? 'active' : ''}>Trainer Register</NavLink>
							<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
							<NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
						</div>
					</nav>
				</div>
			</header>
			<main className="container">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/courses" element={<CoursesPage />} />
					<Route path="/trainer-register" element={<TrainerRegisterPage />} />
					<Route path="/about" element={<AboutPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/admin-login/*" element={<AdminPage />} />
				</Routes>
			</main>
			<Footer />
			<ToastContainer toasts={toasts} removeToast={removeToast} />
		</div>
	)
}

export default function App() {
	return (
		<ToastProvider>
			<AppContent />
		</ToastProvider>
	)
}

