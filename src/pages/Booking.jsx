import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useClub } from '../context/ClubContext';
import { useAuth } from '../context/AuthContext';
import './Booking.css';

const TIME_SLOTS = [
  '06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '08:00 AM - 09:00 AM',
  '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM',
  '08:00 PM - 09:00 PM'
];

const Booking = () => {
  const { currentClub, setBookings } = useClub();
  const { role, userId } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [playerDetails, setPlayerDetails] = useState({ adharCard: '', panCard: '', players: 1 });
  const [isBooked, setIsBooked] = useState(false);

  if (!currentClub) {
    return (
      <div className="container text-center mt-20">
        <h2>Please select a club first</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  if (role !== 'USER') {
    return (
      <div className="container text-center mt-20">
        <h2>Unauthorized</h2>
        <p className="text-muted mt-sm mb-lg">Administrators cannot book courts.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Return to Dashboard</button>
      </div>
    );
  }

  const dates = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i));
  const availableCourts = currentClub.courts.filter(c => c.sport === selectedSport);
  const selectedCourt = currentClub.courts.find(c => c.id === selectedCourtId);

  const handleConfirmBooking = () => {
    const newBooking = {
      id: `bkg_${Date.now()}`,
      clubId: currentClub.id,
      sport: selectedSport,
      courtId: selectedCourtId,
      date: selectedDate.toISOString().split('T')[0],
      timeSlot: selectedTimeSlot,
      players: playerDetails.players,
      status: 'Pending',
      userId: userId || 'user_1',
      price: selectedCourt.pricePerHour,
      adharCard: playerDetails.adharCard,
      panCard: playerDetails.panCard,
      isVerifiedByAdmin: false
    };
    
    setBookings(prev => [...prev, newBooking]);
    setIsBooked(true);
  };

  if (isBooked) {
    return (
      <div className="container mt-20 text-center animate-fade-in">
        <div className="glass-panel p-lg" style={{maxWidth: '600px', margin: '0 auto'}}>
          <CheckCircle2 size={64} className="text-success mb-md mx-auto" />
          <h2 className="text-primary mb-sm">Booking Confirmed!</h2>
          <p className="text-muted mb-lg">Your court at {currentClub.name} has been successfully booked.</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>View My Bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container booking-page mt-20">
      
      <div className="booking-wizard">
        <button className="back-btn-ghost mb-md" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="mb-lg">Book a Court</h1>

        {/* STEP 1 */}
        <div className={`wizard-step glass-panel p-lg mb-md ${step === 1 ? 'active-step' : ''}`}>
          <div className="step-title flex justify-between items-center" onClick={() => setStep(1)}>
            <h3>1. Select Sport</h3>
            {selectedSport && step > 1 && <span className="text-primary">{selectedSport}</span>}
          </div>
          
          {step === 1 && (
            <div className="sport-selection mt-md animate-fade-in">
              <div className="grid-selection">
                {currentClub.sports.map(sport => (
                  <button 
                    key={sport}
                    className={`selection-card glass-card ${selectedSport === sport ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSport(sport);
                      setSelectedCourtId(null);
                      setStep(2);
                    }}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2 */}
        <div className={`wizard-step glass-panel p-lg mb-md ${(step === 2 && selectedSport) ? 'active-step' : ''} ${!selectedSport ? 'disabled' : ''}`}>
          <div className="step-title flex justify-between items-center" onClick={() => selectedSport && setStep(2)}>
            <h3>2. Select Court</h3>
            {selectedCourt && step > 2 && <span className="text-primary">{selectedCourt.name}</span>}
          </div>
          
          {step === 2 && selectedSport && (
            <div className="court-selection mt-md animate-fade-in">
              {availableCourts.length > 0 ? (
                <div className="grid-selection">
                  {availableCourts.map(court => (
                    <button 
                      key={court.id}
                      className={`selection-card glass-card ${selectedCourtId === court.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCourtId(court.id);
                        setStep(3);
                      }}
                    >
                      <div>{court.name}</div>
                      <div className="text-primary text-sm mt-xs">₹{court.pricePerHour}/hr</div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No courts available for {selectedSport} at this club.</p>
              )}
            </div>
          )}
        </div>

        {/* STEP 3 */}
        <div className={`wizard-step glass-panel p-lg mb-md ${(step === 3 && selectedCourtId) ? 'active-step' : ''} ${!selectedCourtId ? 'disabled' : ''}`}>
          <div className="step-title flex justify-between items-center" onClick={() => selectedCourtId && setStep(3)}>
            <h3>3. Date & Time</h3>
            {selectedDate && selectedTimeSlot && step > 3 && (
              <span className="text-primary">{format(selectedDate, 'MMM dd')} | {selectedTimeSlot.split(' - ')[0]}</span>
            )}
          </div>
          
          {step === 3 && selectedCourtId && (
            <div className="datetime-selection mt-md animate-fade-in">
              <h4 className="mb-sm">Select Date</h4>
              <div className="dates-scroll">
                {dates.map((date, idx) => (
                  <button 
                    key={idx}
                    className={`date-card glass-card ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="text-sm text-muted">{format(date, 'EEE')}</div>
                    <div className="text-lg font-bold">{format(date, 'dd')}</div>
                    <div className="text-xs">{format(date, 'MMM')}</div>
                  </button>
                ))}
              </div>

              {selectedDate && (
                <div className="times-section mt-lg animate-fade-in">
                  <h4 className="mb-sm">Select Time Slot</h4>
                  <div className="grid-selection times-grid">
                    {TIME_SLOTS.map(slot => (
                      <button 
                        key={slot}
                        className={`selection-card glass-card text-sm ${selectedTimeSlot === slot ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedTimeSlot(slot);
                          setStep(4);
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STEP 4: Player Details */}
        <div className={`wizard-step glass-panel p-lg mb-md ${(step === 4 && selectedTimeSlot) ? 'active-step' : ''} ${!selectedTimeSlot ? 'disabled' : ''}`}>
          <div className="step-title flex justify-between items-center" onClick={() => selectedTimeSlot && setStep(4)}>
            <h3>4. Player Details</h3>
            {playerDetails.adharCard && step > 4 && (
              <span className="text-primary">{playerDetails.players} Player(s)</span>
            )}
          </div>
          
          {step === 4 && selectedTimeSlot && (
            <div className="player-details mt-md animate-fade-in flex-col gap-md">
              <div>
                <label className="text-sm text-muted mb-xs block">Adhar Card Number</label>
                <input 
                  type="text" 
                  placeholder="e.g., 1234 5678 9012" 
                  className="form-input" 
                  value={playerDetails.adharCard}
                  onChange={e => setPlayerDetails({...playerDetails, adharCard: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-muted mb-xs block">PAN Card Number</label>
                <input 
                  type="text" 
                  placeholder="e.g., ABCDE1234F" 
                  className="form-input" 
                  value={playerDetails.panCard}
                  onChange={e => setPlayerDetails({...playerDetails, panCard: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm text-muted mb-xs block">Number of Players</label>
                <input 
                  type="number" 
                  min="1" max="20"
                  className="form-input" 
                  value={playerDetails.players}
                  onChange={e => {
                    const val = e.target.value;
                    setPlayerDetails({...playerDetails, players: val === '' ? '' : parseInt(val)});
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="booking-summary-sidebar">
        <div className="glass-panel p-lg sticky-widget">
          <h2 className="mb-md border-b pb-sm">Booking Summary</h2>
          
          <div className="summary-details flex-col gap-sm">
            <div className="summary-item">
              <span className="text-muted">Club</span>
              <span className="font-semibold text-right">{currentClub.name}</span>
            </div>
            
            <div className="summary-item">
              <span className="text-muted">Sport</span>
              <span className="text-right">{selectedSport || '-'}</span>
            </div>
            
            <div className="summary-item">
              <span className="text-muted">Court</span>
              <span className="text-right">{selectedCourt ? selectedCourt.name : '-'}</span>
            </div>
            
            <div className="summary-item">
              <span className="text-muted">Date & Time</span>
              <span className="text-right flex-col items-end">
                <span>{selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : '-'}</span>
                <span className="text-sm text-primary">{selectedTimeSlot || ''}</span>
              </span>
            </div>

            {selectedCourt && (
              <div className="summary-total mt-md pt-md border-t flex justify-between items-center">
                <span className="font-semibold">Total Price</span>
                <span className="text-xl font-bold text-primary">₹{selectedCourt.pricePerHour}</span>
              </div>
            )}
          </div>

          <button 
            className="btn-primary btn-large w-full mt-lg"
            disabled={!selectedSport || !selectedCourtId || !selectedDate || !selectedTimeSlot || !playerDetails.adharCard || !playerDetails.panCard}
            onClick={handleConfirmBooking}
          >
            Confirm Booking
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default Booking;
