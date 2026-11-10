import { NavLink } from "react-router-dom";
const links=[
 ["/","bi-grid-1x2","Dashboard"],
 ["/pending-leaves","bi-calendar2-check","Pending Requests"],
 ["/decision-history","bi-clock-history","Decision History"],
 ["/notifications","bi-bell","Notifications"]
];
export default function Sidebar({onNavigate}) {
 return <aside className="sidebar">
   <div className="brand"><div className="brand-mark">E</div><div><strong>ELMS</strong><small>Manager workspace</small></div></div>
   <div className="nav-caption">WORKSPACE</div>
   <nav className="nav flex-column">{links.map(([to,icon,label])=><NavLink key={to} to={to} end={to==="/"} onClick={onNavigate} className={({isActive})=>`side-link ${isActive?"active":""}`}><i className={`bi ${icon}`}/><span>{label}</span></NavLink>)}</nav>
   <div className="sidebar-bottom"><div className="help-card"><i className="bi bi-headset"/><strong>Need help?</strong><span>Contact your system administrator.</span></div><div className="sidebar-foot">Employee Leave Management System</div></div>
 </aside>;
}