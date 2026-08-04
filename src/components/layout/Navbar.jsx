import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Shield, Users, Menu, X } from 'lucide-react';
import logo from '../../assets/images/logo.jpg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <nav className="premium-navbar">
      <div className="container navbar-container">
        
        {/* Left: Logo */}
        <Link to="/" className="navbar-logo-img">
          <img src={logo} alt="Infinity Sports Club Logo" className="logo-image" />
        </Link>

        {/* Center: Links */}
        <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div className="mobile-menu-header">
            <img src={logo} alt="Infinity Sports Club" className="logo-image mobile-only-logo" />
            <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <Link to="/" className="nav-link active" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/facilities" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Facilities</Link>
          <Link to="/gallery" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Gallery</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          
          {/* Mobile only actions in menu */}
          <div className="mobile-only-actions">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="book-now-btn" style={{width: '100%', marginTop: '1rem'}}>My Booking</button>
            </Link>
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #333', paddingTop: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1rem' }}>Test Panels</div>
              <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={16} color="#FF7A00" /> Admin Dashboard
              </Link>
              <Link to="/subadmin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={16} color="#007BFF" /> Sub Admin Dashboard
              </Link>
            </div>
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
          <Link to="/dashboard">
            <button className="book-now-btn">My Booking</button>
          </Link>

          {/* Admin Test Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setAdminOpen(true)}
            onMouseLeave={() => setAdminOpen(false)}
          >
            <button
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'rgba(255,122,0,0.1)',
                border: '1px solid rgba(255,122,0,0.35)',
                borderRadius: '20px',
                padding: '0.4rem 0.85rem',
                color: '#FF7A00',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={14} /> Admin <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: adminOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>

            {/* Sliding Dropdown Wrapper to bridge hover gap */}
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              paddingTop: '10px',
              zIndex: 200,
              pointerEvents: adminOpen ? 'all' : 'none'
            }}>
              <div style={{
                background: '#111',
                border: '1px solid #222',
                borderRadius: '12px',
                padding: '0.5rem',
                minWidth: '170px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                transform: adminOpen ? 'translateY(0) scaleY(1)' : 'translateY(-8px) scaleY(0.92)',
                transformOrigin: 'top right',
                opacity: adminOpen ? 1 : 0,
                transition: 'all 0.2s ease'
              }}>
              <div style={{
                fontSize: '0.68rem', color: '#555', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.5px',
                padding: '0.3rem 0.6rem 0.5rem'
              }}>Test Panels</div>

              <div
                onClick={() => { navigate('/admin'); setAdminOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: '8px',
                  cursor: 'pointer', color: '#ccc', fontSize: '0.83rem',
                  fontWeight: 500, transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background='#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <Shield size={14} color="#FF7A00" /> Admin Dashboard
              </div>

              <div
                onClick={() => { navigate('/subadmin'); setAdminOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.75rem', borderRadius: '8px',
                  cursor: 'pointer', color: '#ccc', fontSize: '0.83rem',
                  fontWeight: 500, transition: 'all 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background='#1a1a1a'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                <Users size={14} color="#007BFF" /> Sub Admin
              </div>
              </div>
            </div>
          </div>
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
