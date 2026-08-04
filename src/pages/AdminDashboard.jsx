import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalBooking } from '../context/GlobalBookingContext';
import {
  LayoutDashboard, Calendar, Users, CreditCard, BarChart2,
  Settings, Shield, LogOut, Bell, ChevronDown, Search,
  Plus, Eye, Pencil, Trash2, RefreshCw, Download, Filter,
  CheckCircle2, Clock, XCircle, UserPlus, ArrowRight, ArrowLeft,
  Activity, TrendingUp, Map, Star, Sliders, ToggleLeft, Menu
} from 'lucide-react';
import logo from '../assets/images/logo.jpg';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import CustomDialog from '../components/ui/CustomDialog';
import './AdminDashboard.css';

// ─── Data ────────────────────────────────────────────────
// ─── Mock data removed, using GlobalBookingContext ───

const INITIAL_CUSTOMERS = [
  { id:'C001', name:'Rahul Sharma',  email:'rahul@email.com',  phone:'9876543210', bookings:8,  spent:12500, status:'active',   joined:'Jan 2026' },
  { id:'C002', name:'Amit Verma',   email:'amit@email.com',   phone:'9123456780', bookings:5,  spent:8200,  status:'active',   joined:'Feb 2026' },
  { id:'C003', name:'Sneha Patil',  email:'sneha@email.com',  phone:'9000700010', bookings:3,  spent:4100,  status:'active',   joined:'Mar 2026' },
  { id:'C004', name:'Vivek Singh',  email:'vivek@email.com',  phone:'8800754962', bookings:12, spent:21000, status:'active',   joined:'Dec 2025' },
  { id:'C005', name:'Neeraj Kumar', email:'neeraj@email.com', phone:'9765432788', bookings:2,  spent:3200,  status:'inactive', joined:'Apr 2026' },
  { id:'C006', name:'Pooja Mehta',  email:'pooja@email.com',  phone:'9890000089', bookings:6,  spent:9800,  status:'active',   joined:'Feb 2026' },
];

const INITIAL_ADMINS = [
  { id:'A001', name:'Admin Super',  email:'admin@infinity.com',    role:'Super Admin', status:'active',  lastLogin:'03 Aug 2026, 9:05 AM' },
  { id:'A002', name:'Rahul Patel',  email:'rahul.p@infinity.com',  role:'Sub Admin',   status:'active',  lastLogin:'03 Aug 2026, 8:45 AM' },
  { id:'A003', name:'Priya Mehta',  email:'priya@infinity.com',    role:'Sub Admin',   status:'active',  lastLogin:'02 Aug 2026, 5:30 PM' },
  { id:'A004', name:'Dev Kumar',    email:'dev@infinity.com',      role:'Sub Admin',   status:'inactive',lastLogin:'29 Jul 2026, 2:10 PM' },
];

const SLOTS_DATA = {
  cricket: [
    { time:'6:00–8:00 AM',   g1:'booked',    g2:'available', g3:'available' },
    { time:'8:00–10:00 AM',  g1:'booked',    g2:'booked',    g3:'available' },
    { time:'10:00–12:00 PM', g1:'available', g2:'pending',   g3:'available' },
    { time:'12:00–2:00 PM',  g1:'booked',    g2:'available', g3:'blocked'   },
    { time:'2:00–4:00 PM',   g1:'available', g2:'booked',    g3:'available' },
    { time:'4:00–6:00 PM',   g1:'booked',    g2:'pending',   g3:'booked'    },
    { time:'6:00–8:00 PM',   g1:'pending',   g2:'available', g3:'booked'    },
    { time:'8:00–10:00 PM',  g1:'booked',    g2:'booked',    g3:'available' },
  ],
  volleyball: [
    { time:'6:00–8:00 AM',   g1:'available', g2:'available' },
    { time:'8:00–10:00 AM',  g1:'booked',    g2:'available' },
    { time:'10:00–12:00 PM', g1:'booked',    g2:'booked'    },
    { time:'12:00–2:00 PM',  g1:'available', g2:'pending'   },
    { time:'2:00–4:00 PM',   g1:'booked',    g2:'available' },
    { time:'4:00–6:00 PM',   g1:'pending',   g2:'booked'    },
    { time:'6:00–8:00 PM',   g1:'booked',    g2:'booked'    },
    { time:'8:00–10:00 PM',  g1:'available', g2:'available' },
  ],
  pickleball: [
    { time:'6:00–8:00 AM',   g1:'booked',    g2:'available' },
    { time:'8:00–10:00 AM',  g1:'available', g2:'booked'    },
    { time:'10:00–12:00 PM', g1:'booked',    g2:'booked'    },
    { time:'12:00–2:00 PM',  g1:'pending',   g2:'available' },
    { time:'2:00–4:00 PM',   g1:'booked',    g2:'pending'   },
    { time:'4:00–6:00 PM',   g1:'available', g2:'booked'    },
    { time:'6:00–8:00 PM',   g1:'booked',    g2:'available' },
    { time:'8:00–10:00 PM',  g1:'booked',    g2:'booked'    },
  ]
};

const today = new Date();
const fmtDate = d => d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

const SPORT_ICONS = { cricket:'🏏', volleyball:'🏐', pickleball:'🏓' };
const STATUS_COLORS = { confirmed:'confirmed', pending:'pending', cancelled:'cancelled', completed:'completed' };

// ─── DonutChart (pure CSS) ─────────────────────────────────
const DonutChart = ({ segments, total }) => {
  let offset = 0;
  const r = 45, cx = 50, cy = 50, stroke = 12;
  const circumference = 2 * Math.PI * r;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e1e" strokeWidth={stroke}/>
      {segments.map((seg, i) => {
        const len = (seg.pct / 100) * circumference;
        const dash = `${len} ${circumference - len}`;
        const rot = -90 + (offset / 100) * 360;
        offset += seg.pct;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={dash}
            strokeDashoffset={0}
            transform={`rotate(${rot} ${cx} ${cy})`}
            strokeLinecap="round"
          />
        );
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Inter">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#666" fontSize="7" fontFamily="Inter">TOTAL</text>
    </svg>
  );
};

// ─── Mini Bar Chart ────────────────────────────────────────
const MiniBarChart = ({ data, color }) => {
  const max = Math.max(...data.map(d => d.val));
  return (
    <div className="admin-analytics-bars">
      {data.map((d, i) => (
        <div key={i} className="admin-bar-col">
          <div
            className="admin-bar-fill"
            title={`${d.label}: ₹${d.val.toLocaleString()}`}
            style={{
              height: `${(d.val / max) * 100}%`,
              background: color,
              opacity: i === data.length - 1 ? 1 : 0.5 + (i / data.length) * 0.5
            }}
          />
          <span className="admin-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { bookings: BOOKINGS, deleteBooking, processRefund, updateBookingStatus } = useGlobalBooking();
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [slotSport, setSlotSport] = useState('cricket');
  const [bookSearch, setBookSearch] = useState('');
  const [bookStatus, setBookStatus] = useState('');
  const [bookSport, setBookSport] = useState('');
  const [custSearch, setCustSearch] = useState('');
  const [modal, setModal] = useState(null); // { type, data }
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const [settings, setSettings] = useState({
    emailNotif: true, smsNotif: false, autoConfirm: true, maintenanceMode: false,
    cricketPrice: 1999, volleyballPrice: 2199, pickleballPrice: 500,
    clubName: 'Infinity Sports Club', city: 'Rajkot', state: 'Gujarat',
    openTime: '6:00 AM', closeTime: '10:00 PM'
  });
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  // Filtered bookings
  const filteredBookings = useMemo(() => BOOKINGS.filter(b => {
    const q = bookSearch.toLowerCase();
    const ms = !q || b.id.toLowerCase().includes(q) || b.customer.toLowerCase().includes(q) || b.phone.includes(q);
    const mSport  = !bookSport  || b.sport === bookSport;
    const mStatus = !bookStatus || b.status === bookStatus;
    return ms && mSport && mStatus;
  }), [bookSearch, bookSport, bookStatus, BOOKINGS]);

  const pageBookings = filteredBookings.slice((page-1)*rowsPerPage, page*rowsPerPage);
  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);

  // Stats
  const totalRevToday = BOOKINGS.filter(b=>b.date.startsWith('03 Aug 2026') && b.status!=='cancelled').reduce((s,b)=>s+b.amount,0);
  const totalConfirmed = BOOKINGS.filter(b=>b.status==='confirmed').length;
  const totalPending   = BOOKINGS.filter(b=>b.status==='pending').length;
  const totalCustomers = customers.length;

  const nav = [
    { id:'dashboard',  label:'Dashboard',  icon:<LayoutDashboard size={15}/>, section:'main' },
    { id:'slots',      label:'Slots',      icon:<Calendar size={15}/>,       section:'manage', badge: 3 },
    { id:'bookings',   label:'Bookings',   icon:<Calendar size={15}/>,       section:'manage' },
    { id:'customers',  label:'Customers',  icon:<Users size={15}/>,          section:'manage' },
    { id:'payments',   label:'Payments',   icon:<CreditCard size={15}/>,     section:'manage' },
    { id:'analytics',  label:'Analytics',  icon:<BarChart2 size={15}/>,      section:'reports' },
    { id:'settings',   label:'Settings',   icon:<Settings size={15}/>,       section:'settings' },
    { id:'admins',     label:'Admins',     icon:<Shield size={15}/>,         section:'settings' },
  ];

  const sections = { main:[], manage:[], reports:[], settings:[] };
  nav.forEach(n => sections[n.section].push(n));

  const NavSection = ({ label, items }) => (
    <div className="admin-nav-section">
      {label && <div className="admin-nav-label">{label}</div>}
      {items.map(item => (
        <div
          key={item.id}
          className={`admin-nav-item ${activeSection===item.id?'active':''}`}
          onClick={() => { setActiveSection(item.id); setPage(1); setIsMobileSidebarOpen(false); }}
        >
          {item.icon}
          {item.label}
          {item.badge && <span className="admin-nav-badge">{item.badge}</span>}
        </div>
      ))}
    </div>
  );

  // ─── RENDER SECTIONS ──────────────────────────────────
  const renderContent = () => {
    // ─ DASHBOARD ─────────────────────────────────────────
    if (activeSection === 'dashboard') return (
      <div>
        {/* Sport Cards */}
        <div className="admin-sport-cards">
          {[
            { key:'cricket',    label:'Box Cricket',  total:28, booked:18, avail:10, color:'var(--admin-orange)' },
            { key:'volleyball', label:'Volleyball',   total:32, booked:21, avail:11, color:'var(--admin-blue)'   },
            { key:'pickleball', label:'Pickleball',   total:24, booked:15, avail:9,  color:'var(--admin-green)'  },
          ].map(s => (
            <div key={s.key} className={`admin-sport-card ${s.key}`}>
              <div className="admin-sport-card-header">
                <span className={`admin-sport-badge ${s.key}`}>
                  {SPORT_ICONS[s.key]} {s.label}
                </span>
              </div>
              <div className={`admin-sport-count ${s.key}`}>{s.total}</div>
              <div className="admin-sport-label">Total Slots Today</div>
              <div className="admin-sport-stats">
                <div className="admin-sport-stat">
                  <div className="admin-sport-stat-val" style={{color:s.color}}>{s.booked}</div>
                  <div className="admin-sport-stat-lbl">Booked Slots</div>
                </div>
                <div className="admin-sport-stat">
                  <div className="admin-sport-stat-val" style={{color:'#22c55e'}}>{s.avail}</div>
                  <div className="admin-sport-stat-lbl">Available Slots</div>
                </div>
              </div>
              <button
                className={`admin-sport-card-btn ${s.key}`}
                onClick={() => { setActiveSection('slots'); setSlotSport(s.key); }}
              >
                Manage Slots <ArrowRight size={13}/>
              </button>
            </div>
          ))}
        </div>

        {/* Slot Overview + Booking Summary */}
        <div className="admin-row-2" style={{marginBottom:'1.25rem'}}>
          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-title">Today's Slot Overview</div>
                <div className="admin-panel-sub">{fmtDate(today)}</div>
              </div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                {['cricket','volleyball','pickleball'].map(s => (
                  <button key={s} className={`admin-slot-tab ${slotSport===s?`active-${s}`:''}`}
                    onClick={() => setSlotSport(s)}
                    style={{textTransform:'capitalize'}}
                  >{s}</button>
                ))}
              </div>
            </div>
            <div className="admin-slot-grid-wrap">
              <table className="admin-slot-table">
                <thead>
                  <tr>
                    <th style={{textAlign:'left'}}>Time Slot</th>
                    {slotSport === 'cricket'
                      ? ['Ground 1','Ground 2','Ground 3'].map(g=><th key={g}>{g}</th>)
                      : slotSport === 'volleyball'
                      ? ['Court A','Court B'].map(g=><th key={g}>{g}</th>)
                      : ['Arena 1','Arena 2'].map(g=><th key={g}>{g}</th>)
                    }
                  </tr>
                </thead>
                <tbody>
                  {SLOTS_DATA[slotSport].map((row, i) => (
                    <tr key={i}>
                      <td data-label="Time" style={{color:'#888',fontSize:'0.7rem',textAlign:'left',whiteSpace:'nowrap'}}>{row.time}</td>
                      {Object.entries(row).filter(([k])=>k!=='time').map(([k, val]) => (
                        <td key={k} data-label={slotSport === 'cricket' ? k.replace('g','Ground ') : slotSport === 'volleyball' ? (k==='g1'?'Court A':'Court B') : (k==='g1'?'Arena 1':'Arena 2')}>
                          <span
                            className={`admin-slot-cell ${val}`}
                            onClick={() => setModal({ type:'slotAction', data:{ time:row.time, court:k, status:val, sport:slotSport } })}
                          >{val}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-header">
              <div>
                <div className="admin-panel-title">Booking Summary</div>
                <div className="admin-panel-sub">Today</div>
              </div>
            </div>
            <div className="admin-panel-body">
              <div className="admin-donut-wrap" style={{marginBottom:'1.25rem'}}>
                <DonutChart
                  total={54}
                  segments={[
                    {pct:46, color:'#FF7A00'},
                    {pct:33, color:'#007BFF'},
                    {pct:21, color:'#22c55e'},
                  ]}
                />
                <div className="admin-donut-legend">
                  {[
                    {label:'Box Cricket',  pct:46, color:'#FF7A00'},
                    {label:'Volleyball',   pct:33, color:'#007BFF'},
                    {label:'Pickleball',   pct:21, color:'#22c55e'},
                  ].map((item,i) => (
                    <div key={i} className="admin-donut-legend-item">
                      <div className="admin-donut-legend-dot" style={{background:item.color}}/>
                      <span style={{color:'#aaa',fontSize:'0.75rem'}}>{item.label}</span>
                      <span className="admin-donut-legend-pct">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{borderTop:'1px solid var(--admin-border)',paddingTop:'0.85rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:'0.5rem'}}>
                  <span style={{fontSize:'0.75rem',color:'var(--admin-muted)'}}>Total Revenue (Today)</span>
                  <span style={{color:'var(--admin-green)',fontSize:'0.7rem',fontWeight:700}}>▲ 12.5%</span>
                </div>
                <div style={{fontSize:'1.6rem',fontWeight:800,color:'var(--admin-green)'}}>₹{totalRevToday.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="admin-panel" style={{marginBottom:'1.25rem'}}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">Recent Bookings</div>
            <button className="admin-action-btn secondary" onClick={() => setActiveSection('bookings')}>
              View All <ArrowRight size={13}/>
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th><th>Sport</th><th>Date</th>
                  <th>Time Slot</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {BOOKINGS.slice(0,5).map(b => (
                  <tr key={b.id}>
                    <td data-label="Booking ID" style={{fontFamily:'monospace',color:'#666',fontSize:'0.73rem'}}>{b.id}</td>
                    <td data-label="Sport">
                      <div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>
                        <span>{SPORT_ICONS[b.sport]}</span>
                        <span>{b.sportLabel}</span>
                      </div>
                    </td>
                    <td data-label="Date">{b.date}</td>
                    <td data-label="Time Slot" style={{whiteSpace:'nowrap'}}>{b.timeSlot}</td>
                    <td data-label="Customer">
                      <div style={{fontWeight:500}}>{b.customer}</div>
                      <div style={{fontSize:'0.68rem',color:'#555'}}>{b.phone}</div>
                    </td>
                    <td data-label="Amount" style={{fontWeight:600}}>₹{b.amount.toLocaleString()}</td>
                    <td data-label="Status"><span className={`admin-badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    <td data-label="Action">
                      <button className="admin-view-btn" onClick={() => setModal({type:'booking',data:b})}>
                        <Eye size={11}/> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{marginBottom:'0.5rem'}}>
          <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:'0.85rem'}}>Quick Actions</div>
          <div className="admin-quick-actions">
            {[
              { icon:<Plus size={18}/>, iconBg:'rgba(255,122,0,0.15)', iconColor:'#FF7A00', label:'Create New Slot', sub:'Add new time slot', action:'slots' },
              { icon:<Eye size={18}/>,  iconBg:'rgba(0,123,255,0.15)', iconColor:'#007BFF', label:'View All Bookings', sub:'Manage all bookings', action:'bookings' },
              { icon:<UserPlus size={18}/>, iconBg:'rgba(34,197,94,0.15)',iconColor:'#22c55e', label:'Add New Game', sub:'Create a new sport', action:'settings' },
              { icon:<BarChart2 size={18}/>, iconBg:'rgba(168,85,247,0.15)',iconColor:'#a855f7', label:'View Reports', sub:'Analytics & insights', action:'analytics' },
            ].map((qa, i) => (
              <div key={i} className="admin-qa-btn" onClick={() => setActiveSection(qa.action)}>
                <div className="admin-qa-icon" style={{background:qa.iconBg,color:qa.iconColor}}>{qa.icon}</div>
                <div className="admin-qa-label">{qa.label}</div>
                <div className="admin-qa-sub">{qa.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    // ─ SLOTS ──────────────────────────────────────────────
    if (activeSection === 'slots') return (
      <div>
        <div className="admin-section-head">
          <div>
            <h1>Slot Management</h1>
            <p>View and manage all time slots across grounds</p>
          </div>
          <button className="admin-action-btn primary" onClick={() => setModal({type:'addSlot'})}>
            <Plus size={14}/> Add New Slot
          </button>
        </div>

        <div className="admin-mini-stats" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
          {[
            {icon:<CheckCircle2 size={18}/>, cls:'green',  val:28, lbl:'Available',  delta:'+5 today'},
            {icon:<Clock size={18}/>,        cls:'orange', val:46, lbl:'Booked',     delta:'84 slots/week'},
            {icon:<XCircle size={18}/>,      cls:'red',    val:3,  lbl:'Blocked',    delta:'Manual block'},
          ].map(({icon,cls,val,lbl,delta},i) => (
            <div key={i} className="admin-mini-stat">
              <div className={`admin-mini-stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="admin-mini-stat-val">{val}</div>
                <div className="admin-mini-stat-lbl">{lbl}</div>
                <div className="admin-mini-stat-delta">{delta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <div className="admin-panel-header">
            <div className="admin-panel-title">Slot Grid — {slotSport.charAt(0).toUpperCase()+slotSport.slice(1)}</div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              {['cricket','volleyball','pickleball'].map(s => (
                <button key={s} className={`admin-slot-tab ${slotSport===s?`active-${s}`:''}`}
                  onClick={() => setSlotSport(s)}
                  style={{textTransform:'capitalize'}}
                >{SPORT_ICONS[s]} {s}</button>
              ))}
            </div>
          </div>
          <div className="admin-slot-grid-wrap">
            <table className="admin-slot-table">
              <thead>
                <tr>
                  <th style={{textAlign:'left'}}>Time Slot</th>
                  {slotSport === 'cricket'
                    ? ['Ground 1','Ground 2','Ground 3'].map(g=><th key={g}>{g}</th>)
                    : slotSport === 'volleyball'
                    ? ['Court A','Court B'].map(g=><th key={g}>{g}</th>)
                    : ['Arena 1','Arena 2'].map(g=><th key={g}>{g}</th>)
                  }
                </tr>
              </thead>
              <tbody>
                {SLOTS_DATA[slotSport].map((row, i) => (
                  <tr key={i}>
                    <td data-label="Time" style={{color:'#888',fontSize:'0.7rem',textAlign:'left',whiteSpace:'nowrap'}}>{row.time}</td>
                    {Object.entries(row).filter(([k])=>k!=='time').map(([k, val]) => (
                      <td key={k} data-label={slotSport === 'cricket' ? k.replace('g','Ground ') : slotSport === 'volleyball' ? (k==='g1'?'Court A':'Court B') : (k==='g1'?'Arena 1':'Arena 2')}>
                        <span
                          className={`admin-slot-cell ${val}`}
                          onClick={() => setModal({ type:'slotAction', data:{ time:row.time, court:k, status:val, sport:slotSport } })}
                        >{val}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:'0.75rem 1.25rem',borderTop:'1px solid var(--admin-border)',display:'flex',gap:'0.65rem',flexWrap:'wrap',alignItems:'center'}}>
            <span style={{fontSize:'0.72rem',color:'var(--admin-muted)'}}>Legend:</span>
            {['booked','available','pending','blocked'].map(s=>(
              <span key={s} className={`admin-slot-cell ${s}`} style={{cursor:'default'}}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    );

    // ─ BOOKINGS ────────────────────────────────────────────
    if (activeSection === 'bookings') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Bookings</h1><p>All booking records across sports</p></div>
          <button className="admin-action-btn secondary" onClick={() => {
            const csv = ['ID,Sport,Customer,Date,Time,Amount,Status',...BOOKINGS.map(b=>`${b.id},${b.sportLabel},${b.customer},${b.date},${b.timeSlot},${b.amount},${b.status}`)].join('\n');
            const a=document.createElement('a'); a.href='data:text/csv,'+encodeURIComponent(csv); a.download='bookings.csv'; a.click();
          }}>
            <Download size={13}/> Export CSV
          </button>
        </div>

        <div className="admin-mini-stats">
          {[
            {icon:<Calendar size={18}/>,     cls:'orange', val:BOOKINGS.length, lbl:'Total Bookings', delta:'All time'},
            {icon:<CheckCircle2 size={18}/>, cls:'green',  val:totalConfirmed,  lbl:'Confirmed',      delta:'Active'},
            {icon:<Clock size={18}/>,        cls:'yellow', val:totalPending,    lbl:'Pending',         delta:'Awaiting'},
            {icon:<TrendingUp size={18}/>,   cls:'blue',   val:`₹${totalRevToday.toLocaleString()}`, lbl:'Revenue Today', delta:'▲ 12.5%'},
          ].map(({icon,cls,val,lbl,delta},i) => (
            <div key={i} className="admin-mini-stat">
              <div className={`admin-mini-stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="admin-mini-stat-val" style={{fontSize: typeof val==='string'?'1.1rem':'1.5rem'}}>{val}</div>
                <div className="admin-mini-stat-lbl">{lbl}</div>
                <div className="admin-mini-stat-delta">{delta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <div className="admin-filter-bar" style={{padding:'0.85rem 1.25rem',margin:0,borderBottom:'1px solid var(--admin-border)'}}>
            <div className="admin-search-box">
              <Search size={13} color="#444"/>
              <input placeholder="Search booking ID, customer, phone…" value={bookSearch} onChange={e=>{setBookSearch(e.target.value);setPage(1);}}/>
            </div>
            <select className="admin-filter-sel" value={bookSport} onChange={e=>{setBookSport(e.target.value);setPage(1);}}>
              <option value="">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="volleyball">Volleyball</option>
              <option value="pickleball">Pickleball</option>
            </select>
            <select className="admin-filter-sel" value={bookStatus} onChange={e=>{setBookStatus(e.target.value);setPage(1);}}>
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="admin-action-btn secondary" onClick={()=>{setBookSearch('');setBookSport('');setBookStatus('');setPage(1);}}>
              <RefreshCw size={12}/> Reset
            </button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th><th>Sport</th><th>Ground</th><th>Date</th>
                  <th>Time Slot</th><th>Customer</th><th>Amount</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageBookings.length === 0 ? (
                  <tr><td colSpan={9} style={{textAlign:'center',padding:'2.5rem',color:'#333'}}>No bookings found</td></tr>
                ) : pageBookings.map(b => (
                  <tr key={b.id}>
                    <td data-label="Booking ID" style={{fontFamily:'monospace',color:'#555',fontSize:'0.72rem'}}>{b.id}</td>
                    <td data-label="Sport"><div style={{display:'flex',alignItems:'center',gap:'0.4rem'}}>{SPORT_ICONS[b.sport]} {b.sportLabel}</div></td>
                    <td data-label="Ground"><div>{b.ground}</div><div style={{fontSize:'0.68rem',color:'#444'}}>{b.court}</div></td>
                    <td data-label="Date">{b.date}</td>
                    <td data-label="Time Slot" style={{whiteSpace:'nowrap',fontSize:'0.75rem'}}>{b.timeSlot}</td>
                    <td data-label="Customer"><div style={{fontWeight:500}}>{b.customer}</div><div style={{fontSize:'0.68rem',color:'#555'}}>{b.phone}</div></td>
                    <td data-label="Amount" style={{fontWeight:600}}>₹{b.amount.toLocaleString()}</td>
                    <td data-label="Status"><span className={`admin-badge ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                    <td data-label="Action">
                      <div style={{display:'flex',gap:'0.3rem'}}>
                        <button className="admin-icon-btn view" title="View" onClick={() => setModal({type:'booking',data:b})}><Eye size={12}/> View</button>
                        <button className="admin-icon-btn edit" title="Edit" onClick={() => setModal({type:'editBooking',data:b})}><Pencil size={12}/> Edit</button>
                        <button className="admin-icon-btn danger" title="Delete" onClick={() => {
                          showConfirm('Delete Booking', 'Are you sure you want to delete this booking?', 'danger', () => deleteBooking(b.id));
                        }}><Trash2 size={12}/> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="admin-pagination">
            <span>Showing {Math.min((page-1)*rowsPerPage+1,filteredBookings.length)}–{Math.min(page*rowsPerPage,filteredBookings.length)} of {filteredBookings.length}</span>
            <div className="admin-pages">
              <button className="admin-page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
              {[...Array(totalPages)].map((_,i)=>(
                <button key={i+1} className={`admin-page-btn ${page===i+1?'active':''}`} onClick={()=>setPage(i+1)}>{i+1}</button>
              ))}
              <button className="admin-page-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
            </div>
            <span>{filteredBookings.length} results</span>
          </div>
        </div>
      </div>
    );

    // ─ CUSTOMERS ──────────────────────────────────────────
    if (activeSection === 'customers') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Customers</h1><p>All registered users</p></div>
          <button className="admin-action-btn primary" onClick={() => setModal({type:'addCustomer'})}>
            <UserPlus size={14}/> Add Customer
          </button>
        </div>

        <div className="admin-filter-bar">
          <div className="admin-search-box">
            <Search size={13} color="#444"/>
            <input placeholder="Search name, email, phone…" value={custSearch} onChange={e=>setCustSearch(e.target.value)}/>
          </div>
          <select className="admin-filter-sel">
            <option>All Status</option><option>Active</option><option>Inactive</option>
          </select>
        </div>

        <div className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Bookings</th><th>Total Spent</th><th>Joined</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customers.filter(c=>{
                  const q=custSearch.toLowerCase();
                  return !q||c.name.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||c.phone.includes(q);
                }).map(c => (
                  <tr key={c.id}>
                    <td data-label="ID" style={{color:'#555',fontFamily:'monospace',fontSize:'0.72rem'}}>{c.id}</td>
                    <td data-label="Name">
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:`hsl(${c.id.charCodeAt(2)*40},55%,35%)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700}}>
                          {c.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span style={{fontWeight:500}}>{c.name}</span>
                      </div>
                    </td>
                    <td data-label="Email" style={{color:'#888',fontSize:'0.78rem'}}>{c.email}</td>
                    <td data-label="Phone" style={{color:'#888',fontSize:'0.78rem'}}>{c.phone}</td>
                    <td data-label="Bookings" style={{fontWeight:600}}>{c.bookings}</td>
                    <td data-label="Total Spent" style={{fontWeight:600,color:'#22c55e'}}>₹{c.spent.toLocaleString()}</td>
                    <td data-label="Joined" style={{color:'#666',fontSize:'0.75rem'}}>{c.joined}</td>
                    <td data-label="Status"><span className={`admin-badge ${c.status}`}>{c.status}</span></td>
                    <td data-label="Action">
                      <div style={{display:'flex',gap:'0.3rem'}}>
                        <button className="admin-icon-btn view" onClick={()=>setModal({type:'customer',data:c})}><Eye size={12}/> View</button>
                        <button className="admin-icon-btn edit" onClick={() => setModal({type:'editCustomer',data:c})}><Pencil size={12}/> Edit</button>
                        <button className="admin-icon-btn danger" title="Delete" onClick={() => {
                          showConfirm('Delete Customer', 'Are you sure you want to delete this customer?', 'danger', () => {
                            setCustomers(prev => prev.filter(cust => cust.id !== c.id));
                            showAlert('Deleted', 'Customer has been deleted.', 'success');
                          });
                        }}><Trash2 size={12}/> Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ─ PAYMENTS ───────────────────────────────────────────
    if (activeSection === 'payments') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Payments</h1><p>All payment transactions</p></div>
          <button className="admin-action-btn secondary">
            <Download size={13}/> Export
          </button>
        </div>

        <div className="admin-mini-stats">
          {[
            {icon:<TrendingUp size={18}/>, cls:'green',  val:'₹45,600', lbl:'Total Revenue (Today)', delta:'▲ 12.5%'},
            {icon:<CreditCard size={18}/>, cls:'blue',   val:'₹3,20,000',lbl:'Monthly Revenue',      delta:'Aug 2026'},
            {icon:<CheckCircle2 size={18}/>,cls:'orange',val:54,         lbl:'Paid Transactions',    delta:'Today'},
            {icon:<XCircle size={18}/>,    cls:'red',    val:3,          lbl:'Failed / Refunds',     delta:'This week'},
          ].map(({icon,cls,val,lbl,delta},i) => (
            <div key={i} className="admin-mini-stat">
              <div className={`admin-mini-stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="admin-mini-stat-val" style={{fontSize:'1.1rem'}}>{val}</div>
                <div className="admin-mini-stat-lbl">{lbl}</div>
                <div className="admin-mini-stat-delta">{delta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Txn ID</th><th>Booking</th><th>Customer</th><th>Sport</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {BOOKINGS.map((b,i) => (
                  <tr key={b.id}>
                    <td data-label="Txn ID" style={{fontFamily:'monospace',color:'#555',fontSize:'0.72rem'}}>TXN{b.id.replace('#','')}</td>
                    <td data-label="Booking" style={{fontFamily:'monospace',color:'#888',fontSize:'0.72rem'}}>{b.id}</td>
                    <td data-label="Customer" style={{fontWeight:500}}>{b.customer}</td>
                    <td data-label="Sport">{SPORT_ICONS[b.sport]} {b.sportLabel}</td>
                    <td data-label="Amount" style={{fontWeight:700,color:'#22c55e'}}>₹{b.amount.toLocaleString()}</td>
                    <td data-label="Method"><span style={{fontSize:'0.75rem',background:'rgba(255,122,0,0.1)',color:'#FF7A00',padding:'0.18rem 0.5rem',borderRadius:'6px',fontWeight:600}}>GPay</span></td>
                    <td data-label="Status"><span className={`admin-badge ${b.status==='cancelled'?'cancelled':'confirmed'}`}>{b.status==='cancelled'?'refunded':'paid'}</span></td>
                    <td data-label="Date" style={{color:'#666',fontSize:'0.75rem'}}>{b.bookedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ─ ANALYTICS ──────────────────────────────────────────
    if (activeSection === 'analytics') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Analytics</h1><p>Business performance insights</p></div>
        </div>

        <div className="admin-mini-stats">
          {[
            {icon:<TrendingUp size={18}/>, cls:'green',  val:'₹3.2L', lbl:'Monthly Revenue',  delta:'▲ 18% vs last month'},
            {icon:<Calendar size={18}/>,  cls:'orange', val:184,     lbl:'Total Bookings',   delta:'Aug 2026'},
            {icon:<Users size={18}/>,     cls:'blue',   val:76,      lbl:'Unique Customers', delta:'This month'},
            {icon:<Star size={18}/>,      cls:'purple', val:'4.8',   lbl:'Avg Rating',       delta:'From 124 reviews'},
          ].map(({icon,cls,val,lbl,delta},i) => (
            <div key={i} className="admin-mini-stat">
              <div className={`admin-mini-stat-icon ${cls}`}>{icon}</div>
              <div>
                <div className="admin-mini-stat-val" style={{fontSize:'1.25rem'}}>{val}</div>
                <div className="admin-mini-stat-lbl">{lbl}</div>
                <div className="admin-mini-stat-delta">{delta}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-row-2">
          <div className="admin-panel" style={{height: '350px', display: 'flex', flexDirection: 'column'}}>
            <div className="admin-panel-header">
              <div className="admin-panel-title">Weekly Revenue</div>
              <span style={{fontSize:'0.72rem',color:'var(--admin-muted)'}}>Last 7 days</span>
            </div>
            <div className="admin-panel-body" style={{flex: 1, minHeight: 0}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  {label:'Mon', val:18200}, {label:'Tue', val:23000}, {label:'Wed', val:19500},
                  {label:'Thu', val:31000}, {label:'Fri', val:27400}, {label:'Sat', val:45600}, {label:'Sun', val:38900},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="label" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{background: '#222', border: '1px solid #444', borderRadius: '8px'}} itemStyle={{color: '#FF7A00'}} />
                  <Bar dataKey="val" fill="var(--admin-orange)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="admin-panel" style={{height: '350px', display: 'flex', flexDirection: 'column'}}>
            <div className="admin-panel-header">
              <div className="admin-panel-title">Revenue by Sport</div>
            </div>
            <div className="admin-panel-body" style={{flex: 1, minHeight: 0, position: 'relative'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {name:'Cricket', value:128000, color:'#FF7A00'},
                      {name:'Volleyball', value:89000, color:'#007BFF'},
                      {name:'Pickleball', value:43000, color:'#22c55e'},
                    ]}
                    cx="50%" cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {[
                      {name:'Cricket', value:128000, color:'#FF7A00'},
                      {name:'Volleyball', value:89000, color:'#007BFF'},
                      {name:'Pickleball', value:43000, color:'#22c55e'},
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{background: '#222', border: '1px solid #444', borderRadius: '8px'}} itemStyle={{color: '#fff'}} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="admin-panel" style={{height: '350px', display: 'flex', flexDirection: 'column', marginTop: '1.5rem'}}>
          <div className="admin-panel-header">
            <div className="admin-panel-title">Monthly Revenue Trend</div>
          </div>
          <div className="admin-panel-body" style={{flex: 1, minHeight: 0}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                {label:'Mar', val:180000}, {label:'Apr', val:210000}, {label:'May', val:195000},
                {label:'Jun', val:245000}, {label:'Jul', val:280000}, {label:'Aug', val:320000},
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="label" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip contentStyle={{background: '#222', border: '1px solid #444', borderRadius: '8px'}} itemStyle={{color: '#a855f7'}} />
                <Line type="monotone" dataKey="val" stroke="#a855f7" strokeWidth={3} dot={{r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#222'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );

    // ─ ADMINS ─────────────────────────────────────────────
    if (activeSection === 'admins') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Admin Users</h1><p>Manage admin access and permissions</p></div>
          <button className="admin-action-btn primary" onClick={() => setModal({type:'addAdmin'})}>
            <UserPlus size={14}/> Add Admin
          </button>
        </div>

        <div className="admin-panel">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Action</th></tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td data-label="ID" style={{fontFamily:'monospace',color:'#555',fontSize:'0.72rem'}}>{a.id}</td>
                    <td data-label="Name">
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                        <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#FF7A00,#e66d00)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700}}>
                          {a.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        {a.name}
                      </div>
                    </td>
                    <td data-label="Email" style={{color:'#888',fontSize:'0.78rem'}}>{a.email}</td>
                    <td data-label="Role">
                      <span style={{
                        background: a.role==='Super Admin'?'rgba(255,122,0,0.12)':'rgba(0,123,255,0.1)',
                        color: a.role==='Super Admin'?'#FF7A00':'#007BFF',
                        padding:'0.2rem 0.6rem',borderRadius:'20px',fontSize:'0.68rem',fontWeight:700
                      }}>{a.role}</span>
                    </td>
                    <td data-label="Status"><span className={`admin-badge ${a.status}`}>{a.status}</span></td>
                    <td data-label="Last Login" style={{color:'#666',fontSize:'0.75rem'}}>{a.lastLogin}</td>
                    <td data-label="Action">
                      <div style={{display:'flex',gap:'0.3rem'}}>
                        <button className="admin-icon-btn view" onClick={() => setModal({type:'admin', data:a})}><Eye size={12}/> View</button>
                        <button className="admin-icon-btn edit" onClick={() => setModal({type:'editAdmin', data:a})}><Pencil size={12}/> Edit</button>
                        {a.role !== 'Super Admin' && <button className="admin-icon-btn danger" onClick={() => {
                          showConfirm('Delete Admin', 'Are you sure you want to delete this admin?', 'danger', () => showAlert('Deleted', 'Admin has been deleted.', 'success'));
                        }}><Trash2 size={12}/> Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ─ SETTINGS ───────────────────────────────────────────
    if (activeSection === 'settings') return (
      <div>
        <div className="admin-section-head">
          <div><h1>Settings</h1><p>Configure your platform</p></div>
          <button className="admin-action-btn primary" onClick={() => showAlert('Settings Saved', 'Platform settings have been saved successfully.', 'success')}>
            Save Changes
          </button>
        </div>

        <div className="admin-settings-grid">
          {/* Club Info */}
          <div className="admin-panel">
            <div className="admin-panel-header"><div className="admin-panel-title">Club Information</div></div>
            <div className="admin-panel-body">
              {[
                {label:'Club Name', key:'clubName', type:'text'},
                {label:'City', key:'city', type:'text'},
                {label:'State', key:'state', type:'text'},
                {label:'Opening Time', key:'openTime', type:'text'},
                {label:'Closing Time', key:'closeTime', type:'text'},
              ].map(f => (
                <div key={f.key} className="admin-form-group">
                  <label className="admin-form-label">{f.label}</label>
                  <input className="admin-form-input" type={f.type} value={settings[f.key]}
                    onChange={e => setSettings({...settings, [f.key]: e.target.value})}/>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="admin-panel">
            <div className="admin-panel-header"><div className="admin-panel-title">Pricing (per hour)</div></div>
            <div className="admin-panel-body">
              {[
                {label:'🏏 Cricket',    key:'cricketPrice'},
                {label:'🏐 Volleyball', key:'volleyballPrice'},
                {label:'🏓 Pickleball',  key:'pickleballPrice'},
              ].map(f => (
                <div key={f.key} className="admin-form-group">
                  <label className="admin-form-label">{f.label}</label>
                  <input className="admin-form-input" type="number" value={settings[f.key]}
                    onChange={e => setSettings({...settings, [f.key]: Number(e.target.value)})}/>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="admin-panel" style={{gridColumn:'1/-1'}}>
            <div className="admin-panel-header"><div className="admin-panel-title">Notification & System Settings</div></div>
            <div className="admin-panel-body">
              {[
                {key:'emailNotif',     label:'Email Notifications',  sub:'Send booking confirmation emails to customers'},
                {key:'smsNotif',       label:'SMS Notifications',     sub:'Send SMS alerts for bookings and reminders'},
                {key:'autoConfirm',    label:'Auto-Confirm Bookings', sub:'Automatically confirm bookings upon payment'},
                {key:'maintenanceMode',label:'Maintenance Mode',      sub:'Take the website offline for maintenance'},
              ].map(tog => (
                <div key={tog.key} className="admin-toggle">
                  <div className="admin-toggle-info">
                    <h4>{tog.label}</h4>
                    <p>{tog.sub}</p>
                  </div>
                  <button
                    className={`admin-toggle-switch ${settings[tog.key]?'on':'off'}`}
                    onClick={() => setSettings({...settings, [tog.key]: !settings[tog.key]})}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );

    return null;
  };

  // ─── MODALS ───────────────────────────────────────────
  const renderModal = () => {
    if (!modal) return null;

    const close = () => setModal(null);

    const handleSave = () => {
      if (modal.type === 'addCustomer') {
        const name = document.getElementById('addCust_Full Name')?.value;
        if (!name) return showAlert('Error', 'Name is required.', 'error');
        const phone = document.getElementById('addCust_Phone')?.value || 'N/A';
        const email = document.getElementById('addCust_Email')?.value || 'N/A';
        const newCust = {
          id: 'C00' + (customers.length + 1),
          name, email, phone, bookings: 0, spent: 0, status: 'active', joined: new Date().toLocaleDateString('en-IN', {month:'short', year:'numeric'})
        };
        setCustomers(prev => [newCust, ...prev]);
        showAlert('Success', 'Customer added successfully.', 'success');
      } else if (modal.type === 'addAdmin') {
        const name = document.getElementById('addAdmin_Full Name')?.value;
        if (!name) return showAlert('Error', 'Name is required.', 'error');
        const email = document.getElementById('addAdmin_Email')?.value || 'N/A';
        const role = document.getElementById('addAdmin_Role')?.value || 'Sub Admin';
        const newAdmin = {
          id: 'A00' + (admins.length + 1),
          name, email, role, status: 'active', lastLogin: 'Never'
        };
        setAdmins(prev => [newAdmin, ...prev]);
        showAlert('Success', 'Admin added successfully.', 'success');
      } else {
        showAlert('Success', 'Settings saved successfully.', 'success');
      }
      close();
    };

    if (modal.type === 'booking') {
      const b = modal.data;
      return (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Booking Details — {b.id}</h3>
              <button className="admin-modal-close" onClick={close}><XCircle size={14}/></button>
            </div>
            <div className="admin-modal-body">
              {[['Sport',b.sportLabel],['Ground',`${b.ground} · ${b.court}`],['Date',b.date],['Time',b.timeSlot],
                ['Customer',b.customer],['Phone',b.phone],['Amount',`₹${b.amount.toLocaleString()}`],
                ['Status',b.status],['Booked On',b.bookedAt]
              ].map(([k,v])=>(
                <div key={k} style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',gap:'0.3rem',padding:'0.55rem 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:'0.78rem',color:'#555',minWidth:'80px'}}>{k}</span>
                  <span style={{fontSize:'0.82rem',color:'#ddd',fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn secondary" onClick={close}>Close</button>
              {b.status === 'confirmed' || b.status === 'upcoming' ? (
                <>
                  <button className="admin-action-btn primary" style={{background: '#ef4444'}} onClick={() => {
                    showConfirm('Delete Booking', 'Are you sure you want to delete this booking?', 'danger', () => { deleteBooking(b.id); close(); });
                  }}>Delete Booking</button>
                  <button className="admin-action-btn primary" style={{background: '#eab308'}} onClick={() => {
                    showConfirm('Process Refund', 'Process refund for this booking?', 'warning', () => { processRefund(b.id); close(); });
                  }}>Refund</button>
                </>
              ) : null}
              <button className="admin-action-btn primary" onClick={() => { showAlert('Print', 'Printing ticket...', 'info'); setTimeout(()=>window.print(), 500); }}>Print Ticket</button>
            </div>
          </div>
        </div>
      );
    }

    if (modal.type === 'slotAction') {
      const { time, court, status, sport } = modal.data;
      return (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Slot Action</h3>
              <button className="admin-modal-close" onClick={close}><XCircle size={14}/></button>
            </div>
            <div className="admin-modal-body">
              <p style={{color:'#888',fontSize:'0.83rem',marginBottom:'1rem'}}>
                <b style={{color:'#ddd'}}>{sport}</b> · {time} · {court}
              </p>
              <p style={{marginBottom:'1rem',fontSize:'0.83rem'}}>
                Current status: <span className={`admin-badge ${status==='booked'?'confirmed':status==='available'?'active':status==='pending'?'pending':'inactive'}`}>{status}</span>
              </p>
              <div style={{display:'flex',gap:'0.6rem',flexWrap:'wrap'}}>
                {['available','booked','blocked'].map(s=>(
                  <button key={s} className="admin-action-btn secondary" style={{flex:1}} onClick={() => { close(); showAlert('Slot Updated', `Slot successfully marked as ${s}`, 'success'); }}>
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (modal.type === 'notif') {
      return (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="admin-modal" style={{maxWidth: '400px'}}>
            <div className="admin-modal-header">
              <h3>Notifications</h3>
              <button className="admin-modal-close" onClick={close}><XCircle size={14}/></button>
            </div>
            <div className="admin-modal-body" style={{maxHeight: '400px', overflowY: 'auto', padding: '0'}}>
              {[
                {title: 'New Booking #B1005', desc: 'Rahul booked Cricket for Aug 05', time: '10 mins ago', unread: true},
                {title: 'Payment Received', desc: '₹12,400 received via UPI', time: '1 hour ago', unread: true},
                {title: 'Cancellation Request', desc: 'Booking #B0988 was cancelled', time: 'Yesterday', unread: false},
              ].map((n, i) => (
                <div key={i} style={{padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', background: n.unread ? 'rgba(0,123,255,0.05)' : 'transparent'}}>
                  <div style={{width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#007bff' : 'transparent', marginTop: 5, flexShrink: 0}} />
                  <div>
                    <div style={{fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: '0.2rem'}}>{n.title}</div>
                    <div style={{fontSize: '0.75rem', color: '#aaa', marginBottom: '0.4rem'}}>{n.desc}</div>
                    <div style={{fontSize: '0.65rem', color: '#555'}}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn secondary" style={{width: '100%', justifyContent: 'center'}} onClick={close}>Mark All as Read</button>
            </div>
          </div>
        </div>
      );
    }

    if (modal.type === 'customer' || modal.type === 'admin') {
      const d = modal.data;
      const isCust = modal.type === 'customer';
      const fields = isCust
        ? [['Name',d.name],['Email',d.email],['Phone',d.phone],['Bookings',d.bookings],['Total Spent',`₹${d.spent?.toLocaleString()}`],['Joined',d.joined],['Status',d.status]]
        : [['Name',d.name],['Email',d.email],['Role',d.role],['Status',d.status],['Last Login',d.lastLogin]];
      
      return (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{isCust ? 'Customer Details' : 'Admin Details'}</h3>
              <button className="admin-modal-close" onClick={close}><XCircle size={14}/></button>
            </div>
            <div className="admin-modal-body">
              {fields.map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'0.55rem 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <span style={{fontSize:'0.78rem',color:'#555'}}>{k}</span>
                  <span style={{fontSize:'0.82rem',color:'#ddd',fontWeight:500}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn secondary" onClick={close}>Close</button>
              <button className="admin-action-btn primary" onClick={() => setModal({type: isCust?'editCustomer':'editAdmin', data:d})}>Edit Details</button>
            </div>
          </div>
        </div>
      );
    }

    if (modal.type === 'addAdmin' || modal.type === 'addCustomer' || modal.type === 'addSlot' || modal.type === 'editBooking' || modal.type === 'editCustomer' || modal.type === 'editAdmin') {
      const titles = { 
        addAdmin:'Add New Admin', addCustomer:'Add New Customer', addSlot:'Add New Slot',
        editBooking: 'Edit Booking', editCustomer: 'Edit Customer', editAdmin: 'Edit Admin'
      };
      return (
        <div className="admin-modal-overlay" onClick={e=>e.target===e.currentTarget&&close()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{titles[modal.type]}</h3>
              <button className="admin-modal-close" onClick={close}><XCircle size={14}/></button>
            </div>
            <div className="admin-modal-body">
              {modal.type === 'addAdmin' && (
                <div>
                  {[['Full Name','text'],['Email','email'],['Password','password']].map(([l,t])=>(
                    <div key={l} className="admin-form-group">
                      <label className="admin-form-label">{l}</label>
                      <input id={`addAdmin_${l}`} className="admin-form-input" type={t} placeholder={l}/>
                    </div>
                  ))}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Role</label>
                    <select id="addAdmin_Role" className="admin-form-input" style={{cursor:'pointer'}}>
                      <option>Sub Admin</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                </div>
              )}
              {modal.type === 'addCustomer' && (
                <div>
                  {['Full Name','Phone','Email'].map(l=>(
                    <div key={l} className="admin-form-group">
                      <label className="admin-form-label">{l}</label>
                      <input id={`addCust_${l}`} className="admin-form-input" type="text" placeholder={l}/>
                    </div>
                  ))}
                </div>
              )}
              {modal.type === 'addSlot' && (
                <div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sport</label>
                    <select className="admin-form-input" style={{cursor:'pointer'}}>
                      <option>Cricket</option><option>Volleyball</option><option>Pickleball</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Ground / Court</label>
                    <select className="admin-form-input" style={{cursor:'pointer'}}>
                      <option>Cricket Ground 1</option>
                      <option>Cricket Ground 2</option>
                      <option>Cricket Ground 3</option>
                      <option>Cricket Ground 4</option>
                      <option>Volleyball Court 1</option>
                      <option>Volleyball Court 2</option>
                      <option>Volleyball Court 3</option>
                      <option>Volleyball Court 4</option>
                      <option>Pickleball Court 1</option>
                      <option>Pickleball Court 2</option>
                      <option>Pickleball Court 3</option>
                      <option>Pickleball Court 4</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Date</label>
                    <input className="admin-form-input" type="date"/>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Start Time</label>
                    <select className="admin-form-input" style={{cursor:'pointer'}}>
                      {['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM'].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">End Time</label>
                    <select className="admin-form-input" style={{cursor:'pointer'}}>
                      {['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
              {modal.type === 'editCustomer' && (
                <div>
                  {[['Full Name', modal.data.name],['Phone', modal.data.phone],['Email', modal.data.email]].map(([l, v])=>(
                    <div key={l} className="admin-form-group">
                      <label className="admin-form-label">{l}</label>
                      <input className="admin-form-input" type="text" defaultValue={v}/>
                    </div>
                  ))}
                </div>
              )}
              {modal.type === 'editAdmin' && (
                <div>
                  {[['Full Name', modal.data.name],['Email', modal.data.email]].map(([l, v])=>(
                    <div key={l} className="admin-form-group">
                      <label className="admin-form-label">{l}</label>
                      <input className="admin-form-input" type="text" defaultValue={v}/>
                    </div>
                  ))}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Role</label>
                    <select className="admin-form-input" defaultValue={modal.data.role}>
                      <option>Sub Admin</option>
                      <option>Super Admin</option>
                    </select>
                  </div>
                </div>
              )}
              {modal.type === 'editBooking' && (
                <div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Sport</label>
                    <select className="admin-form-input" defaultValue={modal.data.sportLabel}>
                      <option>Box Cricket</option><option>Volleyball</option><option>Pickleball</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Date</label>
                    <input className="admin-form-input" type="text" defaultValue={modal.data.date}/>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Time Slot</label>
                    <input className="admin-form-input" type="text" defaultValue={modal.data.timeSlot}/>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Status</label>
                    <select className="admin-form-input" defaultValue={modal.data.status}>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn secondary" onClick={close}>Cancel</button>
              <button className="admin-action-btn primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ─── TOPBAR TITLES ────────────────────────────────────
  const topTitles = {
    dashboard:'Dashboard', slots:'Slot Management', bookings:'Bookings',
    customers:'Customers', payments:'Payments', analytics:'Analytics',
    settings:'Settings', admins:'Admin Users'
  };

  return (
    <div className="admin-page">
      {renderModal()}
      
      {isMobileSidebarOpen && (
        <div 
          className="admin-mobile-overlay" 
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 199, cursor: 'pointer'
          }}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside className={`admin-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-brand">
          <img src={logo} alt="Logo"/>
          <span className="admin-sidebar-brand-text">Infinity<br/>Sports Club</span>
        </div>

        <NavSection label="" items={sections.main}/>
        <NavSection label="Manage" items={sections.manage}/>
        <NavSection label="Reports" items={sections.reports}/>
        <NavSection label="Settings" items={sections.settings}/>

        <div className="admin-nav-section">
          <div className="admin-nav-item" onClick={() => setShowLogoutModal(true)}>
            <LogOut size={15}/> Logout
          </div>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-profile-card">
            <h4>Infinity Sport Club</h4>
            <p>Premium Sports Experience</p>
            <button onClick={() => setActiveSection('analytics')}>View Reports →</button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-toggle" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}>
              <Menu size={20} />
            </button>
            <button className="admin-action-btn secondary" onClick={() => navigate('/')} style={{marginRight: '0.75rem', padding: '0.4rem 0.6rem'}}>
              <ArrowLeft size={16} /> Back
            </button>
            <div>
              <h2>{topTitles[activeSection]}</h2>
              <p>Welcome back, Admin</p>
            </div>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-date-chip">
              <Calendar size={12}/> {fmtDate(today)} <ChevronDown size={12}/>
            </div>
            <div className="admin-bell-btn" onClick={() => setModal({type:'notif'})}>
              <Bell size={16}/>
              <div className="admin-bell-dot"/>
            </div>
            <div className="admin-user-chip">
              <div className="admin-avatar">AD</div>
              Admin <ChevronDown size={11}/>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {renderContent()}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal animate-fade-in" style={{maxWidth: '400px'}}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Confirm Logout</h3>
              <button className="admin-icon-btn danger" style={{padding: '0.35rem'}} onClick={() => setShowLogoutModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
              <p style={{color: '#888', fontSize: '0.9rem'}}>Are you sure you want to log out of the admin dashboard?</p>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-action-btn secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="admin-action-btn primary" style={{background: 'var(--admin-red)'}} onClick={() => navigate('/')}>Logout</button>
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
