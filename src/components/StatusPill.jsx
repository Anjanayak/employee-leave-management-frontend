export default function StatusPill({ value }) {
  const status = String(value || 'UNKNOWN').toUpperCase()
  return <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>
}