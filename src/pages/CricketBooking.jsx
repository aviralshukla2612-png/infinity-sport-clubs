import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  ArrowLeft, CheckCircle2, User, Car, Coffee, DoorOpen, Medal, Map, ArrowRight,
  Calendar, Clock, FileText, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useGlobalBooking } from '../context/GlobalBookingContext';
import ground1Img from '../assets/images/ground1.jpg';
import ground2Img from '../assets/images/ground2.jpg';
import ground3Img from '../assets/images/ground3.jpg';
import './CricketBooking.css';

const grounds = [
  { id: 1, name: 'Ground 1', isPremium: true, type: 'Box Cricket', format: '7 v 7', price: 1999, image: ground1Img },
  { id: 2, name: 'Ground 2', isPremium: false, type: 'Box Cricket', format: '7 v 7', price: 1799, image: ground2Img },
  { id: 3, name: 'Ground 3', isPremium: false, type: 'Box Cricket', format: '7 v 7', price: 1799, image: ground3Img },
  { id: 4, name: 'Ground 4', isPremium: false, type: 'Box Cricket', format: '7 v 7', price: 1599, image: ground1Img },
  { id: 5, name: 'Ground 5', isPremium: false, type: 'Box Cricket', format: '7 v 7', price: 1999, image: ground2Img }
];

const timeSlots = [
  { time: '6:00 AM - 7:00 AM', status: 'available' },
  { time: '7:00 AM - 8:00 AM', status: 'available' },
  { time: '8:00 AM - 9:00 AM', status: 'available' },
  { time: '9:00 AM - 10:00 AM', status: 'available' },
  { time: '10:00 AM - 11:00 AM', status: 'booked' },
  { time: '11:00 AM - 12:00 PM', status: 'available' },
  { time: '12:00 PM - 1:00 PM', status: 'available' },
  { time: '1:00 PM - 2:00 PM', status: 'available' },
  { time: '2:00 PM - 3:00 PM', status: 'booked' },
  { time: '3:00 PM - 4:00 PM', status: 'available' },
  { time: '4:00 PM - 5:00 PM', status: 'available' },
  { time: '5:00 PM - 6:00 PM', status: 'booked' }
];

const CricketBooking = () => {
  const navigate = useNavigate();
  const { addBooking } = useGlobalBooking();
  const [step, setStep] = useState(1);
  const [selectedGroundId, setSelectedGroundId] = useState(1);

  // Calendar state - use real current date
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(null);

  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [playerCount, setPlayerCount] = useState(8);

  // Payment Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmBookingModal, setShowConfirmBookingModal] = useState(false);
  const [showChangePaymentModal, setShowChangePaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('gpay');
  const [cardType, setCardType] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const isPaymentValid = () => {
    if (selectedPaymentMethod !== 'card') return true;
    const isNumValid = cardDetails.number.replace(/\s/g, '').length === 16;
    const isExpValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry);
    const isCvvValid = /^\d{3}$/.test(cardDetails.cvv);
    const isNameValid = cardDetails.name.trim().length > 0;
    return isNumValid && isExpValid && isCvvValid && isNameValid;
  };
  
  // Player Details State
  const [playerDetails, setPlayerDetails] = useState({
    fullName: '',
    phone: '',
    email: '',
    aadhar: '',
    requests: ''
  });
  const [otherPlayers, setOtherPlayers] = useState([]);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  
  const selectedGround = grounds.find(g => g.id === selectedGroundId);

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const getNextButtonText = () => {
    switch(step) {
      case 1: return 'Next: Select Date';
      case 2: return 'Next: Select Time Slot';
      case 3: return 'Next: Players & Details';
      case 4: return 'Preview Booking';
      default: return 'Confirm Booking';
    }
  };

  const isNextDisabled = () => {
    if (step === 1 && !selectedGroundId) return true;
    if (step === 2 && !selectedDate) return true;
    if (step === 3 && !selectedTimeSlot) return true;
    if (step === 4) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!playerDetails.fullName.trim() || !playerDetails.phone.trim() || !playerDetails.email.trim() || !emailRegex.test(playerDetails.email) || !playerDetails.aadhar.trim()) {
        return true;
      }
      const numOtherPlayers = playerCount === '10+' ? 9 : playerCount - 1;
      if (numOtherPlayers > 0) {
        for (let i = 0; i < numOtherPlayers; i++) {
          const p = otherPlayers[i];
          if (!p || !p.name?.trim() || !p.aadhar?.trim() || p.aadhar.length < 14) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return (name[0] || 'P').toUpperCase();
  };

  const getFirstName = (name) => {
    if (!name) return 'Player';
    return name.trim().split(' ')[0];
  };

  const allPlayersList = [
    playerDetails.fullName,
    ...otherPlayers.slice(0, playerCount === '10+' ? 9 : playerCount - 1).map(p => p?.name)
  ];

  return (
    <div className="cricket-booking-container animate-fade-in">
      {/* Parallax Hero Section */}
      <div className="parallax-hero">
        <div className="parallax-overlay"></div>
        <div className="hero-content">
          <div className="breadcrumbs">
            <span>Home</span> &gt; <span>Sports</span> &gt; <span>Cricket</span> &gt; <span className="active">Book Ground</span>
          </div>
          
          <div className="hero-title-section">
            <div className="back-circle" onClick={() => {
              if (step > 1) setStep(step - 1);
              else navigate(-1);
            }}>
              <ArrowLeft size={20} />
            </div>
            <h1 className="hero-title">Book <span>Cricket Ground</span></h1>
          </div>
          <p className="hero-subtitle">
            {step === 5 
              ? 'Review your booking details before confirming.'
              : 'Select your preferred court, date and time to book your cricket ground.'}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="booking-main-content">
        
        {/* Steps Wizard */}
        {step < 6 && (
          <div className="steps-indicator">
            {/* Step 1 */}
            <div className={`step-item ${step > 1 ? 'completed' : (step === 1 ? 'active' : '')}`} onClick={() => setStep(1)} style={{cursor: 'pointer'}}>
              <div className="step-circle">{step > 1 ? <CheckCircle2 size={16} /> : '1'}</div>
              <span>Select Ground</span>
            </div>
            <div className="step-line"></div>
            
            {/* Step 2 */}
            <div className={`step-item ${step > 2 ? 'completed' : (step === 2 ? 'active' : '')}`} onClick={() => step >= 2 && setStep(2)} style={{cursor: step >= 2 ? 'pointer' : 'default'}}>
              <div className="step-circle">{step > 2 ? <CheckCircle2 size={16} /> : '2'}</div>
              <span>Select Date</span>
            </div>
            <div className="step-line"></div>
            
            {/* Step 3 */}
            <div className={`step-item ${step > 3 ? 'completed' : (step === 3 ? 'active' : '')}`} onClick={() => step >= 3 && setStep(3)} style={{cursor: step >= 3 ? 'pointer' : 'default'}}>
              <div className="step-circle">{step > 3 ? <CheckCircle2 size={16} /> : '3'}</div>
              <span>Select Time</span>
            </div>
            <div className="step-line"></div>
            
            {/* Step 4 */}
            <div className={`step-item ${step > 4 ? 'completed' : (step === 4 ? 'active' : '')}`} onClick={() => step >= 4 && setStep(4)} style={{cursor: step >= 4 ? 'pointer' : 'default'}}>
              <div className="step-circle">{step > 4 ? <CheckCircle2 size={16} /> : '4'}</div>
              <span>Players & Details</span>
            </div>
            <div className="step-line"></div>
            
            {/* Step 5 */}
            <div className={`step-item ${step === 5 ? 'active' : ''}`}>
              <div className="step-circle">5</div>
              <span>Confirm Booking</span>
            </div>
          </div>
        )}

        {/* Dynamic Layout (2 Columns for steps 1-4) */}
        {step < 5 && (
          <div className="booking-grid">
            
            {/* Left Panel: Content changes based on step */}
            <div className="left-panel">
              
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="section-title">Select Ground</h2>
                  <div className="grounds-grid">
                    {grounds.map((ground) => (
                      <div 
                        key={ground.id}
                        className={`ground-card ${selectedGroundId === ground.id ? 'selected' : ''}`}
                        onClick={() => setSelectedGroundId(ground.id)}
                      >
                        {selectedGroundId === ground.id && (
                          <CheckCircle2 size={20} className="selected-badge" />
                        )}
                        <img src={ground.image} alt={ground.name} className="ground-image" />
                        <div className="ground-info">
                          <div className="ground-name">
                            {ground.name}
                            {ground.isPremium && <span className="premium-tag">Premium</span>}
                          </div>
                          <div className="ground-details">
                            <div className="ground-details-row"><User size={12} /> <span>{ground.type}</span></div>
                            <div className="ground-details-row"><User size={12} /> <span>{ground.format}</span></div>
                          </div>
                          <div className="ground-price">
                            ₹{ground.price} <span style={{fontSize: '0.75rem', color: '#888', fontWeight: 'normal'}}>/ per hour</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (() => {
                const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
                const firstDay = new Date(calYear, calMonth, 1).getDay();
                const todayDate = today.getDate();
                const isCurrentMonth = calYear === today.getFullYear() && calMonth === today.getMonth();
                return (
                <div className="detail-panel animate-fade-in">
                  <div className="panel-header">
                    <Calendar size={18} className="panel-icon" />
                    <h3>Select Date</h3>
                  </div>
                  <div className="calendar-widget" style={{maxWidth: '400px'}}>
                    <div className="calendar-header">
                      <ChevronLeft size={16} className="cal-nav" style={{cursor:'pointer'}} onClick={() => {
                        if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                        else setCalMonth(m => m - 1);
                        setSelectedDate(null);
                      }} />
                      <span>{monthNames[calMonth]} {calYear}</span>
                      <ChevronRight size={16} className="cal-nav" style={{cursor:'pointer'}} onClick={() => {
                        if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                        else setCalMonth(m => m + 1);
                        setSelectedDate(null);
                      }} />
                    </div>
                    <div className="calendar-grid">
                      <div className="cal-day">SUN</div><div className="cal-day">MON</div><div className="cal-day">TUE</div><div className="cal-day">WED</div><div className="cal-day">THU</div><div className="cal-day">FRI</div><div className="cal-day">SAT</div>
                      {[...Array(firstDay)].map((_, i) => <div key={`e${i}`}></div>)}
                      {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const isPast = isCurrentMonth && day < todayDate;
                        return (
                          <div
                            key={day}
                            className={`cal-date ${selectedDate === day ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                            onClick={() => !isPast && setSelectedDate(day)}
                            style={isPast ? {opacity: 0.3, cursor: 'not-allowed', pointerEvents: 'none'} : {cursor:'pointer'}}
                          >
                            {day}
                          </div>
                        );
                      })}
                    </div>
                    <div className="calendar-legend">
                      <div className="legend-item"><span className="dot available"></span> Available</div>
                      <div className="legend-item"><span className="dot booked"></span> Booked</div>
                      <div className="legend-item"><span className="dot unavailable"></span> Unavailable</div>
                    </div>
                  </div>
                </div>
                );
              })()}

              {step === 3 && (
                <div className="detail-panel animate-fade-in">
                  <div className="panel-header">
                    <Clock size={18} className="panel-icon" />
                    <h3>Select Time Slot</h3>
                  </div>
                  <div className="time-ground-info">
                    <h4>{selectedGround?.name}</h4>
                    <p>{selectedGround?.type}</p>
                  </div>
                  <div className="time-slots-grid">
                    {timeSlots.map((slot, idx) => (
                      <div 
                        key={idx} 
                        className={`time-slot ${slot.status === 'booked' ? 'booked' : (selectedTimeSlot === slot.time ? 'selected' : 'available')}`}
                        onClick={() => {
                          if (slot.status !== 'booked') setSelectedTimeSlot(slot.time);
                        }}
                      >
                        {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="detail-panel flex-col animate-fade-in">
                  <div className="panel-header">
                    <User size={18} className="panel-icon" />
                    <h3>Players & Details</h3>
                  </div>
                  
                  <div className="form-fields" style={{maxWidth: '500px'}}>
                    <div className="form-group">
                      <label>Number of Players</label>
                      <div className="players-selector">
                        {[2, 4, 6, 8, '10+'].map(num => (
                          <div 
                            key={num}
                            className={`player-btn ${playerCount === num ? 'selected' : ''}`}
                            onClick={() => setPlayerCount(num)}
                          >
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" className="dark-input" placeholder="Your Name" maxLength={50} value={playerDetails.fullName} onChange={(e) => setPlayerDetails({...playerDetails, fullName: e.target.value.replace(/[^a-zA-Z\s]/g, '')})} />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        className="dark-input"
                        placeholder="Enter mobile number"
                        value={playerDetails.phone}
                        maxLength={10}
                        inputMode="numeric"
                        style={{color:'#fff'}}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPlayerDetails({...playerDetails, phone: val});
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" className="dark-input" placeholder="Your Email" maxLength={100} value={playerDetails.email} onChange={(e) => setPlayerDetails({...playerDetails, email: e.target.value})} />
                      {playerDetails.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(playerDetails.email) && (
                        <span style={{color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', display: 'block'}}>Please enter a valid email address.</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label>Aadhar Card Number</label>
                      <input
                        type="text"
                        className="dark-input"
                        placeholder="XXXX XXXX XXXX"
                        value={playerDetails.aadhar}
                        maxLength={14}
                        inputMode="numeric"
                        style={{color:'#fff'}}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                          const fmt = digits.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_, a, b, c) => c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a);
                          setPlayerDetails({...playerDetails, aadhar: fmt});
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Special Requests (Optional)</label>
                      <textarea className="dark-input" rows="3" placeholder="Any special requests..." maxLength={200} value={playerDetails.requests} onChange={(e) => setPlayerDetails({...playerDetails, requests: e.target.value})}></textarea>
                    </div>
                  </div>

                  {/* Other Players */}
                  {(playerCount === '10+' ? 9 : playerCount - 1) > 0 && (
                    <div style={{ marginTop: '2rem' }}>
                      <h4 style={{ marginBottom: '1rem', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '0.5rem' }}>Other Players Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[...Array(playerCount === '10+' ? 9 : playerCount - 1)].map((_, i) => (
                          <div key={i} style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
                            <div style={{ fontSize: '0.85rem', color: '#FF7A00', marginBottom: '0.5rem', fontWeight: 600 }}>Player {i + 2}</div>
                            <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                              <label style={{ fontSize: '0.75rem', color: '#888' }}>Full Name</label>
                              <input type="text" className="dark-input" style={{ padding: '0.5rem' }} placeholder="Player Name" maxLength={50}
                                value={otherPlayers[i]?.name || ''}
                                onChange={(e) => {
                                  const newPlayers = [...otherPlayers];
                                  if (!newPlayers[i]) newPlayers[i] = {};
                                  newPlayers[i].name = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                  setOtherPlayers(newPlayers);
                                }} 
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: '0' }}>
                              <label style={{ fontSize: '0.75rem', color: '#888' }}>Aadhar Card</label>
                              <input type="text" className="dark-input" style={{ padding: '0.5rem' }} placeholder="XXXX XXXX XXXX"
                                maxLength={14}
                                value={otherPlayers[i]?.aadhar || ''}
                                onChange={(e) => {
                                  const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                                  const fmt = digits.replace(/(\d{4})(\d{1,4})?(\d{1,4})?/, (_, a, b, c) => c ? `${a} ${b} ${c}` : b ? `${a} ${b}` : a);
                                  const newPlayers = [...otherPlayers];
                                  if (!newPlayers[i]) newPlayers[i] = {};
                                  newPlayers[i].aadhar = fmt;
                                  setOtherPlayers(newPlayers);
                                }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Right Panel: Summary Sidebar */}
            <div className="right-panel">
              <h3 className="summary-title">Booking Summary</h3>
              
              <div className="summary-row">
                <span className="label">Sport</span>
                <span className="value highlight">Cricket</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Ground</span>
                <span className="value highlight">{selectedGround?.name || '-'}</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Date</span>
                <span className="value">{selectedDate ? `${selectedDate} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][calMonth]} ${calYear}` : '-'}</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Time</span>
                <span className="value">{selectedTimeSlot || '-'}</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Players</span>
                <span className="value">{step >= 4 ? `${playerCount} Players` : '-'}</span>
              </div>
              
              <div className="summary-row">
                <span className="label">Price (per hour)</span>
                <span className="value highlight">₹{selectedGround?.price || 0}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-total">
                <span>Total</span>
                <span className="price">₹{selectedGround?.price || 0}</span>
              </div>
              
              <button 
                className="btn-next"
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                {getNextButtonText()} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Full 4-Column Preview */}
        {step === 5 && (
          <div className="preview-layout-container animate-fade-in">
            {/* Left Panel */}
            <div className="preview-main-panel">
              {/* Hero section */}
              <div className="preview-hero" style={{backgroundImage: `url(${selectedGround.image})`}}>
                <div className="preview-hero-overlay"></div>
                <div className="preview-hero-content">
                  <h2>{selectedGround.name}</h2>
                  <p>Infinity Arena</p>
                  <div className="tags">
                     <span><Map size={14}/> Ahmedabad, Gujarat</span>
                     <span><DoorOpen size={14}/> Indoor</span>
                  </div>
                </div>
              </div>
              
              {/* Booking Details Grid */}
              <div className="preview-section">
                <h3 className="preview-section-title"><CheckCircle2 size={16}/> Booking Details</h3>
                <div className="preview-details-grid">
                   <div className="preview-detail-card">
                     <Calendar size={18} className="preview-icon"/>
                     <div>
                       <div className="label">Date</div>
                       <div className="val">{selectedDate ? `${selectedDate} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][calMonth]} ${calYear}` : '-'}</div>
                       <div className="sub">Friday</div>
                     </div>
                   </div>
                   <div className="preview-detail-card">
                     <Clock size={18} className="preview-icon"/>
                     <div>
                       <div className="label">Time</div>
                       <div className="val">{selectedTimeSlot}</div>
                       <div className="sub">1 Hour</div>
                     </div>
                   </div>
                   <div className="preview-detail-card">
                     <Map size={18} className="preview-icon"/>
                     <div>
                       <div className="label">Ground</div>
                       <div className="val">{selectedGround.name}</div>
                       <div className="sub">Infinity Arena</div>
                     </div>
                   </div>
                   <div className="preview-detail-card">
                     <FileText size={18} className="preview-icon"/>
                     <div>
                       <div className="label">Price</div>
                       <div className="val">₹{selectedGround.price}</div>
                       <div className="sub">Total</div>
                     </div>
                   </div>
                </div>
              </div>

              {/* Players */}
              <div className="preview-section">
                 <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                   <h3 className="preview-section-title" style={{margin: 0}}><User size={16}/> Players Details ({playerCount} Players)</h3>
                   <span style={{color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.8rem'}} onClick={() => setShowPlayersModal(true)}>View All</span>
                 </div>
                 <div className="preview-avatars">
                    {/* Real avatars based on player count */}
                    {allPlayersList.slice(0, 6).map((name, i) => (
                       <div key={i} className="preview-avatar-item">
                         <div className="preview-avatar">{getInitials(name)}</div>
                         <div style={{fontSize: '0.75rem', marginTop: '0.4rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '50px'}}>{getFirstName(name) || `Player ${i+1}`}</div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Add Ons */}
              <div className="preview-section" style={{borderBottom: 'none'}}>
                 <h3 className="preview-section-title"><Medal size={16}/> Add Ons & Amenities</h3>
                 <div className="preview-amenities">
                    <div className="preview-amenity"><CheckCircle2 size={16} style={{color: 'var(--primary-color)'}}/> <div>LED Lights<br/><span style={{fontSize: '0.75rem', color: '#666'}}>Included</span></div></div>
                    <div className="preview-amenity"><DoorOpen size={16} style={{color: 'var(--primary-color)'}}/> <div>Changing Room<br/><span style={{fontSize: '0.75rem', color: '#666'}}>Included</span></div></div>
                    <div className="preview-amenity"><Car size={16} style={{color: 'var(--primary-color)'}}/> <div>Parking<br/><span style={{fontSize: '0.75rem', color: '#666'}}>Included</span></div></div>
                    <div className="preview-amenity"><Coffee size={16} style={{color: 'var(--primary-color)'}}/> <div>Drinking Water<br/><span style={{fontSize: '0.75rem', color: '#666'}}>Included</span></div></div>
                 </div>
              </div>

              {/* Savings banner */}
              <div className="preview-savings-banner">
                 <CheckCircle2 size={16}/> Great Choice! You are saving ₹200 with this booking. 🎉
              </div>
            </div>

            {/* Right Panel - Summary */}
            <div className="preview-summary-panel">
              <h3 style={{fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem'}}>Booking Summary</h3>
              
              <div className="preview-summary-row">
                <span>Ground Price (1 Hour)</span>
                <span>₹{selectedGround.price}</span>
              </div>
              <div className="preview-summary-row" style={{fontSize: '0.8rem', color: '#888'}}>
                <span>Service Fee ⓘ</span>
                <span>₹100</span>
              </div>
              <div className="preview-summary-row" style={{fontSize: '0.8rem', color: '#888', marginBottom: '1rem'}}>
                <span>Convenience Fee ⓘ</span>
                <span>₹100</span>
              </div>
              
              <div className="preview-total-row">
                 <div>
                   <div>Total Amount</div>
                   <div style={{fontSize: '0.75rem', color: '#888', fontWeight: 'normal'}}>Exclusive of all taxes</div>
                 </div>
                 <div style={{color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold'}}>₹{selectedGround.price + 200}</div>
              </div>

              <div style={{marginTop: '1.5rem'}}>
                 <h4 style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#ccc', marginBottom: '0.5rem'}}><CheckCircle2 size={14}/> Cancellation Policy</h4>
                 <p style={{fontSize: '0.75rem', color: '#888', paddingLeft: '1.5rem', margin: 0}}>Cancel up to 12 hours before the booking start time for a full refund.</p>
              </div>

              <div style={{marginTop: '1.5rem'}}>
                 <h4 style={{fontSize: '0.85rem', color: '#ccc', marginBottom: '0.5rem'}}>Payment Method</h4>
                 <div className="payment-box">
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                       {selectedPaymentMethod === 'card' ? (
                          <>
                            <div className="bank-icon">{cardType === 'credit' ? 'CC' : 'DC'}</div>
                            <span style={{fontSize: '0.85rem'}}>Card ends in **** 4321</span>
                          </>
                       ) : selectedPaymentMethod === 'cash' ? (
                          <>
                            <div className="bank-icon" style={{background: '#4caf50', color: '#fff'}}>₹</div>
                            <span style={{fontSize: '0.85rem'}}>Pay at Ground (Cash)</span>
                          </>
                       ) : (
                          <>
                            <div className="bank-icon" style={{background: '#fff', color: '#000'}}>{selectedPaymentMethod.substring(0, 2).toUpperCase()}</div>
                            <span style={{fontSize: '0.85rem'}}>{selectedPaymentMethod === 'gpay' ? 'GPay' : selectedPaymentMethod === 'phonepe' ? 'PhonePe' : 'Paytm'}</span>
                          </>
                       )}
                    </div>
                    <span style={{fontSize: '0.75rem', color: 'var(--primary-color)', cursor: 'pointer'}} onClick={() => setShowChangePaymentModal(true)}>Change</span>
                 </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#4caf50', margin: '1.5rem 0'}}>
                 <CheckCircle2 size={16}/>
                 <span>100% Secure Booking. Your payment and personal details are always safe with us.</span>
              </div>

              <button className="preview-btn-confirm" onClick={() => setShowPaymentModal(true)}>
                 Confirm Booking <ArrowRight size={18}/>
              </button>
              <button className="preview-btn-edit" onClick={() => setStep(4)}>
                 <ArrowLeft size={16}/> Edit Booking Details
              </button>

              <div style={{marginTop: '1rem', textAlign: 'center', fontSize: '0.75rem', color: '#888'}}>
                 Have a coupon code? <span style={{color: 'var(--primary-color)', cursor: 'pointer'}}>Apply</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Confirmation Screen */}
        {step === 6 && (
          <div className="detail-panel animate-fade-in text-center flex-col justify-center items-center" style={{minHeight: '400px'}}>
             <CheckCircle2 size={80} style={{color: '#4caf50', marginBottom: '1rem'}} />
             <h2>Booking Confirmed!</h2>
             <p className="text-muted mt-sm mb-lg">Your ground booking has been confirmed successfully.</p>
             <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginTop:'1.5rem'}}>
               <button
                 style={{
                   padding:'0.85rem 2.5rem',
                   background:'linear-gradient(135deg, #FF7A00, #e66d00)',
                   border:'none', borderRadius:'12px',
                   color:'#fff', fontSize:'0.95rem', fontWeight:700,
                   cursor:'pointer', display:'flex', alignItems:'center', gap:'0.6rem',
                   boxShadow:'0 4px 20px rgba(255,122,0,0.35)',
                   transition:'all 0.2s'
                 }}
                 onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                 onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                 onClick={() => navigate('/')}
               >
                 🏠 Back to Home
               </button>
               <button
                 style={{
                   padding:'0.85rem 2.5rem',
                   background:'linear-gradient(135deg, #1a5fb4, #007BFF)',
                   border:'none', borderRadius:'12px',
                   color:'#fff', fontSize:'0.95rem', fontWeight:700,
                   cursor:'pointer', display:'flex', alignItems:'center', gap:'0.6rem',
                   boxShadow:'0 4px 20px rgba(0,123,255,0.35)',
                   transition:'all 0.2s'
                 }}
                 onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                 onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
                 onClick={() => navigate('/dashboard')}
               >
                 📋 My Bookings
               </button>
             </div>
          </div>
        )}

        {/* Bottom Facilities Bar */}
        <div className="facilities-bar">
          <div className="facility-item"><Map size={18} /><span>7+ Cricket Grounds</span></div>
          <div className="facility-item"><Medal size={18} /><span>Professional Facilities</span></div>
          <div className="facility-item"><Map size={18} /><span>2 Acres Sports Campus</span></div>
          <div className="facility-item"><Car size={18} /><span>Parking Available</span></div>
          <div className="facility-item"><Coffee size={18} /><span>Cafe Available</span></div>
          <div className="facility-item"><DoorOpen size={18} /><span>Changing Room</span></div>
        </div>

      </div>

      {/* Payment Selection Modal */}
      {showChangePaymentModal && (
        <div className="animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#141414', border: '1px solid #333', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '450px'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
               <h3 style={{margin: 0, fontSize: '1.2rem', fontWeight: 600}}>Select Payment Method</h3>
               <span style={{cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, color: '#888'}} onClick={() => setShowChangePaymentModal(false)}>&times;</span>
             </div>
             
             <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem'}}>
                {['GPay', 'PhonePe', 'Paytm', 'Cash', 'Card'].map(method => (
                  <div 
                    key={method} 
                    style={{
                      padding: '1rem', 
                      border: `1px solid ${selectedPaymentMethod === method.toLowerCase() ? 'var(--primary-color)' : '#333'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: selectedPaymentMethod === method.toLowerCase() ? 'rgba(255, 122, 0, 0.05)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedPaymentMethod(method.toLowerCase())}
                  >
                    <span style={{fontWeight: selectedPaymentMethod === method.toLowerCase() ? '600' : 'normal'}}>{method}</span>
                    {selectedPaymentMethod === method.toLowerCase() && <CheckCircle2 size={18} style={{color: 'var(--primary-color)'}}/>}
                  </div>
                ))}
             </div>

             {selectedPaymentMethod === 'card' && (
               <div className="animate-fade-in" style={{background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid #333', marginBottom: '1.5rem'}}>
                 <div style={{display: 'flex', gap: '1.5rem', marginBottom: '1.25rem'}}>
                   <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem'}}>
                      <input type="radio" name="cardType" checked={cardType === 'credit'} onChange={() => setCardType('credit')} style={{accentColor: 'var(--primary-color)', width: '16px', height: '16px'}}/> Credit Card
                   </label>
                   <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem'}}>
                      <input type="radio" name="cardType" checked={cardType === 'debit'} onChange={() => setCardType('debit')} style={{accentColor: 'var(--primary-color)', width: '16px', height: '16px'}}/> Debit Card
                   </label>
                 </div>
                 <div className="form-group" style={{marginBottom: '1.25rem'}}>
                   <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem'}}>Card Number</label>
                   <input type="text" className="dark-input" placeholder="0000 0000 0000 0000" />
                 </div>
                 <div style={{display: 'flex', gap: '1rem'}}>
                   <div className="form-group" style={{flex: 1}}>
                     <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem'}}>Expiry Date</label>
                     <input type="text" className="dark-input" placeholder="MM/YY" />
                   </div>
                   <div className="form-group" style={{flex: 1}}>
                     <label style={{display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '0.4rem'}}>CVV</label>
                     <input type="password" className="dark-input" placeholder="123" maxLength={3} />
                   </div>
                 </div>
               </div>
             )}

             <button className="preview-btn-confirm" onClick={() => setShowChangePaymentModal(false)}>
               Save & Continue
             </button>
            </div>
          </div>
        )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal animate-fade-in">
            <h3 style={{marginBottom: '1.5rem'}}>Select Payment Method</h3>
            
            <div className="payment-options">
              <div 
                className={`payment-option ${selectedPaymentMethod === 'gpay' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('gpay')}
              >
                <div className="radio-btn">
                  <div className="radio-inner"></div>
                </div>
                <div style={{fontWeight: 600}}>Google Pay</div>
              </div>
              <div 
                className={`payment-option ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('upi')}
              >
                <div className="radio-btn">
                  <div className="radio-inner"></div>
                </div>
                <div style={{fontWeight: 600}}>UPI / Pay at Venue</div>
              </div>

              <div 
                className={`payment-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('card')}
              >
                <div className="radio-btn">
                  <div className="radio-inner"></div>
                </div>
                <div style={{fontWeight: 600}}>Credit / Debit Card</div>
              </div>
            </div>

            {selectedPaymentMethod === 'card' && (
              <div className="card-details animate-fade-in">
                <div className="card-type-tabs">
                  <div 
                    className={`card-tab ${cardType === 'credit' ? 'active' : ''}`}
                    onClick={() => setCardType('credit')}
                  >Credit Card</div>
                  <div 
                    className={`card-tab ${cardType === 'debit' ? 'active' : ''}`}
                    onClick={() => setCardType('debit')}
                  >Debit Card</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <input type="text" className="dark-input" placeholder="Card Number (16 digits)" maxLength={19} value={cardDetails.number} onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                    setCardDetails({...cardDetails, number: formatted});
                  }} />
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                    <input type="text" className="dark-input" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                      if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2);
                      setCardDetails({...cardDetails, expiry: val});
                    }} />
                    <input type="password" className="dark-input" placeholder="CVV (3 digits)" maxLength={3} value={cardDetails.cvv} onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setCardDetails({...cardDetails, cvv: val});
                    }} />
                  </div>
                  <input type="text" className="dark-input" placeholder="Name on Card" value={cardDetails.name} onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})} />
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem'}}>
                    <input type="checkbox" id="saveCard" style={{accentColor: 'var(--primary-color)', width: '16px', height: '16px', cursor: 'pointer'}} />
                    <label htmlFor="saveCard" style={{fontSize: '0.85rem', color: '#aaa', cursor: 'pointer'}}>Save this card for future payments</label>
                  </div>
                </div>
              </div>
            )}

             <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button className="modal-btn-cancel" style={{flex: 1}} onClick={() => setShowPaymentModal(false)}>Cancel</button>
              <button className="modal-btn-confirm" style={{flex: 2, opacity: isPaymentValid() ? 1 : 0.5, cursor: isPaymentValid() ? 'pointer' : 'not-allowed'}} disabled={!isPaymentValid()} onClick={() => setShowConfirmBookingModal(true)}>Pay ₹{selectedGround.price + 200}</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmBookingModal && (
        <div className="payment-modal-overlay animate-fade-in" style={{zIndex: 2000}}>
          <div className="payment-modal" style={{maxWidth: '400px', textAlign: 'center'}}>
            <h3 style={{color: '#fff', marginBottom: '1rem'}}>Confirm Booking</h3>
            <p style={{color: '#aaa', marginBottom: '2rem'}}>Are you sure you want to proceed with the payment and confirm this booking?</p>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="modal-btn-cancel" style={{flex: 1}} onClick={() => setShowConfirmBookingModal(false)}>Cancel</button>
              <button className="modal-btn-confirm" style={{flex: 1}} onClick={() => {
                setShowConfirmBookingModal(false);
                const newId = '#BK' + Math.floor(Math.random() * 90000 + 10000);
                const bookingRecord = {
                  id: 'B' + Math.floor(Math.random() * 10000),
                  userId: 'user_1',
                  sport: 'cricket',
                  sportLabel: 'Box Cricket',
                  name: `Infinity Sports Club – ${selectedGround.name}`,
                  venue: 'Rajkot, Gujarat',
                  ground: `Box Cricket · ${selectedGround.name}`,
                  court: selectedGround.name,
                  date: format(new Date(calYear, calMonth, selectedDate), 'dd MMM yyyy'),
                  day: format(new Date(calYear, calMonth, selectedDate), 'EEEE'),
                  time: selectedTimeSlot,
                  timeSlot: selectedTimeSlot,
                  duration: '1 Hour',
                  players: `${playerCount} Players`,
                  price: selectedGround.price + 200,
                  amount: selectedGround.price + 200,
                  status: 'confirmed',
                  paymentStatus: 'paid',
                  customer: playerDetails.fullName,
                  phone: playerDetails.phone,
                  email: playerDetails.email,
                  bookedAt: format(new Date(), 'dd MMM yyyy'),
                  image: '/assets/ground1.jpg'
                };
                addBooking(bookingRecord);
                setShowPaymentModal(false);
                setStep(6);
              }}>Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Payment Modal */}
      {showPlayersModal && (
        <div className="payment-modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setShowPlayersModal(false) }}>
          <div className="payment-modal animate-fade-in" style={{ maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>All Players Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
                <div style={{ fontSize: '0.85rem', color: '#FF7A00', marginBottom: '0.5rem', fontWeight: 600 }}>Player 1 (Main)</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Name</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>{playerDetails.fullName || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Phone</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>{playerDetails.phone || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#888' }}>Aadhar</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>{playerDetails.aadhar || '-'}</span>
                </div>
              </div>

              {otherPlayers.slice(0, (playerCount === '10+' ? 9 : playerCount - 1)).map((p, i) => (
                <div key={i} style={{ background: '#111', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
                  <div style={{ fontSize: '0.85rem', color: '#FF7A00', marginBottom: '0.5rem', fontWeight: 600 }}>Player {i + 2}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>Name</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{p?.name || '-'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: '#888' }}>Aadhar</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff' }}>{p?.aadhar || '-'}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="next-btn" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setShowPlayersModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CricketBooking;
