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
import lodderImg from './assets/images/lodder.png';

const LoadingScreen = () => {
  const [loading, setLoading] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [isFading, setIsFading] = React.useState(false);

  React.useEffect(() => {
    let start = 0;
    const duration = 8000; // Increased duration to 8 seconds
    const increment = 100 / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => setIsFading(true), 200);
        setTimeout(() => setLoading(false), 1000);
      } else {
        setProgress(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`global-loading-screen premium-style ${isFading ? 'slide-up-fade' : ''}`}>
      <div className="loader-center-content">
        <div className="loader-logo-wrapper">
          <img src={lodderImg} alt="Loading..." className="loader-logo-empty" />
          <img 
            src={lodderImg} 
            alt="Loading..." 
            className="loader-logo-filled" 
            style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} 
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
