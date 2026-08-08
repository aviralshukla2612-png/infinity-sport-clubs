import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, ChevronDown, ChevronRight, ChevronLeft,
  ClipboardList, User, LogOut, Search, RefreshCw, Eye,
  X, Download, MapPin, Share2, XCircle, CheckCircle2,
  Clock, ArrowLeft, Printer, Menu, Pencil, Trash2
} from 'lucide-react';
import { useGlobalBooking } from '../context/GlobalBookingContext';
import logo from '../assets/images/logo.jpg';
import ground1Img from '../assets/images/ground1.jpg';
import ground2Img from '../assets/images/ground2.jpg';
import ball1Img   from '../assets/images/ball1.jpg';
import pickel1Img from '../assets/images/pickel1.jpg';
import CustomDialog from '../components/ui/CustomDialog';
import './SubAdminDashboard.css';

const SPORT_IMAGES = { cricket: ground1Img, volleyball: ball1Img, pickleball: pickel1Img };
const STATUS_COLORS = { confirmed:'confirmed', pending:'pending', cancelled:'cancelled', completed:'completed' };
const SPORT_ICONS   = { cricket:'🏏', volleyball:'🏐', pickleball:'🏓' };
const today = new Date();
const fmtDate = (d) => d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

// ─── Mini QR Code SVG ──────────────────────────────────────
const QRCodeSVG = () => (
  <svg width="88" height="88" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{borderRadius:'8px',border:'1px solid #2a2a2a',display:'block'}}>
    <rect width="90" height="90" fill="#161616"/>
    <rect x="8"  y="8"  width="24" height="24" rx="2" fill="#FF7A00" opacity="0.85"/>
    <rect x="12" y="12" width="16" height="16" rx="1" fill="#161616"/>
    <rect x="15" y="15" width="10" height="10" rx="1" fill="#FF7A00"/>
    <rect x="58" y="8"  width="24" height="24" rx="2" fill="#FF7A00" opacity="0.85"/>
    <rect x="62" y="12" width="16" height="16" rx="1" fill="#161616"/>
    <rect x="65" y="15" width="10" height="10" rx="1" fill="#FF7A00"/>
    <rect x="8"  y="58" width="24" height="24" rx="2" fill="#FF7A00" opacity="0.85"/>
    <rect x="12" y="62" width="16" height="16" rx="1" fill="#161616"/>
    <rect x="15" y="65" width="10" height="10" rx="1" fill="#FF7A00"/>
    <rect x="38" y="8"  width="6" height="6" rx="1" fill="#666"/>
    <rect x="46" y="8"  width="6" height="6" rx="1" fill="#666"/>
    <rect x="38" y="16" width="6" height="6" rx="1" fill="#666"/>
    <rect x="38" y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="46" y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="54" y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="38" y="46" width="6" height="6" rx="1" fill="#666"/>
    <rect x="54" y="46" width="6" height="6" rx="1" fill="#666"/>
    <rect x="46" y="54" width="6" height="6" rx="1" fill="#666"/>
    <rect x="62" y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="70" y="46" width="6" height="6" rx="1" fill="#666"/>
    <rect x="62" y="54" width="6" height="6" rx="1" fill="#666"/>
    <rect x="8"  y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="16" y="38" width="6" height="6" rx="1" fill="#666"/>
    <rect x="24" y="46" width="6" height="6" rx="1" fill="#666"/>
    <rect x="16" y="54" width="6" height="6" rx="1" fill="#666"/>
  </svg>
);

// ─── Booking Detail Modal ──────────────────────────────────
const BookingModal = ({ booking, onClose, onCancel }) => {
  const [activeTab, setActiveTab] = useState('booking');
  const TABS = [
    { id:'booking', label:'Booking Details' },
    { id:'player',  label:'Player Details' },
    { id:'payment', label:'Payment Details' },
  ];
  const gst      = Math.round(booking.amount * 0.18);
  const discount = 100;
  const total    = booking.amount + gst - discount;
  const timeline = [
    { label:'Booking Created',    done: true },
    { label:'Payment Successful', done: booking.status !== 'cancelled' },
    { label:'Slot Reserved',      done: booking.status !== 'cancelled' },
    { label:'Booking Confirmed',  done: booking.status === 'confirmed' || booking.status === 'completed' },
  ];

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:500,
      background:'rgba(0,0,0,0.8)', backdropFilter:'blur(6px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sa-booking-modal" style={{
        background:'#111', borderRadius:'16px', border:'1px solid #222',
        width:'100%', maxWidth:'680px', maxHeight:'90vh',
        overflow:'hidden', display:'flex', flexDirection:'column',
        boxShadow:'0 32px 80px rgba(0,0,0,0.8)'
      }}>

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.25rem',borderBottom:'1px solid #1e1e1e'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <button onClick={onClose} style={{
              background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'8px',
              color:'#aaa',cursor:'pointer',padding:'0.35rem 0.65rem',
              display:'flex',alignItems:'center',gap:'0.3rem',fontSize:'0.78rem'
            }}>
              <ArrowLeft size={13}/> Back
            </button>
            <div>
              <div style={{fontSize:'0.95rem',fontWeight:700}}>Booking {booking.id}</div>
              <div style={{fontSize:'0.7rem',color:'#555'}}>Booked on {booking.bookedAt}</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <span className={`sa-badge ${STATUS_COLORS[booking.status]}`} style={{fontSize:'0.75rem',padding:'0.3rem 0.85rem'}}>
              {booking.status.charAt(0).toUpperCase()+booking.status.slice(1)}
            </span>
            <button onClick={onClose} style={{background:'transparent',border:'none',color:'#444',cursor:'pointer',display:'flex',alignItems:'center'}}>
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Ground Hero */}
        <div className="sa-booking-hero" style={{display:'flex',gap:'1rem',padding:'1rem 1.25rem',borderBottom:'1px solid #1e1e1e',background:'#0d0d0d',alignItems:'center'}}>
          <img src={SPORT_IMAGES[booking.sport]} alt={booking.sportLabel}
            style={{width:'115px',height:'82px',objectFit:'cover',borderRadius:'10px',flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'1rem',fontWeight:700,marginBottom:'0.2rem'}}>{booking.sportLabel}</div>
            <div style={{fontSize:'0.8rem',color:'#888',marginBottom:'0.45rem'}}>{booking.ground} • {booking.court}</div>
            <div style={{display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.73rem',color:'#555'}}>
              <MapPin size={11}/> Infinity Sports Club, Rajkot, Gujarat
            </div>
          </div>
          <div style={{textAlign:'center',flexShrink:0}}>
            <QRCodeSVG/>
            <div style={{fontSize:'0.62rem',color:'#444',marginTop:'0.3rem'}}>Scan to verify</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sa-modal-tabs" style={{display:'flex',gap:'2px',padding:'0.6rem 1.25rem 0',borderBottom:'1px solid #1e1e1e',background:'#111', flexWrap: 'wrap'}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:'0.4rem 1rem',border:'none',cursor:'pointer',fontSize:'0.82rem',fontWeight:500,
              transition:'all 0.2s',background:'transparent',borderBottom:'2px solid',
              borderColor: activeTab===t.id ? '#FF7A00' : 'transparent',
              color: activeTab===t.id ? '#FF7A00' : '#666',
              marginBottom:'-1px'
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{flex:1,overflowY:'auto',padding:'1.25rem'}}>

          {/* ── BOOKING DETAILS ── */}
          {activeTab==='booking' && (
            <div>
              {/* Detail grid */}
              <div className="sa-booking-grid">
                {[
                  {icon:<Calendar size={13}/>, label:'Date',     val:booking.date},
                  {icon:<Clock size={13}/>,    label:'Time',     val:booking.timeSlot},
                  {icon:<MapPin size={13}/>,   label:'Ground',   val:`${booking.ground} · ${booking.court}`},
                  {icon:<Clock size={13}/>,    label:'Duration', val:'2 Hours'},
                  {icon:<User size={13}/>,     label:'Players',  val:'10 Players'},
                  {icon:<ClipboardList size={13}/>,label:'Sport',val:booking.sportLabel},
                ].map((item,i) => (
                  <div key={i} style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'10px',padding:'0.8rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.35rem',fontSize:'0.68rem',color:'#555',marginBottom:'0.3rem'}}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{fontSize:'0.85rem',fontWeight:600,color:'#ddd'}}>{item.val}</div>
                  </div>
                ))}
              </div>

              {/* Booking Timeline */}
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem',marginBottom:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Booking Timeline</div>
                {timeline.map((step,i) => (
                  <div key={i} style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:i<timeline.length-1?'0.65rem':0}}>
                    <div style={{
                      width:'22px',height:'22px',borderRadius:'50%',flexShrink:0,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      background: step.done ? 'rgba(76,175,80,0.15)' : '#1a1a1a',
                      border:`1px solid ${step.done ? '#4caf50' : '#2a2a2a'}`
                    }}>
                      <CheckCircle2 size={12} color={step.done ? '#4caf50' : '#333'}/>
                    </div>
                    <span style={{fontSize:'0.82rem',color:step.done?'#ddd':'#3a3a3a',fontWeight:step.done?500:400,flex:1}}>{step.label}</span>
                    {step.done && <span style={{fontSize:'0.65rem',color:'#4caf50'}}>✓ Done</span>}
                  </div>
                ))}
              </div>

              {/* Ground Rules */}
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.75rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Ground Rules</div>
                {['Sports shoes are required','Arrive 15 minutes early','No outside food allowed','No smoking on premises','Respect all other players'].map((rule,i) => (
                  <div key={i} style={{display:'flex',gap:'0.5rem',fontSize:'0.8rem',color:'#888',marginBottom:'0.4rem'}}>
                    <span style={{color:'#FF7A00',fontWeight:700,flexShrink:0}}>•</span>{rule}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PLAYER DETAILS ── */}
          {activeTab==='player' && (
            <div>
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem',marginBottom:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Primary Contact</div>
                {[
                  {label:'Full Name',  val:booking.customer},
                  {label:'Phone',      val:booking.phone},
                  {label:'Email',      val:booking.customer.toLowerCase().replace(' ','.')+`@example.com`},
                  {label:'Aadhar No.', val:'•••• •••• 2604'},
                ].map((f,i,arr) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.55rem 0',borderBottom:i<arr.length-1?'1px solid #1a1a1a':'none'}}>
                    <span style={{fontSize:'0.77rem',color:'#555'}}>{f.label}</span>
                    <span style={{fontSize:'0.82rem',color:'#ccc',fontWeight:500}}>{f.val}</span>
                  </div>
                ))}
              </div>
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Players (10)</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:'0.6rem'}}>
                  {['SJ','VP','HS','KJ','MP','EH','AS','RN','DK','PL'].map((init,i) => (
                    <div key={i} title={`Player ${i+1}`} style={{
                      width:'42px',height:'42px',borderRadius:'50%',
                      background:`hsl(${i*36},55%,32%)`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontSize:'0.7rem',fontWeight:700,color:'#fff',
                      border:'2px solid #1e1e1e',cursor:'default'
                    }}>{init}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENT DETAILS ── */}
          {activeTab==='payment' && (
            <div>
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem',marginBottom:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Payment Summary</div>
                {[
                  {label:'Booking Fee', val:`₹${booking.amount.toLocaleString()}`,  color:'#ccc'},
                  {label:'GST (18%)',   val:`₹${gst}`,                               color:'#ccc'},
                  {label:'Discount',    val:`- ₹${discount}`,                        color:'#4caf50'},
                ].map((row,i) => (
                  <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'0.55rem 0',borderBottom:'1px solid #1a1a1a'}}>
                    <span style={{fontSize:'0.8rem',color:'#888'}}>{row.label}</span>
                    <span style={{fontSize:'0.82rem',color:row.color,fontWeight:500}}>{row.val}</span>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',padding:'0.8rem 0 0',borderTop:'1px solid #2a2a2a',marginTop:'0.25rem'}}>
                  <span style={{fontSize:'0.92rem',fontWeight:700,color:'#fff'}}>Total Paid</span>
                  <span style={{fontSize:'1.05rem',fontWeight:700,color:'#FF7A00'}}>₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{background:'#0d0d0d',border:'1px solid #1e1e1e',borderRadius:'12px',padding:'1rem'}}>
                <div style={{fontSize:'0.78rem',fontWeight:600,color:'#aaa',marginBottom:'0.85rem',textTransform:'uppercase',letterSpacing:'0.4px'}}>Payment Method</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',padding:'0.7rem',background:'#111',borderRadius:'8px',border:'1px solid #1e1e1e'}}>
                  <div style={{width:'38px',height:'38px',borderRadius:'8px',background:'rgba(255,122,0,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',fontWeight:700,color:'#FF7A00'}}>G</div>
                  <div>
                    <div style={{fontSize:'0.82rem',fontWeight:600,color:'#ccc'}}>GPay</div>
                    <div style={{fontSize:'0.7rem',color:'#555'}}>Txn ID: TXN{booking.id.replace('#','')}</div>
                  </div>
                  <span className="sa-badge confirmed" style={{marginLeft:'auto'}}>Paid</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{padding:'0.9rem 1.25rem',borderTop:'1px solid #1e1e1e',background:'#0d0d0d'}}>
          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
            {[
              {icon:<Download size={13}/>, label:'Download Ticket', hColor:'#FF7A00'},
              {icon:<Printer size={13}/>,  label:'Invoice',          hColor:'#FF7A00'},
              {icon:<MapPin size={13}/>,   label:'Directions',       hColor:'#FF7A00'},
              {icon:<Share2 size={13}/>,   label:'Share Booking',    hColor:'#007BFF'},
            ].map((btn,i) => (
              <button key={i}
                onClick={() => showAlert('Action', `${btn.label} action triggered.`, 'info')}
                style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.45rem 0.85rem',borderRadius:'8px',background:'#111',border:'1px solid #222',color:'#888',fontSize:'0.77rem',fontWeight:500,cursor:'pointer',transition:'all 0.2s'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=btn.hColor;e.currentTarget.style.color=btn.hColor;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#222';e.currentTarget.style.color='#888';}}>
                {btn.icon} {btn.label}
              </button>
            ))}
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <button
                onClick={() => {
                  showConfirm('Cancel Booking', 'Are you sure you want to cancel this booking?', 'danger', () => {
                    onCancel(booking.id);
                    onClose();
                  });
                }}
                style={{display:'flex',alignItems:'center',gap:'0.4rem',padding:'0.45rem 0.85rem',borderRadius:'8px',background:'rgba(239,68,68,0.07)',border:'1px solid rgba(239,68,68,0.2)',color:'#ef4444',fontSize:'0.77rem',fontWeight:500,cursor:'pointer',transition:'background 0.2s',marginLeft:'auto'}}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.07)'}>
                <XCircle size={13}/> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main SubAdmin Dashboard ───────────────────────────────
export default function SubAdminDashboard() {
  const navigate = useNavigate();
  const { bookings: BOOKINGS_DATA, cancelBooking, deleteBooking, updateBookingStatus, processRefund } = useGlobalBooking();
  const [activeNav, setActiveNav]     = useState('bookings');
  const [search, setSearch]           = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [filterCourt, setFilterCourt] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewBooking, setViewBooking] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const rowsPerPage = 10;
  
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

  const stats = useMemo(() => ({
    total:     BOOKINGS_DATA.length,
    today:     BOOKINGS_DATA.filter(b => b.date.startsWith('03 Aug 2026')).length,
    upcoming:  BOOKINGS_DATA.filter(b => ['confirmed','pending'].includes(b.status)).length,
    completed: BOOKINGS_DATA.filter(b => b.status === 'completed').length,
  }), [BOOKINGS_DATA]);

  const filtered = useMemo(() => BOOKINGS_DATA.filter(b => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      b.id.toLowerCase().includes(q) ||
      b.customer.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.sportLabel.toLowerCase().includes(q);
    const matchSport  = !filterSport  || b.sport === filterSport;
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchSport && matchStatus;
  }), [search, filterSport, filterStatus, BOOKINGS_DATA]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows   = filtered.slice((currentPage-1)*rowsPerPage, currentPage*rowsPerPage);
  const resetFilters = () => { setSearch(''); setFilterSport(''); setFilterCourt(''); setFilterStatus(''); setCurrentPage(1); };

  return (
    <div className="sa-page">
      {viewBooking && <BookingModal booking={viewBooking} onClose={() => setViewBooking(null)} onCancel={cancelBooking} />}

      {isMobileSidebarOpen && (
        <div 
          className="sa-mobile-overlay" 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 199, cursor: 'pointer'
          }}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`sa-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sa-sidebar-brand">
          <img src={logo} alt="Logo" />
          <span className="sa-sidebar-brand-text">Infinity<br/>Sports Club</span>
        </div>
        <nav className="sa-nav">
          <div className={`sa-nav-item ${activeNav==='bookings'?'active':''}`} onClick={() => { setActiveNav('bookings'); setIsMobileSidebarOpen(false); }}>
            <ClipboardList size={15}/> Bookings
          </div>
          <div className={`sa-nav-item ${activeNav==='profile'?'active':''}`} onClick={() => { setActiveNav('profile'); setIsMobileSidebarOpen(false); }}>
            <User size={15}/> My Profile
          </div>
        </nav>
        <div className="sa-logout">
          <div className="sa-logout-btn" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={15}/> Logout
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div className="sa-main">
        {/* Topbar */}
        <div className="sa-topbar">
          <div className="sa-topbar-left" style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <button className="admin-mobile-toggle" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} style={{background:'transparent', border:'none', cursor:'pointer', color:'#fff'}}>
              <Menu size={20} />
            </button>
            <button onClick={() => navigate('/')} style={{display:'flex', alignItems:'center', gap:'0.4rem', padding: '0.4rem 0.6rem', background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', color: '#888', cursor: 'pointer', fontSize: '0.8rem'}}>
              <ArrowLeft size={16} /> Back
            </button>
            <div className="sa-topbar-title">
              <h2>Sub Admin</h2>
              <p>Welcome Rahul</p>
            </div>
          </div>
          <div className="sa-topbar-right">
            <div className="sa-date-chip">
              <Calendar size={13}/> {fmtDate(today)} <ChevronDown size={13}/>
            </div>
            <div className="sa-user-chip">
              <div className="sa-avatar">SA</div>
              Sub Admin <ChevronDown size={12}/>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="sa-content">
          {activeNav === 'bookings' && (
            <>
              <div className="sa-section-header">
                <h1>Booking Details</h1>
                <p>View all booking data is here.</p>
              </div>

          {/* Stats */}
          <div className="sa-stats-grid">
            {[
              {cls:'green',  Icon:Calendar,     val:stats.total,     label:"Total Bookings",    sub:"All Time"},
              {cls:'blue',   Icon:ClipboardList, val:stats.today,     label:"Today's Bookings",  sub:"03 Aug 2026"},
              {cls:'orange', Icon:Clock,         val:stats.upcoming,  label:"Upcoming Bookings", sub:"Next 7 Days"},
              {cls:'purple', Icon:User,           val:stats.completed, label:"Completed Bookings",sub:"All Time"},
            ].map(({cls,Icon,val,label,sub},i) => (
              <div key={i} className="sa-stat-card">
                <div className={`sa-stat-icon ${cls}`}><Icon size={20}/></div>
                <div>
                  <div className="sa-stat-value">{val}</div>
                  <div className="sa-stat-label">{label}</div>
                  <div className="sa-stat-sub">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="sa-filters">
            <div className="sa-search">
              <Search size={14} color="#555"/>
              <input placeholder="Search by Booking ID, Customer name or Phone..." value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}/>
            </div>
            <select className="sa-filter-select" value={filterSport} onChange={e => { setFilterSport(e.target.value); setCurrentPage(1); }}>
              <option value="">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="volleyball">Volleyball</option>
              <option value="pickleball">Pickleball</option>
            </select>
            <select className="sa-filter-select" value={filterCourt} onChange={e => { setFilterCourt(e.target.value); setCurrentPage(1); }}>
              <option value="">All Courts</option>
              <option value="Court 1">Court 1</option>
              <option value="Court 2">Court 2</option>
            </select>
            <select className="sa-filter-select" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}>
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="sa-date-filter" style={{cursor: 'pointer'}} onClick={() => showAlert('Coming Soon', 'Date range picker coming soon', 'info')}><Calendar size={13}/> Select Date Range <ChevronDown size={12}/></div>
            <button className="sa-reset-btn" onClick={resetFilters}><RefreshCw size={13}/> Reset</button>
          </div>

          {/* Table */}
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Booking ID</th><th>Venue</th><th>Date & Time</th>
                  <th>Customer</th><th>Amount</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign:'center',padding:'2.5rem',color:'#444'}}>No bookings found.</td></tr>
                ) : pageRows.map(b => (
                  <tr key={b.id}>
                    <td data-label="Booking ID"><span className="sa-booking-id">{b.id}</span></td>
                    <td data-label="Venue">
                      <div className="sa-sport-cell" style={{marginBottom:'0.2rem'}}>
                        <div className={`sa-sport-dot ${b.sport}`}>{SPORT_ICONS[b.sport]}</div>
                        <span style={{fontWeight:500, color:'#ddd'}}>{b.sportLabel}</span>
                      </div>
                      <div style={{fontSize:'0.75rem',color:'#888', paddingLeft:'1.8rem'}}>{b.ground} • {b.court}</div>
                    </td>
                    <td data-label="Date & Time">
                      <div style={{color:'#ddd', fontWeight:500, marginBottom:'0.2rem'}}>{b.date}</div>
                      <div style={{fontSize:'0.75rem',color:'#888', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'180px'}} title={b.timeSlot}>{b.timeSlot}</div>
                    </td>
                    <td data-label="Customer">
                      <div className="sa-customer-name">{b.customer}</div>
                      <div className="sa-customer-phone">{b.phone}</div>
                    </td>
                    <td data-label="Amount"><span className="sa-amount">₹{b.amount.toLocaleString()}</span></td>
                    <td data-label="Status">
                      <span className={`sa-badge ${STATUS_COLORS[b.status]}`}>
                        {b.status.charAt(0).toUpperCase()+b.status.slice(1)}
                      </span>
                    </td>
                    <td data-label="Action">
                      <div style={{display:'flex',gap:'0.4rem'}}>
                        <button className="sa-action-btn view" title="View" onClick={() => setViewBooking(b)}>
                          <Eye size={14}/>
                        </button>
                        <button className="sa-action-btn edit" title="Edit" onClick={() => showAlert('Edit', 'Edit triggered for ' + b.id, 'info')}>
                          <Pencil size={14}/>
                        </button>
                        <button className="sa-action-btn danger" title="Delete" onClick={() => {
                          showConfirm('Delete Booking', 'Are you sure you want to delete this booking?', 'danger', () => {
                            deleteBooking(b.id);
                            showAlert('Deleted', 'Booking deleted', 'success');
                          });
                        }}>
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="sa-pagination">
              <span>Showing {Math.min((currentPage-1)*rowsPerPage+1,filtered.length)}–{Math.min(currentPage*rowsPerPage,filtered.length)} of {filtered.length} bookings</span>
              <div className="sa-pages">
                <button className="sa-page-btn" onClick={() => setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1}>
                  <ChevronLeft size={13}/>
                </button>
                {[...Array(totalPages)].map((_,i) => (
                  <button key={i+1} className={`sa-page-btn ${currentPage===i+1?'active':''}`} onClick={() => setCurrentPage(i+1)}>{i+1}</button>
                ))}
                <button className="sa-page-btn" onClick={() => setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages}>
                  <ChevronRight size={13}/>
                </button>
              </div>
              <div className="sa-rows-per-page">
                Rows per page:&nbsp;
                <select className="sa-rows-select"><option>10</option><option>25</option><option>50</option></select>
              </div>
            </div>
          </div>
            </>
          )}

          {activeNav === 'profile' && (
            <div className="sa-profile-section animate-fade-in">
              <div className="sa-section-header" style={{marginBottom: '2rem'}}>
                <h1>My Profile</h1>
                <p>Manage your sub-admin account details</p>
              </div>
              
              <div className="sa-settings-layout" style={{display: 'flex', gap: '2rem', flexWrap: 'wrap'}}>
                <div style={{flex: '1', minWidth: '300px', background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                  <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #007BFF, #00C6FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', boxShadow: '0 10px 25px rgba(0,123,255,0.4)'}}>
                    SA
                  </div>
                  <h2 style={{margin: '0 0 0.5rem 0', fontSize: '1.4rem', color: '#fff'}}>Rahul Patel</h2>
                  <div style={{color: '#007BFF', fontSize: '0.9rem', fontWeight: 600, padding: '0.3rem 1rem', background: 'rgba(0,123,255,0.1)', borderRadius: '20px', marginBottom: '1.5rem'}}>Sub Admin</div>
                  
                  <div style={{width: '100%', textAlign: 'left', borderTop: '1px solid #1e1e1e', paddingTop: '1.5rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                      <User size={16} color="#666" />
                      <div>
                        <div style={{fontSize: '0.75rem', color: '#666'}}>Admin ID</div>
                        <div style={{fontSize: '0.9rem', color: '#ccc'}}>#SA-8492</div>
                      </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
                      <Clock size={16} color="#666" />
                      <div>
                        <div style={{fontSize: '0.75rem', color: '#666'}}>Last Login</div>
                        <div style={{fontSize: '0.9rem', color: '#ccc'}}>03 Aug 2026, 08:45 AM</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sa-settings-right" style={{flex: '2', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div style={{background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '2rem'}}>
                    <h3 style={{margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#fff'}}><ClipboardList size={18} color="#007BFF"/> Performance Summary</h3>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
                      <div style={{background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem'}}>128</div>
                        <div style={{fontSize: '0.8rem', color: '#888'}}>Bookings Handled</div>
                      </div>
                      <div style={{background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: '#4caf50', marginBottom: '0.5rem'}}>98%</div>
                        <div style={{fontSize: '0.8rem', color: '#888'}}>Resolution Rate</div>
                      </div>
                      <div style={{background: '#111', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222'}}>
                        <div style={{fontSize: '2rem', fontWeight: 700, color: '#FF7A00', marginBottom: '0.5rem'}}>14</div>
                        <div style={{fontSize: '0.8rem', color: '#888'}}>Pending Actions</div>
                      </div>
                    </div>
                  </div>

                  <div style={{background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '2rem'}}>
                    <h3 style={{margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: '#fff'}}><LogOut size={18} color="#ef4444"/> Account Actions</h3>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #1e1e1e', marginBottom: '1rem'}}>
                      <div>
                        <div style={{fontWeight: 600, color: '#eee'}}>Change Password</div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>Update your security credentials</div>
                      </div>
                      <button style={{padding: '0.5rem 1rem', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff', cursor: 'pointer', transition: '0.2s'}} onClick={() => setShowPasswordModal(true)} onMouseEnter={e => e.currentTarget.style.background='#222'} onMouseLeave={e => e.currentTarget.style.background='#111'}>Update</button>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <div style={{fontWeight: 600, color: '#ef4444'}}>Sign Out</div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>Securely end your session</div>
                      </div>
                      <button style={{padding: '0.5rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', transition: '0.2s'}} onClick={() => setShowLogoutModal(true)} onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}>Logout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div style={{background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #333', width: '400px', maxWidth: '90%'}}>
            <h3 style={{margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#fff'}}>Change Password</h3>
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
              <button style={{flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#ccc', cursor: 'pointer'}} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button style={{flex: 1, padding: '0.8rem', background: '#007BFF', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600}} onClick={() => {
                showAlert('Success', 'Password updated successfully!', 'success');
                setShowPasswordModal(false);
              }}>Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}}>
          <div style={{background: '#111', padding: '2.5rem', borderRadius: '16px', border: '1px solid #333', width: '400px', maxWidth: '90%'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 style={{margin: 0, fontSize: '1.25rem', color: '#fff'}}>Confirm Logout</h3>
              <button style={{background: 'transparent', border: 'none', color: '#888', cursor: 'pointer'}} onClick={() => setShowLogoutModal(false)}><XCircle size={18}/></button>
            </div>
            <div>
              <p style={{color: '#888', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5'}}>Are you sure you want to log out of the sub-admin dashboard?</p>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button style={{flex: 1, padding: '0.8rem', background: 'transparent', border: '1px solid #333', borderRadius: '8px', color: '#ccc', cursor: 'pointer'}} onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button style={{flex: 1, padding: '0.8rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600}} onClick={() => navigate('/')}>Logout</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
