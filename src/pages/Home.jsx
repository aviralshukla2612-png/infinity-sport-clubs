import React from 'react';
import { Trophy, ArrowRight, MapPin, Shield, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroback from '../assets/images/heroback.png';
import cricket3d from '../assets/images/cricket_3d.png';
import volleyball3d from '../assets/images/volleyball_3d.png';
import pickleball3d from '../assets/images/pickleball_3d.png';
import LottieReact from 'lottie-react';
const Lottie = LottieReact.default || LottieReact;
import rohitAnimation from '../assets/lottie/rohit-sharma.json';
import volleyballAnimation from '../assets/lottie/Volley_Ball_Player_Character2.json';
import pickleballAnimation from '../assets/lottie/pickleball.json';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home-page">
      <section className="premium-hero" style={{ backgroundImage: `url(${heroback})` }}>
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

          {/* Floating Cards Overlapping Wave */}
          <div className="floating-cards-centered">
            
            {/* Card 1: Cricket */}
            <div className="centered-card cricket-card">
              <div className="card-lottie-wrapper cricket-bg">
                <Lottie animationData={rohitAnimation} loop={true} style={{ width: '100%', height: '100%', transform: 'scale(1.8)' }} />
              </div>
              <h2 className="card-heading">CRICKET</h2>
              <h3 className="card-subheading orange-text">TOURNAMENT VENUE</h3>
              <p className="card-body">
                7 professional grounds for leagues,<br/>
                tournaments and corporate matches.
              </p>
              <button className="card-action-btn orange-btn" onClick={() => navigate('/cricket-booking')}>
                Book Cricket Ground &rarr;
              </button>
            </div>

            {/* Card 2: Volleyball */}
            <div className="centered-card volleyball-card">
              <div className="card-lottie-wrapper volleyball-bg">
                <Lottie animationData={volleyballAnimation} loop={true} style={{ width: '100%', height: '100%', transform: 'scale(1.8)' }} />
              </div>
              <h2 className="card-heading">VOLLEYBALL</h2>
              <h3 className="card-subheading blue-text">TOURNAMENT VENUE</h3>
              <p className="card-body">
                Professional volleyball court<br/>
                for matches, training & events.
              </p>
              <button className="card-action-btn blue-btn" onClick={() => navigate('/volleyball-booking')}>
                Book Volleyball Court &rarr;
              </button>
            </div>

            {/* Card 3: Pickleball */}
            <div className="centered-card pickleball-card">
              <div className="card-lottie-wrapper pickleball-bg">
                <Lottie animationData={pickleballAnimation} loop={true} style={{ width: '100%', height: '100%', transform: 'scale(1.8)' }} />
              </div>
              <h2 className="card-heading">PICKLEBALL</h2>
              <h3 className="card-subheading green-text">TOURNAMENT VENUE</h3>
              <p className="card-body">
                Dedicated pickleball courts<br/>
                for all ages and skill levels.
              </p>
              <button className="card-action-btn green-btn" onClick={() => navigate('/pickleball-booking')}>
                Book Pickleball Court &rarr;
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Sections for Navigation */}
      <section id="about" style={{ padding: '4rem 2rem', background: '#111', color: '#fff', textAlign: 'center' }}>
        <h2>About Us</h2>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '1rem auto' }}>Welcome to Infinity Sports Club. Experience world-class infrastructure tailored for tournaments and recreational sports.</p>
      </section>

      <section id="facilities" style={{ padding: '4rem 2rem', background: '#1a1a1a', color: '#fff', textAlign: 'center' }}>
        <h2>Our Facilities</h2>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '1rem auto' }}>We offer top-notch cricket grounds, volleyball courts, and pickleball arenas designed for professionals.</p>
      </section>

      <section id="gallery" style={{ padding: '4rem 2rem', background: '#111', color: '#fff', textAlign: 'center' }}>
        <h2>Gallery</h2>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '1rem auto' }}>A sneak peek into our tournaments, events, and campus.</p>
      </section>

      <section id="contact" style={{ padding: '4rem 2rem', background: '#1a1a1a', color: '#fff', textAlign: 'center' }}>
        <h2>Contact Us</h2>
        <p style={{ color: '#aaa', maxWidth: '600px', margin: '1rem auto' }}>Reach out for bulk bookings, corporate events, or tournament scheduling.</p>
      </section>
    </div>
  );
};

export default Home;
