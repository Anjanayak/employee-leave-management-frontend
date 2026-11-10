
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { managerApi } from "../services/managerApi";

const ManagerContext = createContext(null);

const mockPending = [
  {
    leaveRequestId: 1001,
    employeeId: 501,
    employeeName: "Aarav Sharma",
    leaveType: "CASUAL",
    startDate: "2026-11-12",
    endDate: "2026-11-14",
    reason: "Family function",
    status: "PENDING"
  },
  {
    leaveRequestId: 1002,
    employeeId: 502,
    employeeName: "Priya Verma",
    leaveType: "SICK",
    startDate: "2026-11-13",
    endDate: "2026-11-13",
    reason: "Medical appointment",
    status: "PENDING"
  },
  {
    leaveRequestId: 1003,
    employeeId: 503,
    employeeName: "Rohan Patel",
    leaveType: "EARNED",
    startDate: "2026-11-17",
    endDate: "2026-11-20",
    reason: "Personal travel",
    status: "PENDING"
  }
];

const mockHistory = [
  {
    id: 9001,
    leaveRequestId: 991,
    employeeId: 510,
    employeeName: "Neha Gupta",
    decision: "APPROVED",
    reason: "Approved",
    createdAt: "2026-11-08T10:30:00"
  },
  {
    id: 9002,
    leaveRequestId: 992,
    employeeId: 511,
    employeeName: "Kabir Singh",
    decision: "REJECTED",
    reason: "Team coverage unavailable",
    createdAt: "2026-11-07T14:15:00"
  }
];

const mockNotifications = [
  {
    id: 7001,
    leaveRequestId: 991,
    employeeId: 510,
    message: "Your leave request has been approved.",
    notificationType: "IN_APP",
    notificationStatus: "SENT",
    isRead: false,
    createdAt: "2026-11-08T10:30:00",
    sentAt: "2026-11-08T10:30:01"
  },
  {
    id: 7002,
    leaveRequestId: 992,
    employeeId: 511,
    message: "Your leave request has been rejected.",
    notificationType: "EMAIL",
    notificationStatus: "FAILED",
    isRead: false,
    createdAt: "2026-11-07T14:15:00",
    sentAt: null
  }
];

const useMock = import.meta.env.VITE_USE_MOCK_DATA === "true";

export function ManagerProvider({ children }) {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (useMock) {
        setPending(mockPending);
        setHistory(mockHistory);
        setNotifications(mockNotifications);
      } else {
        const [p, h, n] = await Promise.all([
          managerApi.getPending(),
          managerApi.getHistory(),
          managerApi.getNotifications()
        ]);

        setPending(Array.isArray(p) ? p : []);
        setHistory(Array.isArray(h) ? h : []);
        setNotifications(Array.isArray(n) ? n : []);
      }
    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        "Unable to load manager data.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const decide = async (leave, decision, reason = "") => {
    setError("");

    const rejectionReason =
      decision === "REJECTED" ? reason.trim() : null;

    if (decision === "REJECTED" && !rejectionReason) {
      setError("Rejection reason is required.");
      throw new Error("Rejection reason is required.");
    }

    try {
      if (useMock) {
        setPending(old =>
          old.filter(
            x => x.leaveRequestId !== leave.leaveRequestId
          )
        );

        setHistory(old => [
          {
            id: Date.now(),
            leaveRequestId: leave.leaveRequestId,
            employeeId: leave.employeeId,
            employeeName: leave.employeeName,
            decision,
            reason: rejectionReason || "Approved",
            createdAt: new Date().toISOString()
          },
          ...old
        ]);

        return;
      }

      await managerApi.submitDecision({
        leaveRequestId: leave.leaveRequestId,
        managerId: managerApi.managerId,
        decision,
        rejectionReason
      });

      // Reload pending requests, history and actual notification logs.
      await refresh();

    } catch (e) {
      const message =
        e.response?.data?.message ||
        e.response?.data?.error ||
        e.message ||
        "Unable to process leave decision.";

      setError(message);
      throw e;
    }
  };

  const value = useMemo(
    () => ({
      pending,
      history,
      notifications,
      loading,
      error,
      refresh,
      decide
    }),
    [
      pending,
      history,
      notifications,
      loading,
      error,
      refresh
    ]
  );

  return (
    <ManagerContext.Provider value={value}>
      {children}
    </ManagerContext.Provider>
  );
}

export const useManager = () => useContext(ManagerContext);
