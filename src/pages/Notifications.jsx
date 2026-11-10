
import { useManager } from "../context/ManagerContext";
import EmptyState from "../components/EmptyState";

export default function Notifications() {
  const { notifications, loading, error } = useManager();

  const getStatusColor = (status) => {
    switch (status) {
      case "SENT":
        return "success";
      case "FAILED":
        return "danger";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "Not available"
      : parsed.toLocaleString();
  };

  return (
    <>
      <div className="page-intro">
        <div>
          <h2>Notifications & activity</h2>
          <p>
            Actual email and in-app notification delivery records.
          </p>
        </div>
      </div>

      <div className="content-card activity-card">
        <div className="section-heading">
          <div>
            <h3>Notification delivery history</h3>
            <p>
              Track the delivery status of employee notifications.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="bi-bell"
            title="No notifications found"
            text="Notification records will appear here after a leave decision is processed."
          />
        ) : (
          <div className="activity-list">
            {notifications.map((item) => (
              <div className="activity-item" key={item.id}>
                <div className="activity-icon">
                  <i
                    className={`bi ${
                      item.notificationStatus === "SENT"
                        ? "bi-check-circle"
                        : item.notificationStatus === "FAILED"
                        ? "bi-x-circle"
                        : "bi-clock"
                    }`}
                  />
                </div>

                <div className="activity-copy">
                  <strong>
                    Leave request #{item.leaveRequestId}
                  </strong>

                  <p>
                    {item.message || "No notification message available"}
                  </p>

                  <small>
                    Employee ID: {item.employeeId} ·
                    {" "}{item.notificationType}
                  </small>

                  {item.errorMessage && (
                    <p className="text-danger mt-1 mb-0">
                      Error: {item.errorMessage}
                    </p>
                  )}

                  <small className="d-block mt-1">
                    Created: {formatDate(item.createdAt)}
                    {item.sentAt &&
                      ` · Sent: ${formatDate(item.sentAt)}`}
                  </small>
                </div>

                <span
                  className={`badge text-bg-${getStatusColor(
                    item.notificationStatus
                  )}`}
                >
                  {item.notificationStatus || "UNKNOWN"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
