import React from 'react';
import { Trophy, ArrowRight, MapPin, Shield, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../assets/video/Luxury_sports_complex_cinematic_…_202608051834.mp4';
import cricket3d from '../assets/images/cricket_3d.png';
import volleyball3d from '../assets/images/volleyball_3d.png';
import pickleball3d from '../assets/images/pickleball_3d.png';
import cricketVideo from '../assets/video/Box_cricket_stadium_at_sunset_202608061020.mp4';
import volleyballVideo from '../assets/video/Volleyball_court_in_sports_complex_202608051850.mp4';
import pickleballVideo from '../assets/video/Pickleball_court_during_golden_hour_202608051820.mp4';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <section className="premium-hero">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video-bg"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-bg-overlay"></div>

        {/* Orange Wave at bottom - OUTSIDE container to span 100vw */}
        <div className="hero-wave">
           <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
             <path fill="#FF7A00" d="M0,320 L0,120 Q720,300 1440,120 L1440,320 Z" />
             <path fill="none" stroke="#ffffff" strokeWidth="6" d="M0,120 Q720,300 1440,120" />
           </svg>
        </div>

        <div className="premium-hero-container">
          <div className="hero-left-content">


            <h1 className="hero-title-main">
              TOURNAMENT & <br />
              <span className="text-orange">SPORTS VENUE BOOKING</span>
            </h1>

            <p className="hero-description">
              Experience world-class infrastructure for tournaments, leagues, <br/>
              corporate events, academy competitions, and recreational sports.
            </p>

            <div className="hero-features-row" style={{ justifyContent: 'flex-start', marginBottom: '32px' }}>
              <div className="feature-item-inline">
                <div className="feature-icon-circle-custom"><Map size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong>3 Acres</strong>
                  <span>Sports Campus</span>
                </div>
              </div>
              <div className="feature-item-inline">
                <div className="feature-icon-circle-custom"><Trophy size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong>Professional</strong>
                  <span>Facilities</span>
                </div>
              </div>
              <div className="feature-item-inline">
                <div className="feature-icon-circle-custom"><Shield size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong>Safe & Secure</strong>
                  <span>Environment</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-hero-video-block">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="mobile-hero-video"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </div>

          {/* Floating Cards Overlapping Wave */}
          <div className="floating-cards-centered">
            
            {/* Card 1: Cricket */}
            <div className="centered-card cricket-card">
              <video autoPlay loop muted playsInline className="card-video-bg">
                <source src={cricketVideo} type="video/mp4" />
              </video>
              <div className="card-overlay-gradient"></div>
              <div className="card-content-overlay">
                <h2 className="card-heading">CRICKET</h2>
                <button className="card-action-btn orange-btn" onClick={() => navigate('/cricket-booking')}>
                  Book Court &rarr;
                </button>
              </div>
            </div>

            {/* Card 2: Volleyball */}
            <div className="centered-card volleyball-card">
              <video autoPlay loop muted playsInline className="card-video-bg">
                <source src={volleyballVideo} type="video/mp4" />
              </video>
              <div className="card-overlay-gradient"></div>
              <div className="card-content-overlay">
                <h2 className="card-heading">VOLLEYBALL</h2>
                <button className="card-action-btn blue-btn" onClick={() => navigate('/volleyball-booking')}>
                  Book Court &rarr;
                </button>
              </div>
            </div>

            {/* Card 3: Pickleball */}
            <div className="centered-card pickleball-card">
              <video autoPlay loop muted playsInline className="card-video-bg">
                <source src={pickleballVideo} type="video/mp4" />
              </video>
              <div className="card-overlay-gradient"></div>
              <div className="card-content-overlay">
                <h2 className="card-heading">PICKLEBALL</h2>
                <button className="card-action-btn green-btn" onClick={() => navigate('/pickleball-booking')}>
                  Book Court &rarr;
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
