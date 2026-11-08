
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { getDashboard } from '../services/adminService'
import { getErrorMessage } from '../services/api'

const cards = [
  ['totalEmployees', 'Total employees', 'People registered'],
  ['totalManagers', 'Total managers', 'Team leadership'],
  ['totalLeaveRequests', 'Leave requests', 'All request statuses'],
  ['approvedLeaves', 'Approved leaves', 'Approved by manager'],
  ['pendingLeaves', 'Pending leaves', 'Awaiting decision'],
  ['rejectedLeaves', 'Rejected leaves', 'Not approved'],
  ['cancelledLeaves', 'Cancelled leaves', 'Cancelled requests'],
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(response => setData(response.data))
      .catch(error => setError(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="A quick overview of your leave management workspace."
      />

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <div className="state-box">Loading dashboard...</div>
      ) : (
        <div className="stats-grid">
          {cards.map(([key, title, note]) => (
            <div className="stat-card" key={key}>
              <span>{title}</span>
              <strong>{data?.[key] ?? '—'}</strong>
              <small>{note}</small>
            </div>
          ))}
        </div>
      )}

      <div className="info-panel">
        <div>
          <span className="eyebrow">ADMIN WORKSPACE</span>
          <h2>Manage your workforce in one place</h2>
          <p>
            Use the navigation to review employees, managers,
            leave requests and audit activity.
          </p>
        </div>
        <div className="panel-symbol">✦</div>
      </div>
    </>
  )
}
