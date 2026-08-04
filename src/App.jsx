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

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/admin') || location.pathname.startsWith('/subadmin');

  return (
    <div className="app-container">
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
