import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
export default function AppLayout(){
 const [menu,setMenu]=useState(false),{logout}=useAuth(),navigate=useNavigate();
 return <div className="app-shell"><div className={`sidebar-wrap ${menu?"show":""}`}><Sidebar onNavigate={()=>setMenu(false)}/></div>{menu&&<div className="mobile-scrim" onClick={()=>setMenu(false)}/>}<main className="main-area"><Topbar onMenu={()=>setMenu(!menu)}/><div className="page-content"><Outlet/></div><footer className="app-footer"><span>© {new Date().getFullYear()} ELMS</span><button onClick={()=>{logout();navigate("/login");}}>Sign out</button></footer></main></div>;
}