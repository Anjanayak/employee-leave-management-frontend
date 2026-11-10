import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const titles={"/":"Dashboard","/pending-leaves":"Pending Requests","/decision-history":"Decision History","/notifications":"Notifications","/profile":"My Profile"};
export default function Topbar({onMenu}) {
 const location=useLocation(), navigate=useNavigate(), {managerName}=useAuth();
 const title=location.pathname.startsWith("/leaves/")?"Leave Details":titles[location.pathname]||"Manager Workspace";
 return <header className="topbar"><div className="d-flex align-items-center gap-3"><button className="icon-btn mobile-menu" onClick={onMenu}><i className="bi bi-list"/></button><div><div className="eyebrow">MANAGER PORTAL</div><h1>{title}</h1></div></div>
 <div className="top-actions"><button className="icon-btn" title="Notifications" onClick={()=>navigate("/notifications")}><i className="bi bi-bell"/></button><button className="profile-chip" onClick={()=>navigate("/profile")}><span className="avatar">{managerName.slice(0,1).toUpperCase()}</span><span className="d-none d-sm-block">{managerName}</span><i className="bi bi-chevron-down small"/></button></div></header>;
}