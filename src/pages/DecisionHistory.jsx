
import { useMemo, useState } from "react";
import { useManager } from "../context/ManagerContext";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

export default function DecisionHistory() {
  const { history, loading, error, refresh } = useManager();

  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Normalize backend response fields for display.
  const rows = useMemo(() => {
    const normalizedHistory = (history || []).map((x) => {
      const employeeName =
        x.employeeName ||
        x.employee?.name ||
        x.employee?.fullName ||
        "Unknown Employee";

      const employeeId =
        x.employeeId ??
        x.employee?.id ??
        x.employee?.employeeId ??
        null;

      const decision = (
        x.decision ||
        x.decisionType ||
        ""
      ).toUpperCase();

      const comment =
        x.rejectionReason ||
        x.reason ||
        x.comment ||
        "—";

      const decisionDate =
        x.decisionAt ||
        x.createdAt ||
        x.updatedAt ||
        null;

      return {
        ...x,
        employeeName,
        employeeId,
        decision,
        comment,
        decisionDate,
      };
    });

    return normalizedHistory.filter((x) => {
      const matchesFilter =
        filter === "ALL" || x.decision === filter;

      const searchText = `
        ${x.employeeName}
        ${x.employeeId ?? ""}
        ${x.leaveRequestId ?? ""}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase()
      );

      return matchesFilter && matchesSearch;
    });
  }, [history, filter, search]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "—";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString();
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Decision history</h2>
          <p>A record of the leave decisions you have made.</p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={refresh}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning">
          {error}
        </div>
      )}

      <div className="content-card">
        <div className="toolbar">
          <div className="search-box">
            <i className="bi bi-search" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee or request ID..."
            />
          </div>

          <select
            className="form-select filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All decisions</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <span className="result-count">
            {rows.length} records
          </span>
        </div>

        {loading ? (
          <div className="loading-line">
            Loading history...
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon="bi-clock-history"
            title="No decisions found"
            text="Your completed decisions will appear here."
          />
        ) : (
          <div className="table-responsive">
            <table className="table align-middle app-table">
              <thead>
                <tr>
                  <th>EMPLOYEE</th>
                  <th>REQUEST ID</th>
                  <th>DECISION</th>
                  <th>COMMENT</th>
                  <th>DATE</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((x, i) => (
                  <tr key={x.id || x.decisionId || i}>
                    <td>
                      <div className="employee-cell">
                        <span className="avatar soft">
                          {x.employeeName
                            .slice(0, 1)
                            .toUpperCase()}
                        </span>

                        <div>
                          <strong>{x.employeeName}</strong>

                          <small>
                            ID: {x.employeeId ?? "N/A"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      #{x.leaveRequestId ?? "N/A"}
                    </td>

                    <td>
                      <StatusBadge status={x.decision} />
                    </td>

                    <td className="comment-cell">
                      {x.comment}
                    </td>

                    <td>
                      {formatDate(x.decisionDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
