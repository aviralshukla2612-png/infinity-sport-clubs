import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, ChevronDown, Shield, Users, Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (e, hash) => {
    setIsMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      if (!hash) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="premium-navbar">
      <div className="container navbar-container">
        
        {/* Left: Logo */}
        <Link to="/" className="navbar-logo-text" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src={logo} alt="Infinity Sports Club" className="logo-image" />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', lineHeight: 1.1 }}>INFINITY</span>
            <span style={{ color: '#FF7A00', fontSize: '10px', fontWeight: '700', letterSpacing: '0.5px', lineHeight: 1.1 }}>SPORTS CLUB</span>
          </div>
        </Link>

        {/* Center: Links */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-menu-header">
            <img src={logo} alt="Infinity Sports Club" className="logo-image" style={{ height: '32px' }} />
            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <Link to="/" className="nav-link active" onClick={(e) => handleNavClick(e, '')}>Home</Link>
          <Link to="/" className="nav-link" onClick={(e) => handleNavClick(e, '')}>About Us</Link>
          <Link to="/" className="nav-link" onClick={(e) => handleNavClick(e, '')}>Facilities</Link>
          <Link to="/" className="nav-link" onClick={(e) => handleNavClick(e, '')}>Gallery</Link>
          <Link to="/" className="nav-link" onClick={(e) => handleNavClick(e, '')}>Contact</Link>
          
          {/* Mobile only actions in menu */}
          <div className="mobile-only-actions">
            <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="book-now-btn" style={{width: '100%', marginTop: '1rem', backgroundColor: '#333'}}>Admin</button>
            </Link>
            <Link to="/subadmin" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="book-now-btn" style={{width: '100%', marginTop: '1rem', backgroundColor: '#333'}}>SubAdmin</button>
            </Link>
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="book-now-btn" style={{width: '100%', marginTop: '1rem'}}>Book Now</button>
            </Link>
          </div>
        </div>
        {/* Right: Actions */}
        <div className="navbar-actions">
          <div className="location-selector">
            <MapPin size={18} className="location-icon" />
            <div className="location-text">
              <span className="city">Rajkot, Gujarat</span>
            </div>
          </div>
          <Link to="/admin">
            <button className="book-now-btn" style={{backgroundColor: '#333', marginRight: '8px'}}>Admin</button>
          </Link>
          <Link to="/subadmin">
            <button className="book-now-btn" style={{backgroundColor: '#333', marginRight: '8px'}}>SubAdmin</button>
          </Link>
          <Link to="/dashboard">
            <button className="book-now-btn">Book Now</button>
          </Link>
        </div>

        
        {/* Mobile Toggle */}
        <button className="mobile-toggle-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
