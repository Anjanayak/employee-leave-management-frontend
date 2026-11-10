import { useAuth } from "../context/AuthContext";
import { managerApi } from "../services/managerApi";
export default function Profile(){
 const {managerName,logout}=useAuth();
 return <><div className="page-intro"><div><h2>My profile</h2><p>Manager workspace and session information.</p></div></div><div className="content-card profile-card"><div className="profile-hero"><span className="avatar profile-avatar">{managerName.slice(0,1).toUpperCase()}</span><div><h3>{managerName}</h3><span className="role-pill">MANAGER</span></div></div><div className="detail-list"><div><span>Manager ID</span><strong>{managerApi.managerId}</strong></div><div><span>API base URL</span><strong>{import.meta.env.VITE_API_BASE_URL||"http://localhost:8082"}</strong></div><div><span>Authentication</span><strong>Bearer token</strong></div></div><button className="btn btn-outline-danger mt-4" onClick={logout}><i className="bi bi-box-arrow-right me-2"/>Sign out</button></div></>;
}