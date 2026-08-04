export const DUMMY_CITIES = [
  { id: 'city_ahd', name: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1588713437537-4581f1d7dcb4?q=80&w=600&auto=format&fit=crop' },
  { id: 'city_vad', name: 'Vadodara', image: 'https://images.unsplash.com/photo-1623910271101-314643c5b525?q=80&w=600&auto=format&fit=crop' },
  { id: 'city_sur', name: 'Surat', image: 'https://images.unsplash.com/photo-1620245233158-b1fb931f6cba?q=80&w=600&auto=format&fit=crop' },
  { id: 'city_raj', name: 'Rajkot', image: 'https://images.unsplash.com/photo-1634647313093-9c8c93540e1b?q=80&w=600&auto=format&fit=crop' }
];

export const DUMMY_FACILITIES = [
  { id: 'fac_parking', name: 'Parking', icon: 'Car' },
  { id: 'fac_cafe', name: 'Cafe', icon: 'Coffee' },
  { id: 'fac_washroom', name: 'Washroom', icon: 'Bath' },
  { id: 'fac_changing', name: 'Changing Room', icon: 'Shirt' },
  { id: 'fac_water', name: 'Drinking Water', icon: 'Droplets' }
];

export const DUMMY_CLUBS = [
  {
    id: 'club_ahd_sg',
    name: 'Infinity Sports Club SG Highway',
    cityId: 'city_ahd',
    address: 'SG Highway, Makarba, Ahmedabad, Gujarat 380015',
    distance: '3.2 km',
    openHours: '05:00 AM - 11:30 PM',
    rating: 4.8,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop'
    ],
    contactNumber: '+91 98765 43210',
    mapPlaceholder: 'Map view of SG Highway location',
    sports: ['Badminton', 'Cricket', 'Volleyball'],
    facilities: DUMMY_FACILITIES,
    courts: [
      { id: 'crt_1', name: 'Wooden Court 1', sport: 'Badminton', pricePerHour: 500 },
      { id: 'crt_2', name: 'Wooden Court 2', sport: 'Badminton', pricePerHour: 500 },
      { id: 'crt_3', name: 'Box Cricket Turf', sport: 'Cricket', pricePerHour: 1200 },
      { id: 'crt_4', name: 'Volleyball Arena', sport: 'Volleyball', pricePerHour: 600 }
    ]
  },
  {
    id: 'club_ahd_gota',
    name: 'Infinity Sports Club Gota',
    cityId: 'city_ahd',
    address: 'Gota Chokdi, Gota, Ahmedabad, Gujarat 382481',
    distance: '6.5 km',
    openHours: '06:00 AM - 10:00 PM',
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1628736449174-845187e5b6c3?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1628736449174-845187e5b6c3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554068865-24cecd4e34d8?q=80&w=800&auto=format&fit=crop'
    ],
    contactNumber: '+91 98765 43211',
    mapPlaceholder: 'Map view of Gota location',
    sports: ['Badminton', 'Table Tennis'],
    facilities: [DUMMY_FACILITIES[0], DUMMY_FACILITIES[2], DUMMY_FACILITIES[4]],
    courts: [
      { id: 'crt_5', name: 'Synthetic Court 1', sport: 'Badminton', pricePerHour: 400 },
      { id: 'crt_6', name: 'TT Room', sport: 'Table Tennis', pricePerHour: 200 }
    ]
  },
  {
    id: 'club_ahd_bopal',
    name: 'Infinity Sports Club Bopal',
    cityId: 'city_ahd',
    address: 'South Bopal, Ahmedabad, Gujarat 380058',
    distance: '8.1 km',
    openHours: '05:30 AM - 11:00 PM',
    rating: 4.7,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526676037777-05a232554f77?q=80&w=800&auto=format&fit=crop'
    ],
    contactNumber: '+91 98765 43212',
    mapPlaceholder: 'Map view of Bopal location',
    sports: ['Basketball', 'Football (Turf)', 'Badminton'],
    facilities: DUMMY_FACILITIES,
    courts: [
      { id: 'crt_7', name: 'Outdoor Turf', sport: 'Football', pricePerHour: 1200 },
      { id: 'crt_8', name: 'Basketball Court', sport: 'Basketball', pricePerHour: 800 }
    ]
  },
  {
    id: 'club_vad_alka',
    name: 'Infinity Sports Club Alkapuri',
    cityId: 'city_vad',
    address: 'Alkapuri, Vadodara, Gujarat 390007',
    distance: '2.0 km',
    openHours: '06:00 AM - 10:30 PM',
    rating: 4.9,
    reviews: 540,
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800&auto=format&fit=crop'
    ],
    contactNumber: '+91 98765 43213',
    mapPlaceholder: 'Map view of Alkapuri location',
    sports: ['Cricket', 'Football', 'Pickleball'],
    facilities: DUMMY_FACILITIES,
    courts: [
      { id: 'crt_9', name: 'Box Cricket Turf', sport: 'Cricket', pricePerHour: 1500 },
      { id: 'crt_10', name: 'Football Turf', sport: 'Football', pricePerHour: 2000 },
      { id: 'crt_10_1', name: 'Pickleball Arena', sport: 'Pickleball', pricePerHour: 600 }
    ]
  },
  {
    id: 'club_sur_vesu',
    name: 'Infinity Sports Club Vesu',
    cityId: 'city_sur',
    address: 'VIP Road, Vesu, Surat, Gujarat 395007',
    distance: '4.5 km',
    openHours: '05:00 AM - 12:00 AM',
    rating: 4.8,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbb1925536?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1574629810360-7efbb1925536?q=80&w=800&auto=format&fit=crop'
    ],
    contactNumber: '+91 98765 43214',
    mapPlaceholder: 'Map view of Vesu location',
    sports: ['Cricket (Turf)', 'Pickleball', 'Badminton'],
    facilities: DUMMY_FACILITIES,
    courts: [
      { id: 'crt_11', name: 'Box Cricket Turf', sport: 'Cricket', pricePerHour: 1500 },
      { id: 'crt_12', name: 'Pickleball Arena', sport: 'Pickleball', pricePerHour: 600 }
    ]
  }
];

export const DUMMY_BOOKINGS = [
  {
    id: 'bkg_1',
    clubId: 'club_ahd_sg',
    sport: 'Badminton',
    courtId: 'crt_1',
    date: '2026-08-05',
    timeSlot: '06:00 PM - 07:00 PM',
    players: 4,
    status: 'Confirmed',
    userId: 'user_1',
    price: 500,
    adharCard: '1234 5678 9012',
    panCard: 'ABCDE1234F',
    isVerifiedByAdmin: true
  },
  {
    id: 'bkg_2',
    clubId: 'club_ahd_sg',
    sport: 'Cricket',
    courtId: 'crt_3',
    date: '2026-08-06',
    timeSlot: '07:00 AM - 08:00 AM',
    players: 12,
    status: 'Confirmed',
    userId: 'user_1',
    price: 1200,
    adharCard: '9876 5432 1098',
    panCard: 'ZYXWV9876U',
    isVerifiedByAdmin: false
  },
  {
    id: 'bkg_3',
    clubId: 'club_sur_vesu',
    sport: 'Cricket',
    courtId: 'crt_11',
    date: '2026-08-07',
    timeSlot: '08:00 PM - 10:00 PM',
    players: 12,
    status: 'Pending',
    userId: 'user_2',
    price: 3000,
    adharCard: '4567 8901 2345',
    panCard: 'PQRST5678G',
    isVerifiedByAdmin: false
  }
];
