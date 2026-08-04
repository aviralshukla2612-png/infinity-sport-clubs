import React, { createContext, useState, useContext, useEffect } from 'react';
import { DUMMY_CITIES, DUMMY_CLUBS, DUMMY_BOOKINGS } from '../data/dummyData';

const ClubContext = createContext(undefined);

export const ClubProvider = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);

  useEffect(() => {
    if (selectedCityId && selectedClubId) {
      const club = DUMMY_CLUBS.find(c => c.id === selectedClubId);
      if (club && club.cityId !== selectedCityId) {
        setSelectedClubId(null);
      }
    }
  }, [selectedCityId, selectedClubId]);

  const currentCity = DUMMY_CITIES.find(c => c.id === selectedCityId);
  const currentClub = DUMMY_CLUBS.find(c => c.id === selectedClubId);

  return (
    <ClubContext.Provider value={{
      selectedCityId,
      selectedClubId,
      setSelectedCityId,
      setSelectedClubId,
      currentCity,
      currentClub,
      bookings,
      setBookings
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
