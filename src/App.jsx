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

const LoadingScreen = () => {
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className={`global-loading-screen ${!loading ? 'fade-out' : ''}`}>
      <img src={logo} alt="Logo" className="loading-logo" />
      <div className="loading-progress-bar">
        <div className="loading-progress-fill"></div>
      </div>
    </div>
  )
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
