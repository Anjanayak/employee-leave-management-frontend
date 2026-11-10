
import { useState } from "react";

export default function DecisionModal({
    leave,
    onClose,
    onSubmit,
    busy = false
}) {
    const [decision, setDecision] = useState("APPROVED");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    if (!leave) return null;

    const submit = async (e) => {
        e.preventDefault();

        const trimmedReason = reason.trim();

        // Validate rejection reason
        if (decision === "REJECTED" && !trimmedReason) {
            setError("Please provide a reason for rejecting this leave request.");
            return;
        }

        setError("");

        try {
            await onSubmit(
                decision,
                decision === "REJECTED" ? trimmedReason : ""
            );
        } catch (err) {
            console.error("Decision submission failed:", err);
        }
    };

    const handleDecisionChange = (value) => {
        setDecision(value);
        setError("");
    };

    return (
        <div
            className="modal-backdrop-custom"
            role="presentation"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !busy) {
                    onClose();
                }
            }}
        >
            <div
                className="decision-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="decision-title"
            >
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <div className="eyebrow">
                            LEAVE REQUEST #{leave.leaveRequestId}
                        </div>
                        <h4 id="decision-title">Review request</h4>
                    </div>

                    <button
                        type="button"
                        className="icon-btn"
                        onClick={onClose}
                        disabled={busy}
                        aria-label="Close modal"
                    >
                        <i className="bi bi-x-lg" />
                    </button>
                </div>

                <div className="review-summary">
                    <strong>{leave.employeeName}</strong>

                    <span>
                        {leave.leaveType} · {leave.startDate} to {leave.endDate}
                    </span>

                    <p>{leave.reason}</p>
                </div>

                <form onSubmit={submit}>
                    <label className="form-label fw-semibold">
                        Your decision
                    </label>

                    <div className="decision-options">
                        <button
                            type="button"
                            className={`decision-option ${
                                decision === "APPROVED" ? "chosen approve" : ""
                            }`}
                            onClick={() => handleDecisionChange("APPROVED")}
                            disabled={busy}
                        >
                            <i className="bi bi-check-circle" /> Approve
                        </button>

                        <button
                            type="button"
                            className={`decision-option ${
                                decision === "REJECTED" ? "chosen reject" : ""
                            }`}
                            onClick={() => handleDecisionChange("REJECTED")}
                            disabled={busy}
                        >
                            <i className="bi bi-x-circle" /> Reject
                        </button>
                    </div>

                    <label className="form-label fw-semibold mt-3">
                        Comment / reason
                        {decision === "REJECTED" && (
                            <span className="text-danger"> *</span>
                        )}
                    </label>

                    <textarea
                        className="form-control"
                        rows="3"
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError("");
                        }}
                        placeholder={
                            decision === "REJECTED"
                                ? "Explain why this request is rejected..."
                                : "Optional note for this decision"
                        }
                        required={decision === "REJECTED"}
                        disabled={busy}
                    />

                    {error && (
                        <div className="text-danger small mt-2" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={onClose}
                            disabled={busy}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className={`btn ${
                                decision === "APPROVED"
                                    ? "btn-primary"
                                    : "btn-danger"
                            }`}
                            disabled={busy}
                        >
                            {busy
                                ? "Submitting..."
                                : `Confirm ${
                                      decision === "APPROVED"
                                          ? "approval"
                                          : "rejection"
                                  }`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
