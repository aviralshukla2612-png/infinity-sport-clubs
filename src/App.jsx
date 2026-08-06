import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import ClubDetails from './pages/ClubDetails';
import Booking from './pages/Booking';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubAdminDashboard from './pages/SubAdminDashboard';
import CricketBooking from './pages/CricketBooking';
import VolleyballBooking from './pages/VolleyballBooking';
import PickleballBooking from './pages/PickleballBooking';
import MyBookings from './pages/MyBookings';
import { GlobalBookingProvider } from './context/GlobalBookingContext';
import logo from './assets/images/logo.jpg';
import loaderVideo from './assets/video/loadervideo.webm';

const LoadingScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [isFading, setIsFading] = React.useState(false);

  React.useEffect(() => {
    let start = 0;
    const duration = 8000; // Increased duration to 8 seconds
    const increment = 100 / (duration / 48);
    
    let timer;
    const initialDelay = setTimeout(() => {
      timer = setInterval(() => {
        start += increment;
        if (start >= 100) {
          setProgress(100);
          clearInterval(timer);
          setTimeout(() => setIsFading(true), 200);
          setTimeout(() => setLoading(false), 1000);
        } else {
          setProgress(Math.floor(start));
        }
      }, 48);
    }, 2000); // 2 second delay so particles can float up first
    
    return () => {
      clearTimeout(initialDelay);
      if (timer) clearInterval(timer);
    };
  }, []);

  const particles = React.useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      duration: `${Math.random() * 3 + 4}s`,
      delay: `${Math.random() * 4}s`
    }));
  }, []);

  if (!loading) return null;

  return (
    <div className={`global-loading-screen premium-style ${isFading ? 'slide-up-fade' : ''}`}>
      <div className="loader-particles-container">
        {particles.map(p => (
          <div 
            key={p.id} 
            className="loader-particle" 
            style={{ 
              left: p.left, 
              width: p.size, 
              height: p.size, 
              animationDuration: p.duration, 
              animationDelay: p.delay 
            }} 
          />
        ))}
      </div>
      <div className="loader-center-content">
        <div className="loader-logo-wrapper">
          <video 
            src={loaderVideo} 
            autoPlay 
            muted 
            loop 
            playsInline
            className="loader-logo-video"
          />
          <div 
            className="loader-video-reveal-mask"
            style={{ height: `${100 - progress}%` }}
          />
        </div>
      </div>
      <div className="loader-progress-text">
        {progress}
      </div>
    </div>
  );
}

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/subadmin');

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="app-container">
      <div className="mouse-glow-effect"></div>
      <LoadingScreen />
      {!hideNavbar && <Navbar />}
      <main className={!hideNavbar ? "main-content" : "admin-main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/club/:id" element={<ClubDetails />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/dashboard" element={<MyBookings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/subadmin" element={<SubAdminDashboard />} />
          <Route path="/cricket-booking" element={<CricketBooking />} />
          <Route path="/volleyball-booking" element={<VolleyballBooking />} />
          <Route path="/pickleball-booking" element={<PickleballBooking />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <GlobalBookingProvider>
      <Router>
        <AppLayout />
      </Router>
    </GlobalBookingProvider>
  );
}

export default App;
