import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import StatusPill from '../components/StatusPill'
import { getLeaves, downloadLeaveReport } from '../services/adminService'
import { getErrorMessage } from '../services/api'

export default function Leaves() {
  const [status, setStatus] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  async function load(filter = status) {
    setLoading(true); setError('')
    try { const r = await getLeaves(filter); setRows(Array.isArray(r.data) ? r.data : []) }
    catch (e) { setError(getErrorMessage(e)) }
    finally { setLoading(false) }
  }
  useEffect(() => { load('') }, [])
  return <><PageHeader title="Leave requests" subtitle="Review leave requests and their current statuses." action={<button className="button button-primary" onClick={() => downloadLeaveReport().catch(e => setError(getErrorMessage(e)))}>Download CSV</button>} />
    <div className="toolbar"><label className="filter-label">Filter by status<select value={status} onChange={e => {setStatus(e.target.value); load(e.target.value)}}><option value="">All statuses</option><option>PENDING</option><option>APPROVED</option><option>REJECTED</option><option>CANCELLED</option></select></label><button className="button button-light" onClick={() => load()}>Refresh</button></div>
    {error && <div className="alert">{error}</div>}
    <DataTable loading={loading} rows={rows} columns={[
      {key:'leaveId',label:'Leave ID'}, {key:'employeeId',label:'Employee ID'},
      {key:'employeeName',label:'Employee'}, {key:'leaveType',label:'Leave type'},
      {key:'startDate',label:'Start date'}, {key:'endDate',label:'End date'},
      {key:'reason',label:'Reason'}, {key:'status',label:'Status',render:r=><StatusPill value={r.status}/>}
    ]} /></>
}