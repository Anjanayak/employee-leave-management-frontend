
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import DataTable from '../components/DataTable'
import { getAuditLogs } from '../services/adminService'
import { getErrorMessage } from '../services/api'

export default function AuditLogs() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadAuditLogs() {
    setLoading(true)
    setError('')

    try {
      const response = await getAuditLogs()
      setRows(Array.isArray(response.data) ? response.data : [])
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditLogs()
  }, [])

  return (
    <>
      <PageHeader
        title="Audit logs"
        subtitle="Track administrator actions and changes across the system."
        action={
          <button
            className="button button-light"
            onClick={loadAuditLogs}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        }
      />

      {error && <div className="alert">{error}</div>}

      <div className="audit-table-wrapper">
        <DataTable
          loading={loading}
          rows={rows}
          columns={[
            { key: 'id', label: 'Log ID' },
            { key: 'action', label: 'Action' },
            { key: 'adminUserId', label: 'Admin ID' },
            { key: 'entityType', label: 'Entity' },
            { key: 'entityReference', label: 'Reference' },
            { key: 'oldValue', label: 'Old value' },
            { key: 'newValue', label: 'New value' },
            { key: 'reason', label: 'Reason' },
            {
              key: 'createdAt',
              label: 'Created at',
              render: row =>
                row.createdAt
                  ? new Date(row.createdAt).toLocaleString('en-IN')
                  : '—'
            }
          ]}
        />
      </div>
    </>
  )
}
