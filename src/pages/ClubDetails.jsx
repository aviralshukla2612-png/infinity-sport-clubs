import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Clock, Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import { useAuth } from '../context/AuthContext';
import { DUMMY_CLUBS } from '../data/dummyData';
import './ClubDetails.css';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedClubId } = useClub();
  const { role } = useAuth();
  
  const club = DUMMY_CLUBS.find(c => c.id === id);

  if (!club) {
    return (
      <div className="container text-center mt-20">
        <h2>Club not found</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  const handleBookNow = () => {
    setSelectedClubId(club.id);
    navigate('/booking');
  };

  return (
    <div className="club-details">
      <div className="hero-banner" style={{ backgroundImage: `url(${club.image})` }}>
        <div className="hero-overlay"></div>
        <div className="container relative-z">
          <button className="back-btn glass-card" onClick={() => navigate('/')}>
            <ArrowLeft size={20} /> Back to Clubs
          </button>
          
          <div className="hero-content-bottom">
            <h1 className="club-title">{club.name}</h1>
            <div className="club-badges">
              <span className="badge glass-card"><Star size={16} fill="var(--primary-color)" className="text-primary"/> {club.rating} ({club.reviews} Reviews)</span>
              <span className="badge glass-card"><MapPin size={16} className="text-primary"/> {club.distance}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container club-content-grid">
        <div className="main-col">
          <section className="glass-panel p-lg mb-lg">
            <h2>Overview</h2>
            <div className="info-grid mt-md">
              <div className="info-item">
                <MapPin className="text-primary" />
                <div>
                  <h4>Address</h4>
                  <p className="text-muted">{club.address}</p>
                </div>
              </div>
              <div className="info-item">
                <Phone className="text-primary" />
                <div>
                  <h4>Contact</h4>
                  <p className="text-muted">{club.contactNumber}</p>
                </div>
              </div>
              <div className="info-item">
                <Clock className="text-primary" />
                <div>
                  <h4>Working Hours</h4>
                  <p className="text-muted">{club.openHours}</p>
                </div>
              </div>
            </div>
            
            <div className="map-placeholder mt-lg glass-card">
              <MapPin size={32} className="text-primary" />
              <p>{club.mapPlaceholder}</p>
            </div>
          </section>

          <section className="glass-panel p-lg mb-lg">
            <h2>Available Sports</h2>
            <div className="sports-list mt-md">
              {club.sports.map(sport => (
                <div key={sport} className="sport-item glass-card">
                  <CheckCircle2 size={20} className="text-success" />
                  <span>{sport}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel p-lg mb-lg">
            <h2>Facilities</h2>
            <div className="facilities-grid mt-md">
              {club.facilities.map(fac => (
                <div key={fac.id} className="facility-item">
                  <div className="fac-icon glass-card text-primary">
                    <CheckCircle2 size={20} />
                  </div>
                  <span>{fac.name}</span>
                </div>
              ))}
            </div>
          </section>
          
          <section className="glass-panel p-lg">
            <h2>Gallery</h2>
            <div className="gallery-grid mt-md">
              {club.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${club.name} ${idx + 1}`} className="gallery-img glass-card" />
              ))}
            </div>
          </section>
        </div>

        <div className="sidebar-col">
          <div className="booking-widget glass-panel p-lg sticky-widget">
            <h3>Ready to play?</h3>
            <p className="text-muted mt-sm mb-lg">Book your preferred court instantly.</p>
            
            <div className="courts-preview mb-lg">
              <h4>Available Courts</h4>
              <ul className="mt-sm">
                {club.courts.map(court => (
                  <li key={court.id} className="flex justify-between text-sm py-xs">
                    <span>{court.name} ({court.sport})</span>
                    <span className="text-primary">₹{court.pricePerHour}/hr</span>
                  </li>
                ))}
              </ul>
            </div>

            {role === 'USER' ? (
              <button className="btn-primary w-full" onClick={handleBookNow}>
                Book Now
              </button>
            ) : (
              <p className="text-muted text-center mt-md text-sm border-t pt-md">
                Administrators cannot make court bookings. Please switch to User view to book.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
