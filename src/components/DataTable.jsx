
export default function DataTable({
  columns,
  rows,
  loading,
  emptyText = 'No records found.'
}) {
  if (loading) {
    return <div className="state-box">Loading records...</div>
  }

  if (!rows?.length) {
    return <div className="state-box">{emptyText}</div>
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className={`cell-${column.key}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={
                row.id ??
                row.leaveId ??
                row.employeeId ??
                row.managerId ??
                index
              }
            >
              {columns.map(column => (
                <td
                  key={column.key}
                  className={`cell-${column.key}`}
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
