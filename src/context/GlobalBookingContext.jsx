import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalBookingContext = createContext(undefined);

const initialBookings = [
  {
    id: 'BK1001',
    userId: 'user_1',
    sport: 'cricket',
    sportLabel: 'Box Cricket',
    name: 'Infinity Sports Club – Ground 1',
    venue: 'Rajkot, Gujarat',
    ground: 'Box Cricket · Court 1',
    court: 'Court 1',
    date: '03 Aug 2026',
    day: 'Monday',
    time: '8:00 AM – 10:00 AM',
    timeSlot: '8:00 AM–10:00 AM',
    duration: '2 Hours',
    players: '8 Players',
    price: 1365,
    amount: 1365,
    status: 'upcoming',
    paymentStatus: 'paid',
    customer: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@email.com',
    bookedAt: '02 Aug 2026',
    image: '/assets/ground1.jpg'
  },
  {
    id: 'BK1002',
    userId: 'user_2',
    sport: 'volleyball',
    sportLabel: 'Volleyball',
    name: 'Infinity Sports Club – Volleyball Court',
    venue: 'Rajkot, Gujarat',
    ground: 'Indoor Court · Court 1',
    court: 'Court 1',
    date: '03 Aug 2026',
    day: 'Monday',
    time: '6:00 PM – 8:00 PM',
    timeSlot: '6:00 PM–8:00 PM',
    duration: '2 Hours',
    players: '12 Players',
    price: 2000,
    amount: 2000,
    status: 'completed',
    paymentStatus: 'paid',
    customer: 'Amit Verma',
    phone: '9123456780',
    email: 'amit@email.com',
    bookedAt: '02 Aug 2026',
    image: '/assets/ball1.jpg'
  }
];

export const GlobalBookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const stored = localStorage.getItem('isc_global_bookings');
      return stored ? JSON.parse(stored) : initialBookings;
    } catch (e) {
      return initialBookings;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'isc_global_bookings' && e.newValue) {
        setBookings(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('isc_global_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (bookingData) => {
    setBookings(prev => [bookingData, ...prev]);
  };

  const updateBookingStatus = (id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const cancelBooking = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
  };

  const processRefund = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled', paymentStatus: 'refunded' } : b));
  };

  return (
    <GlobalBookingContext.Provider value={{
      bookings,
      addBooking,
      updateBookingStatus,
      cancelBooking,
      processRefund
    }}>
      {children}
    </GlobalBookingContext.Provider>
  );
};

export const useGlobalBooking = () => {
  const context = useContext(GlobalBookingContext);
  if (context === undefined) {
    throw new Error('useGlobalBooking must be used within a GlobalBookingProvider');
  }
  return context;
};
