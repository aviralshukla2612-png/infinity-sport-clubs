import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Clock, History, User, Wallet, Gift,
  Bell, Settings, HelpCircle, ChevronRight, Filter, ArrowRight,
  MapPin, Trophy, CheckCircle2, Phone, Mail, Edit3, CreditCard, ArrowUpRight, ArrowDownRight,
  Star, Share2, Copy, Search, MessageSquare, ChevronDown, Menu
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useGlobalBooking } from '../context/GlobalBookingContext';
import logo from '../assets/images/logo.jpg';
import ground1Img from '../assets/images/ground1.jpg';
import ground2Img from '../assets/images/ground2.jpg';
import ground3Img from '../assets/images/ground3.jpg';
import ball1Img   from '../assets/images/ball1.jpg';
import ball2Img   from '../assets/images/ball2.jpg';
import pickel1Img from '../assets/images/pickel1.jpg';
import pickel2Img from '../assets/images/pickel2.jpg';
import CustomDialog from '../components/ui/CustomDialog';
import './MyBookings.css';

// ─── Mock data removed, now using GlobalBookingContext ───

const TABS = ['All Bookings', 'Upcoming', 'Completed', 'Cancelled'];
const STATUS_MAP = {
  'All Bookings': null,
  'Upcoming':    ['upcoming', 'confirmed'],
  'Completed':   ['completed'],
  'Cancelled':   ['cancelled'],
};

const SportIcon = ({ sport }) => {
  const icons = { cricket: '🏏', volleyball: '🏐', pickleball: '🏓' };
  return <span className={`mb-sport-badge ${sport}`}>{icons[sport] || '🎯'}</span>;
};

export default function MyBookings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [activeMenu, setActiveMenu] = useState('bookings');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [viewBooking, setViewBooking] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  const [alertDialog, setAlertDialog] = useState({ isOpen: false });

  // Custom alert helper
  const showAlert = (title, message, variant = 'info') => {
    setAlertDialog({ isOpen: true, title, message, variant });
  };

  // Custom confirm helper
  const showConfirm = (title, message, variant = 'warning', onConfirm) => {
    setConfirmDialog({
      isOpen: true, title, message, variant,
      onConfirm: () => {
        setConfirmDialog({ isOpen: false });
        if (onConfirm) onConfirm();
      }
    });
  };
  
  const { bookings, cancelBooking } = useGlobalBooking();
  const BOOKINGS = bookings.filter(b => b.userId === 'user_1');

  const filtered = BOOKINGS.filter(b => {
    const allowed = STATUS_MAP[activeTab];
    return allowed === null || allowed.includes(b.status);
  });

  const stats = {
    total:     BOOKINGS.length,
    upcoming:  BOOKINGS.filter(b => ['upcoming','confirmed'].includes(b.status)).length,
    completed: BOOKINGS.filter(b => b.status === 'completed').length,
    cancelled: BOOKINGS.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="mb-page">
      {isMobileSidebarOpen && (
        <div 
          className="mb-mobile-overlay" 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 199, cursor: 'pointer'
          }}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`mb-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="mb-sidebar-logo">
          <img src={logo} alt="Logo" />
          <span>Infinity<br />Sports Club</span>
        </div>

        <nav className="mb-nav-group">
          <div className="mb-nav-item" onClick={() => { navigate('/'); setIsMobileSidebarOpen(false); }}>
            <Home size={16} /> Home
          </div>
          <div className={`mb-nav-item ${activeMenu === 'bookings' ? 'active' : ''}`} onClick={() => { setActiveMenu('bookings'); setIsMobileSidebarOpen(false); }}>
            <Calendar size={16} /> My Bookings
          </div>
          <div className={`mb-nav-item ${activeMenu === 'history' ? 'active' : ''}`} onClick={() => { setActiveMenu('history'); setIsMobileSidebarOpen(false); }}>
            <History size={16} /> Play History
          </div>
          <div className={`mb-nav-item ${activeMenu === 'profile' ? 'active' : ''}`} onClick={() => { setActiveMenu('profile'); setIsMobileSidebarOpen(false); }}>
            <User size={16} /> My Profile
          </div>

          <div className="mb-nav-divider" />

          <div className={`mb-nav-item ${activeMenu === 'notifications' ? 'active' : ''}`} onClick={() => { setActiveMenu('notifications'); setIsMobileSidebarOpen(false); }}>
            <Bell size={16} /> Notifications
          </div>

          <div className="mb-nav-divider" />

          <div className={`mb-nav-item ${activeMenu === 'help' ? 'active' : ''}`} onClick={() => { setActiveMenu('help'); setIsMobileSidebarOpen(false); }}>
            <HelpCircle size={16} /> Help Center
          </div>
          <div className={`mb-nav-item ${activeMenu === 'settings' ? 'active' : ''}`} onClick={() => { setActiveMenu('settings'); setIsMobileSidebarOpen(false); }}>
            <Settings size={16} /> Settings
          </div>
        </nav>

      </aside>

      {/* ─── Main Content ─── */}
      <main className="mb-main">
        {/* Header */}
        <div className="mb-header">
          <div className="mb-header-left" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <button className="admin-mobile-toggle" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} style={{background:'transparent', border:'none', cursor:'pointer', color:'#fff'}}>
              <Menu size={24} />
            </button>
            <div>
            {activeMenu === 'bookings' && (
              <>
                <h1>My Bookings</h1>
                <p>View and manage all your bookings</p>
              </>
            )}
            {activeMenu === 'profile' && (
              <>
                <h1>My Profile</h1>
                <p>Manage your personal details and view your stats</p>
              </>
            )}
            {activeMenu === 'history' && (
              <>
                <h1>Play History</h1>
                <p>Review your past games and achievements</p>
              </>
            )}
            {activeMenu === 'notifications' && (
              <>
                <h1>Notifications</h1>
                <p>Stay updated with your bookings and offers</p>
              </>
            )}
            {activeMenu === 'help' && (
              <>
                <h1>Help Center</h1>
                <p>Find answers to your questions or contact support</p>
              </>
            )}
            {activeMenu === 'settings' && (
              <>
                <h1>Settings</h1>
                <p>Manage your account preferences and notifications</p>
              </>
            )}
            </div>
          </div>
          <div className="mb-header-actions">
            <div className="mb-bell">
              <Bell size={20} />
              <span className="mb-bell-dot" />
            </div>
            <div className="mb-user-chip">
              <div className="mb-user-avatar">RS</div>
              Rahul Sharma
            </div>
          </div>
        </div>

        {activeMenu === 'bookings' && (
          <>
            {/* Stats row */}
            <div className="mb-stats-grid">
              <div className="mb-stat-card">
                <div className="mb-stat-icon blue"><Calendar size={22} /></div>
                <div>
                  <div className="mb-stat-value">{stats.total}</div>
                  <div className="mb-stat-label">Total Bookings</div>
                  <div className="mb-stat-sub">All time</div>
                </div>
              </div>
              <div className="mb-stat-card">
                <div className="mb-stat-icon orange"><Clock size={22} /></div>
                <div>
                  <div className="mb-stat-value">{stats.upcoming}</div>
                  <div className="mb-stat-label">Upcoming Bookings</div>
                  <div className="mb-stat-sub">This week</div>
                </div>
              </div>
              <div className="mb-stat-card">
                <div className="mb-stat-icon green"><CheckCircle2 size={22} /></div>
                <div>
                  <div className="mb-stat-value">{stats.completed}</div>
                  <div className="mb-stat-label">Completed Bookings</div>
                  <div className="mb-stat-sub">Total</div>
                </div>
              </div>
              <div className="mb-stat-card">
                <div className="mb-stat-icon purple"><Trophy size={22} /></div>
                <div>
                  <div className="mb-stat-value">{stats.cancelled}</div>
                  <div className="mb-stat-label">Cancelled Bookings</div>
                  <div className="mb-stat-sub">Total</div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-filter-bar">
              <div className="mb-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    className={`mb-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="mb-filters">
                <button className="mb-filter-btn" onClick={() => showAlert('Coming Soon', 'Filter by sport coming soon.', 'info')}>All Sports</button>
                <button className="mb-filter-btn" onClick={() => showAlert('Coming Soon', 'Date filter coming soon.', 'info')}><Filter size={14} /> Filter by Date</button>
              </div>
            </div>

            {/* Bookings List */}
            <div className="mb-bookings-list">
              {filtered.length === 0 ? (
                <div className="mb-empty">
                  <div className="mb-empty-icon">📋</div>
                  <h3>No bookings found</h3>
                  <p>You have no bookings in this category yet.</p>
                </div>
              ) : (
                filtered.map(b => (
                  <div className="mb-booking-card" key={b.id}>
                    {/* Thumbnail */}
                    <div className="mb-booking-thumb">
                      <img src={b.image} alt={b.sportLabel} />
                      <SportIcon sport={b.sport} />
                    </div>

                    {/* Info */}
                    <div className="mb-booking-info">
                      <div className="mb-booking-name">{b.name}</div>
                      <div className="mb-booking-venue">
                        <MapPin size={12} />
                        {b.venue}
                        <span className="mb-venue-dot" />
                        {b.sportLabel} ({b.ground})
                      </div>
                      <div className="mb-booking-meta">
                        <span className="mb-meta-item">
                          <Calendar size={12} /> {b.date} · {b.day}
                        </span>
                        <span className="mb-meta-item">
                          <Clock size={12} /> {b.time}
                        </span>
                        <span className="mb-meta-item">
                          <User size={12} /> {b.players}
                        </span>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="mb-booking-right">
                      <div className="mb-booking-price">₹{b.price.toLocaleString()}</div>
                      <span className={`mb-status-badge ${b.status}`}>
                        {b.status}
                      </span>
                      <button className="mb-view-btn" onClick={() => setViewBooking(b)}>
                        View Details <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mb-pagination">
              <span className="mb-pagination-info">
                Showing 1 to {filtered.length} of {filtered.length} bookings
              </span>
              <div className="mb-pagination">
                <button className="mb-page-btn active">1</button>
                <button className="mb-page-btn" onClick={() => showAlert('Info', 'Page 2', 'info')}>2</button>
                <button className="mb-page-btn" onClick={() => showAlert('Info', 'Page 3', 'info')}>3</button>
                <button className="mb-page-btn" onClick={() => showAlert('Info', 'Next page', 'info')}>›</button>
              </div>
            </div>
          </>
        )}

        {activeMenu === 'profile' && (
          <div className="mb-profile-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div style={{display: 'flex', gap: '2rem'}}>
              {/* Profile Card */}
              <div style={{flex: 1, background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
                <button className="admin-icon-btn" style={{position: 'absolute', top: '1rem', right: '1rem'}} onClick={() => showAlert('Coming Soon', 'Edit Profile clicked', 'info')}><Edit3 size={18}/></button>
                <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #ff4d00)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem'}}>
                  RS
                </div>
                <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.5rem'}}>Rahul Sharma</h2>
                <div style={{display: 'flex', gap: '1rem', color: '#888', fontSize: '0.9rem'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Phone size={14}/> +91 9876543210</span>
                  <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Mail size={14}/> rahul@email.com</span>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', width: '100%', marginTop: '2rem', textAlign: 'center'}}>
                  <div style={{background: 'rgba(255,122,0,0.1)', padding: '1rem', borderRadius: '12px'}}>
                    <div style={{fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)'}}>24</div>
                    <div style={{fontSize: '0.8rem', color: '#888'}}>Matches Played</div>
                  </div>
                  <div style={{background: 'rgba(34,197,94,0.1)', padding: '1rem', borderRadius: '12px'}}>
                    <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#22c55e'}}>₹12K</div>
                    <div style={{fontSize: '0.8rem', color: '#888'}}>Total Saved</div>
                  </div>
                  <div style={{background: 'rgba(168,85,247,0.1)', padding: '1rem', borderRadius: '12px'}}>
                    <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#a855f7'}}>Level 5</div>
                    <div style={{fontSize: '0.8rem', color: '#888'}}>Pro Member</div>
                  </div>
                </div>
              </div>

              {/* Activity Pie Chart */}
              <div style={{flex: 1, background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
                <h3 style={{marginTop: 0, marginBottom: '1rem', fontSize: '1.1rem'}}>Sport Activity</h3>
                <div style={{height: '250px'}}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {name:'Cricket', value:14, color:'#FF7A00'},
                          {name:'Volleyball', value:6, color:'#007BFF'},
                          {name:'Pickleball', value:4, color:'#22c55e'},
                        ]}
                        cx="50%" cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {[
                          {name:'Cricket', value:14, color:'#FF7A00'},
                          {name:'Volleyball', value:6, color:'#007BFF'},
                          {name:'Pickleball', value:4, color:'#22c55e'},
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{background: '#222', border: '1px solid #444', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem'}}>
                  <div style={{fontSize: '0.85rem'}}><span style={{display: 'inline-block', width: '10px', height: '10px', background: '#FF7A00', borderRadius: '50%', marginRight: '5px'}}/> Cricket (58%)</div>
                  <div style={{fontSize: '0.85rem'}}><span style={{display: 'inline-block', width: '10px', height: '10px', background: '#007BFF', borderRadius: '50%', marginRight: '5px'}}/> Volley (25%)</div>
                  <div style={{fontSize: '0.85rem'}}><span style={{display: 'inline-block', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', marginRight: '5px'}}/> Pickle (17%)</div>
                </div>
              </div>
            </div>

            {/* Monthly Activity Bar Chart */}
            <div style={{background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
              <h3 style={{marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem'}}>Play Frequency (Last 6 Months)</h3>
              <div style={{height: '250px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    {name: 'Mar', games: 2},
                    {name: 'Apr', games: 4},
                    {name: 'May', games: 3},
                    {name: 'Jun', games: 6},
                    {name: 'Jul', games: 5},
                    {name: 'Aug', games: 4},
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" tickLine={false} axisLine={false} allowDecimals={false} />
                    <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{background: '#222', border: '1px solid #444', borderRadius: '8px'}} itemStyle={{color: 'var(--primary-color)'}} />
                    <Bar dataKey="games" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Transactions */}
            <div style={{background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
                <h3 style={{margin: 0, fontSize: '1.1rem'}}>Recent Transactions</h3>
                <span style={{color: 'var(--primary-color)', fontSize: '0.9rem', cursor: 'pointer'}}>View All</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {[
                  { id: 'TXN001', type: 'debit', title: 'Booking #BK001', date: '02 Aug 2026, 11:09 AM', amount: 1999 },
                  { id: 'TXN002', type: 'credit', title: 'Refund for Booking #BK1005', date: '01 Aug 2026, 09:30 AM', amount: 2000 },
                  { id: 'TXN003', type: 'debit', title: 'Booking #BK002', date: '25 Jul 2026, 10:20 AM', amount: 1599 },
                ].map(txn => (
                  <div key={txn.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #222'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <div style={{width: '40px', height: '40px', borderRadius: '50%', background: txn.type === 'credit' ? 'rgba(34,197,94,0.1)' : 'rgba(255,122,0,0.1)', color: txn.type === 'credit' ? '#22c55e' : '#FF7A00', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        {txn.type === 'credit' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <div style={{fontWeight: 600, marginBottom: '0.2rem'}}>{txn.title}</div>
                        <div style={{color: '#888', fontSize: '0.8rem'}}>{txn.date} · {txn.id}</div>
                      </div>
                    </div>
                    <div style={{fontWeight: 700, fontSize: '1.1rem', color: txn.type === 'credit' ? '#22c55e' : '#fff'}}>
                      {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'history' && (
          <div className="mb-profile-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {[
              { id: 'PH001', sport: 'Cricket', date: '25 Jul 2026', duration: '2 Hours', ground: 'Box Cricket · Turf 1', result: 'Won by 15 runs', mvp: 'Rahul Sharma', rating: 5, score: '124/5 vs 109/8' },
              { id: 'PH002', sport: 'Volleyball', date: '20 Jul 2026', duration: '2 Hours', ground: 'Indoor Court 2', result: 'Lost 2-1 (Sets)', mvp: 'Amit Verma', rating: 4, score: '25-21, 18-25, 12-15' },
              { id: 'PH003', sport: 'Pickleball', date: '12 Jul 2026', duration: '1 Hour', ground: 'Outdoor Court 1', result: 'Won 11-8', mvp: 'Rahul Sharma', rating: 5, score: '11-8' },
            ].map(game => (
              <div key={game.id} style={{background: '#111', borderRadius: '16px', padding: '1.5rem', border: '1px solid #222', display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
                    <div style={{fontWeight: 600, fontSize: '1.1rem'}}>{game.sport} Match</div>
                    <span style={{background: game.result.includes('Won') ? 'rgba(34,197,94,0.1)' : 'rgba(255,122,0,0.1)', color: game.result.includes('Won') ? '#22c55e' : '#FF7A00', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600}}>{game.result}</span>
                  </div>
                  <div style={{color: '#888', fontSize: '0.9rem', marginBottom: '1rem'}}><MapPin size={12}/> {game.ground} · <Calendar size={12}/> {game.date}</div>
                  
                  <div style={{display: 'flex', gap: '2rem'}}>
                    <div>
                      <div style={{fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Final Score</div>
                      <div style={{fontWeight: 600}}>{game.score}</div>
                    </div>
                    <div>
                      <div style={{fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Match MVP</div>
                      <div style={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Trophy size={14} color="#FFD700"/> {game.mvp}</div>
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', gap: '0.2rem', color: '#FFD700'}}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < game.rating ? '#FFD700' : 'none'} opacity={i < game.rating ? 1 : 0.3} />)}
                  </div>
                  <button className="admin-action-btn secondary" style={{fontSize: '0.8rem'}}>View Highlights</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'notifications' && (
          <div className="mb-profile-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {[
              { title: 'Booking Confirmed!', desc: 'Your Box Cricket booking for 04 Aug 2026 is confirmed.', time: '2 hours ago', icon: <CheckCircle2 size={20}/>, color: '#22c55e' },
              { title: 'Wallet Credited', desc: '₹100 has been added to your wallet for a successful referral.', time: '1 day ago', icon: <Wallet size={20}/>, color: '#FF7A00' },
              { title: 'Upcoming Match Reminder', desc: 'You have a Volleyball match tomorrow at 6:00 PM.', time: '1 day ago', icon: <Clock size={20}/>, color: '#3b82f6' },
              { title: 'Weekend Offer! 🎟️', desc: 'Get 20% off on all Pickleball courts this weekend. Use code WEEKEND20.', time: '3 days ago', icon: <Gift size={20}/>, color: '#a855f7' },
            ].map((notif, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', background: '#111', borderRadius: '12px', border: '1px solid #222'}}>
                <div style={{width: '40px', height: '40px', borderRadius: '50%', background: `${notif.color}15`, color: notif.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  {notif.icon}
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem'}}>
                    <div style={{fontWeight: 600}}>{notif.title}</div>
                    <div style={{color: '#666', fontSize: '0.8rem'}}>{notif.time}</div>
                  </div>
                  <div style={{color: '#aaa', fontSize: '0.9rem', lineHeight: 1.5}}>{notif.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeMenu === 'help' && (
          <div className="mb-profile-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
            <div style={{display: 'flex', gap: '1rem'}}>
              <div style={{flex: 1, background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222', textAlign: 'center'}}>
                <MessageSquare size={32} color="var(--primary-color)" style={{marginBottom: '1rem'}} />
                <h3 style={{margin: '0 0 0.5rem 0'}}>Chat with us</h3>
                <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Our team is available 24/7</p>
                <button className="admin-action-btn primary" style={{width: '100%'}}>Start Chat</button>
              </div>
              <div style={{flex: 1, background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222', textAlign: 'center'}}>
                <Phone size={32} color="#22c55e" style={{marginBottom: '1rem'}} />
                <h3 style={{margin: '0 0 0.5rem 0'}}>Call Support</h3>
                <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem'}}>Mon-Fri from 8am to 8pm</p>
                <button className="admin-action-btn secondary" style={{width: '100%'}}>+91 1800-123-4567</button>
              </div>
              <div style={{flex: 1, background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222', textAlign: 'center'}}>
                <Mail size={32} color="#3b82f6" style={{marginBottom: '1rem'}} />
                <h3 style={{margin: '0 0 0.5rem 0'}}>Email us</h3>
                <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem'}}>We'll reply within 2 hours</p>
                <button className="admin-action-btn secondary" style={{width: '100%'}}>support@infinity.com</button>
              </div>
            </div>

            <div style={{background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
              <h3 style={{margin: '0 0 1.5rem 0'}}>Frequently Asked Questions</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                {[
                  { q: 'How do I cancel my booking?', a: 'You can cancel your booking from the "My Bookings" tab. Refunds will be processed according to our cancellation policy.' },
                  { q: 'What is the refund policy?', a: 'Cancellations made 24 hours prior to the booking time are eligible for a 100% refund to your wallet.' },
                  { q: 'Can I reschedule my match?', a: 'Yes, you can reschedule up to 12 hours before your slot, subject to availability.' },
                  { q: 'Are sports equipment provided?', a: 'Basic equipment is available on rent at the venue. Please arrive 15 mins early to collect them.' },
                ].map((faq, i) => (
                  <div key={i} style={{background: '#1a1a1a', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden'}}>
                    <div style={{padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600}}>
                      {faq.q} <ChevronDown size={18} color="#666"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'settings' && (
          <div className="mb-profile-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <div style={{background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
              <h3 style={{margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Bell size={18} color="var(--primary-color)"/> Notification Preferences</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 600}}>Email Notifications</div>
                    <div style={{color: '#888', fontSize: '0.85rem'}}>Receive booking confirmations via email</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{accentColor: 'var(--primary-color)', width: '18px', height: '18px'}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 600}}>SMS Alerts</div>
                    <div style={{color: '#888', fontSize: '0.85rem'}}>Get text messages for upcoming matches</div>
                  </div>
                  <input type="checkbox" defaultChecked style={{accentColor: 'var(--primary-color)', width: '18px', height: '18px'}} />
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 600}}>Promotional Offers</div>
                    <div style={{color: '#888', fontSize: '0.85rem'}}>Get notified about weekend discounts and events</div>
                  </div>
                  <input type="checkbox" style={{accentColor: 'var(--primary-color)', width: '18px', height: '18px'}} />
                </div>
              </div>
            </div>

            <div style={{background: '#111', borderRadius: '16px', padding: '2rem', border: '1px solid #222'}}>
              <h3 style={{margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Settings size={18} color="var(--primary-color)"/> Account Security</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.25rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 600}}>Change Password</div>
                    <div style={{color: '#888', fontSize: '0.85rem'}}>Update your login password</div>
                  </div>
                  <button className="admin-action-btn secondary" style={{fontSize: '0.85rem'}} onClick={() => setShowPasswordModal(true)}>Update</button>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontWeight: 600}}>Two-Factor Authentication</div>
                    <div style={{color: '#888', fontSize: '0.85rem'}}>Add an extra layer of security</div>
                  </div>
                  <button className="admin-action-btn secondary" style={{fontSize: '0.85rem'}} onClick={() => setShow2FAModal(true)}>Enable</button>
                </div>
              </div>
            </div>
            
            <div className="mb-card" style={{marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end'}}>
              <button className="admin-action-btn primary" onClick={() => showAlert('Success', 'Settings Saved!', 'success')}>Save Changes</button>
            </div>
          </div>
        )}

      </main>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="admin-modal-overlay animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div className="admin-modal-content" style={{background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #333', width: '400px', maxWidth: '90%'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.25rem'}}>Change Password</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#888'}}>Current Password</label>
                <input type="password" placeholder="Enter current password" style={{width: '100%', padding: '0.8rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#888'}}>New Password</label>
                <input type="password" placeholder="Enter new password" style={{width: '100%', padding: '0.8rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
              </div>
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#888'}}>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" style={{width: '100%', padding: '0.8rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff'}} />
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button className="admin-action-btn secondary" style={{flex: 1}} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="admin-action-btn primary" style={{flex: 1}} onClick={() => {
                showAlert('Success', 'Password updated successfully!', 'success');
                setShowPasswordModal(false);
              }}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="admin-modal-overlay animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div className="admin-modal-content" style={{background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #333', width: '400px', maxWidth: '90%', textAlign: 'center'}}>
            <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,122,0,0.1)', color: '#FF7A00', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto'}}>
              <CheckCircle2 size={30} />
            </div>
            <h3 style={{margin: '0 0 1rem 0', fontSize: '1.25rem'}}>Enable 2FA</h3>
            <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5'}}>Scan the QR code with your authenticator app (like Google Authenticator) and enter the 6-digit code below.</p>
            
            <div style={{width: '150px', height: '150px', background: '#fff', margin: '0 auto 2rem auto', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=infinity-sports-2fa" alt="QR Code" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem'}}>
              {[...Array(6)].map((_, i) => (
                <input key={i} type="text" maxLength="1" style={{width: '40px', height: '45px', textAlign: 'center', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold'}} />
              ))}
            </div>

            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="admin-action-btn secondary" style={{flex: 1}} onClick={() => setShow2FAModal(false)}>Cancel</button>
              <button className="admin-action-btn primary" style={{flex: 1}} onClick={() => {
                showAlert('Success', 'Two-Factor Authentication enabled successfully!', 'success');
                setShow2FAModal(false);
              }}>Verify & Enable</button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="admin-modal-overlay animate-fade-in" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div className="admin-modal-content" style={{background: '#111', padding: '0', borderRadius: '16px', border: '1px solid #333', width: '500px', maxWidth: '90%', overflow: 'hidden'}}>
            <div style={{height: '140px', background: `url(${viewBooking.image}) center/cover`, position: 'relative'}}>
              <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, #111, transparent)'}}></div>
              <button style={{position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}} onClick={() => setViewBooking(null)}>✕</button>
              <div style={{position: 'absolute', bottom: '15px', left: '25px'}}>
                <h2 style={{margin: 0, color: '#fff', fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{viewBooking.name}</h2>
                <div style={{color: '#ddd', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '4px'}}>
                  <MapPin size={12}/> {viewBooking.venue} - {viewBooking.ground}
                </div>
              </div>
            </div>
            
            <div style={{padding: '25px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #222'}}>
                <div>
                  <div style={{fontSize: '0.75rem', color: '#888', marginBottom: '4px'}}>Booking Status</div>
                  <span className={`mb-status-badge ${viewBooking.status}`}>{viewBooking.status}</span>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '0.75rem', color: '#888', marginBottom: '4px'}}>Amount Paid</div>
                  <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#fff'}}>₹{viewBooking.price.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="mb-booking-grid">
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '12px', borderRadius: '10px'}}>
                  <Calendar size={18} color="var(--primary-color)"/>
                  <div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Date</div>
                    <div style={{fontSize: '0.9rem', color: '#ccc'}}>{viewBooking.date}</div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '12px', borderRadius: '10px'}}>
                  <Clock size={18} color="var(--primary-color)"/>
                  <div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Time Slot</div>
                    <div style={{fontSize: '0.9rem', color: '#ccc'}}>{viewBooking.time}</div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '12px', borderRadius: '10px'}}>
                  <User size={18} color="var(--primary-color)"/>
                  <div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Players</div>
                    <div style={{fontSize: '0.9rem', color: '#ccc'}}>{viewBooking.players}</div>
                  </div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', background: '#1a1a1a', padding: '12px', borderRadius: '10px'}}>
                  <CheckCircle2 size={18} color="var(--primary-color)"/>
                  <div>
                    <div style={{fontSize: '0.75rem', color: '#888'}}>Booking ID</div>
                    <div style={{fontSize: '0.9rem', color: '#ccc'}}>{viewBooking.id}</div>
                  </div>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '0.8rem', marginTop: '1.5rem'}}>
                <button className="admin-action-btn secondary" style={{flex: 1}} onClick={() => showAlert('Coming Soon', 'Download receipt feature coming soon!', 'info')}>Download Receipt</button>
                {viewBooking.status === 'confirmed' || viewBooking.status === 'upcoming' ? (
                  <button className="admin-action-btn primary" style={{background: '#ef4444', flex: 1}} onClick={() => {
                    showConfirm('Cancel Booking', 'Are you sure you want to cancel this booking?', 'danger', () => {
                      cancelBooking(viewBooking.id);
                      setViewBooking(null);
                    });
                  }}>Cancel Booking</button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Dialogs */}
      <CustomDialog 
        {...alertDialog} 
        onConfirm={() => setAlertDialog({ isOpen: false })} 
        onCancel={() => setAlertDialog({ isOpen: false })}
      />
      <CustomDialog 
        {...confirmDialog} 
        type="confirm" 
        onCancel={() => setConfirmDialog({ isOpen: false })} 
      />
    </div>
  );
}
