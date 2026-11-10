import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useManager } from "../context/ManagerContext";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
export default function PendingLeaves(){
 const {pending,loading,error,refresh}=useManager(),[search,setSearch]=useState(""),[type,setType]=useState("ALL");
 const rows=useMemo(()=>pending.filter(x=>(`${x.employeeName} ${x.employeeId} ${x.leaveType}`).toLowerCase().includes(search.toLowerCase())&&(type==="ALL"||x.leaveType===type)),[pending,search,type]);
 const types=[...new Set(pending.map(x=>x.leaveType).filter(Boolean))];
 return <><div className="page-intro"><div><h2>Pending leave requests</h2><p>Review employee requests and record your decision.</p></div><button className="btn btn-outline-primary" onClick={refresh}><i className="bi bi-arrow-clockwise me-2"/>Refresh</button></div>
 {error&&<div className="alert alert-warning">{error}</div>}<div className="content-card"><div className="toolbar"><div className="search-box"><i className="bi bi-search"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search employee or leave type..."/></div><select className="form-select filter-select" value={type} onChange={e=>setType(e.target.value)}><option value="ALL">All leave types</option>{types.map(t=><option key={t}>{t}</option>)}</select><span className="result-count">{rows.length} requests</span></div>
 {loading?<div className="loading-line">Loading requests...</div>:rows.length===0?<EmptyState title="No matching requests" text="Try changing your search or filters."/>:<div className="table-responsive"><table className="table align-middle app-table"><thead><tr><th>EMPLOYEE</th><th>LEAVE TYPE</th><th>START DATE</th><th>END DATE</th><th>STATUS</th><th/></tr></thead><tbody>{rows.map(x=><tr key={x.leaveRequestId}><td><div className="employee-cell"><span className="avatar soft">{(x.employeeName||"U").slice(0,1)}</span><div><strong>{x.employeeName}</strong><small>ID: {x.employeeId}</small></div></div></td><td>{x.leaveType}</td><td>{x.startDate}</td><td>{x.endDate}</td><td><StatusBadge status={x.status}/></td><td><Link className="table-action" to={`/leaves/${x.leaveRequestId}`}>View details <i className="bi bi-arrow-right"/></Link></td></tr>)}</tbody></table></div>}</div></>;
}