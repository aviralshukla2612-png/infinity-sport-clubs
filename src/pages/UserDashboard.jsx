import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { DUMMY_CLUBS, DUMMY_CITIES } from '../data/dummyData';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { userId } = useAuth();
  const { bookings } = useClub();
  const navigate = useNavigate();
  
  const userBookings = bookings.filter(b => b.userId === userId);

  return (
    <div className="container mt-20">
      <h1 className="mb-lg">My Bookings</h1>
      
      <div className="flex-col gap-md">
        {userBookings.map(booking => {
          const club = DUMMY_CLUBS.find(c => c.id === booking.clubId);
          const city = DUMMY_CITIES.find(c => c.id === club?.cityId);
          const court = club?.courts.find(c => c.id === booking.courtId);
          
          return (
            <div key={booking.id} className="glass-panel p-md flex flex-wrap gap-md justify-between items-center hover-glow">
              <div className="flex gap-md items-center" style={{flex: 1, minWidth: '300px'}}>
                <div className="date-block text-center glass-card p-sm" style={{width: '70px'}}>
                  <div className="text-sm text-muted">{format(new Date(booking.date), 'MMM')}</div>
                  <div className="text-xl font-bold text-primary">{format(new Date(booking.date), 'dd')}</div>
                </div>
                
                <div>
                  <h3 className="mb-xs">{club?.name}</h3>
                  <div className="flex items-center gap-sm text-muted text-sm">
                    <MapPin size={14} /> {city?.name}
                    <span className="separator">•</span>
                    <span>{booking.sport} ({court?.name})</span>
                  </div>
                  <div className="flex items-center gap-sm text-muted text-sm mt-xs">
                    <Clock size={14} /> {booking.timeSlot}
                    <span className="separator">•</span>
                    <span>{booking.players} Players</span>
                  </div>
                </div>
              </div>

              <div className="flex-col items-end gap-sm" style={{minWidth: '120px'}}>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>
                  {booking.status}
                </span>
                <span className="font-bold">₹{booking.price}</span>
              </div>
            </div>
          );
        })}

        {userBookings.length === 0 && (
          <div className="glass-panel p-xl text-center">
            <Calendar size={48} className="text-muted mx-auto mb-md" />
            <h3 className="mb-sm">No bookings found</h3>
            <p className="text-muted">You haven't made any court bookings yet.</p>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-xl">
        <button className="btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>

      <style>{`
        .hover-glow { transition: all 0.2s; }
        .hover-glow:hover { border-color: rgba(255,255,255,0.2); transform: translateX(5px); }
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .status-badge.confirmed { background: rgba(34, 197, 94, 0.2); color: var(--success-color); }
        .status-badge.pending { background: rgba(234, 179, 8, 0.2); color: var(--primary-color); }
        .status-badge.cancelled { background: rgba(239, 68, 68, 0.2); color: var(--danger-color); }
      `}</style>
    </div>
  );
};

export default UserDashboard;
