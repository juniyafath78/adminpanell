import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquarePlus, GraduationCap, Menu, X } from 'lucide-react';

export default function Navbar({ dbStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <div className="brand-icon" aria-hidden="true">
            <GraduationCap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">CoursePulse</span>
            <span className="brand-subtitle">Feedback Admin Panel</span>
          </div>
        </NavLink>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/add-feedback"
            onClick={closeMenu}
            className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
          >
            <MessageSquarePlus size={17} />
            <span>Add Feedback</span>
          </NavLink>
        </nav>

        <div className="nav-status" title="Backend & MongoDB Atlas status">
          <span
            className={`status-dot ${
              dbStatus === 'connected' ? 'online' : dbStatus === 'disconnected' ? 'offline' : ''
            }`}
          />
          <span>
            {dbStatus === 'connected'
              ? 'Atlas Connected'
              : dbStatus === 'disconnected'
              ? 'API Offline'
              : 'Checking API...'}
          </span>
        </div>
      </div>
    </header>
  );
}
