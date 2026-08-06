import React from 'react';
import { Trophy, ArrowRight, MapPin, Shield, Map, Calendar, ChevronRight, ChevronDown, Users, CheckCircle2, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroVideo from '../assets/video/Luxury_sports_complex_cinematic_…_202608051834.mp4';
import cricket3d from '../assets/images/cricket_3d.png';
import volleyball3d from '../assets/images/volleyball_3d.png';
import pickleball3d from '../assets/images/pickleball_3d.png';
import cricketVideo from '../assets/video/Box_cricket_stadium_at_sunset_202608061020.mp4';
import volleyballVideo from '../assets/video/Volleyball_court_in_sports_complex_202608051850.mp4';
import pickleballVideo from '../assets/video/Pickleball_court_during_golden_hour_202608051820.mp4';
import './Home.css';
import './Home.css';

const Counter = ({ end, duration, suffix = "" }) => {
  const [count, React_useState] = React.useState(0);
  
  React.useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        React_useState(end);
        clearInterval(timer);
      } else {
        React_useState(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
}

const CardBookingButton = ({ route, defaultText, colorClass }) => {
  const navigate = useNavigate();

  return (
    <button className={`card-action-btn ${colorClass}`} onClick={() => navigate(route)}>
      {defaultText}
    </button>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const backgroundVideos = [cricketVideo, volleyballVideo, pickleballVideo];
  const [activeBgIndex, setActiveBgIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveBgIndex(prev => (prev + 1) % backgroundVideos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <section className="premium-hero">
        {backgroundVideos.map((vid, index) => (
          <video
            key={index}
            autoPlay
            loop
            muted
            playsInline
            className="hero-video-bg"
            style={{ 
              opacity: index === activeBgIndex ? 1 : 0, 
              transition: 'opacity 1.5s ease-in-out',
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
            }}
          >
            <source src={vid} type="video/mp4" />
          </video>
        ))}
        <div className="hero-bg-overlay"></div>

        {/* Orange Wave at bottom - OUTSIDE container to span 100vw */}
        <div className="hero-wave">
           <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
             <path fill="#FF7A00" d="M0,320 L0,120 Q720,300 1440,120 L1440,320 Z" />
             <path fill="none" stroke="#ffffff" strokeWidth="6" d="M0,120 Q720,300 1440,120" />
           </svg>
        </div>

        <div className="premium-hero-container">
          
          {/* Floating Particles */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>

          <div className="hero-left-content">


            <h1 className="hero-title-main">
              TOURNAMENT & <br />
              <span className="text-orange">SPORTS VENUE BOOKING</span>
            </h1>

            <p className="hero-description">
              Experience world-class infrastructure for tournaments, leagues, <br/>
              corporate events, academy competitions, and recreational sports.
            </p>

            <div className="hero-cta-group">
              <button className="cta-btn-primary">
                <Calendar size={18} /> Book Now
              </button>
              <button className="cta-btn-secondary">
                Explore Facilities <ChevronRight size={18} />
              </button>
            </div>

            <div className="hero-features-row" style={{ justifyContent: 'flex-start', marginBottom: '20px' }}>
              <div className="feature-item-inline fade-up-delay-1">
                <div className="feature-icon-circle-custom"><Map size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong><Counter end={3} duration={1000} suffix="+" /> Acres</strong>
                  <span>Sports Campus</span>
                </div>
              </div>
              <div className="feature-item-inline fade-up-delay-2">
                <div className="feature-icon-circle-custom"><Trophy size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong><Counter end={50} duration={1500} suffix="+" /></strong>
                  <span>Tournaments Held</span>
                </div>
              </div>
              <div className="feature-item-inline fade-up-delay-3">
                <div className="feature-icon-circle-custom"><Users size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong><Counter end={5000} duration={2000} suffix="+" /></strong>
                  <span>Happy Members</span>
                </div>
              </div>
              <div className="feature-item-inline fade-up-delay-4">
                <div className="feature-icon-circle-custom"><Shield size={18} color="#fff" /></div>
                <div className="feature-text-inline">
                  <strong>24/7</strong>
                  <span>Safe & Secure</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mobile-hero-video-block">
            {backgroundVideos.map((vid, index) => (
              <video 
                key={index}
                autoPlay 
                loop 
                muted 
                playsInline 
                className="mobile-hero-video"
                style={{ 
                  opacity: index === activeBgIndex ? 1 : 0, 
                  transition: 'opacity 1.5s ease-in-out',
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
                }}
              >
                <source src={vid} type="video/mp4" />
              </video>
            ))}
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
                <CardBookingButton route="/cricket-booking" defaultText="Book Court &rarr;" colorClass="orange-btn" />
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
                <CardBookingButton route="/volleyball-booking" defaultText="Book Court &rarr;" colorClass="blue-btn" />
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
                <CardBookingButton route="/pickleball-booking" defaultText="Book Court &rarr;" colorClass="green-btn" />
              </div>
            </div>

          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll Down</span>
          <ChevronDown className="scroll-arrow" size={24} />
        </div>
      </section>
    </div>
  );
};

export default Home;
