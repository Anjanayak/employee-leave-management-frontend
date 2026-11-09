
import { useEffect, useState } from 'react';
import {
    getLeaveTypes,
    addLeaveType,
    updateLeaveType,
    deleteLeaveType
} from '../services/adminService';
import { getErrorMessage } from '../services/api';

const emptyForm = {
    leaveTypeName: '',
    description: '',
    annualQuota: 0,
    allowNegativeBalance: false
};

export default function LeavePolicy() {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Load leave types from Admin backend
    const loadLeaveTypes = async () => {
        try {
            setLoading(true);
            const response = await getLeaveTypes();
            setLeaveTypes(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaveTypes();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value
        }));

        setMessage('');
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setMessage('');
    };

    // Add or update leave type
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.leaveTypeName.trim()) {
            setMessage('Please enter a leave type name.');
            return;
        }

        if (!Number.isInteger(Number(form.annualQuota)) ||
            Number(form.annualQuota) < 0) {
            setMessage('Please enter a valid annual quota.');
            return;
        }

        const duplicate = leaveTypes.some(
            item =>
                item.leaveTypeName.toLowerCase() ===
                    form.leaveTypeName.trim().toLowerCase() &&
                item.leaveTypeId !== editingId
        );

        if (duplicate) {
            setMessage('This leave type already exists.');
            return;
        }

        const requestData = {
            leaveTypeName: form.leaveTypeName.trim().toUpperCase(),
            description: form.description.trim(),
            annualQuota: Number(form.annualQuota),
            allowNegativeBalance: form.allowNegativeBalance
        };

        try {
            setLoading(true);
            setMessage('');

            if (editingId !== null) {
                await updateLeaveType(editingId, requestData);
                setMessage('Leave type updated successfully.');
            } else {
                await addLeaveType(requestData);
                setMessage('Leave type added successfully.');
            }

            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);

            await loadLeaveTypes();
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // Edit leave type
    const handleEdit = (leaveType) => {
        setForm({
            leaveTypeName: leaveType.leaveTypeName || '',
            description: leaveType.description || '',
            annualQuota: leaveType.annualQuota ?? 0,
            allowNegativeBalance: leaveType.allowNegativeBalance ?? false
        });

        setEditingId(leaveType.leaveTypeId);
        setShowForm(true);
        setMessage('');
    };

    // Delete leave type
    const handleDelete = async (leaveTypeId) => {
        if (!window.confirm('Are you sure you want to delete this leave type?')) {
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            await deleteLeaveType(leaveTypeId);
            setMessage('Leave type deleted successfully.');

            await loadLeaveTypes();
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const totalDays = leaveTypes.reduce(
        (total, item) => total + Number(item.annualQuota || 0),
        0
    );

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Leave Policy</h1>
                    <p>
                        Manage leave types and annual leave quotas for employees.
                    </p>
                </div>
            </div>

            <div className="policy-info">
                <h3>Employee Leave Configuration</h3>
                <p>
                    Create and manage different leave types, annual quotas
                    and negative balance permissions.
                </p>
            </div>

            <div className="policy-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <h3>Leave Types</h3>

                    <button
                        className="button button-primary"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        + Add Leave Type
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="holiday-form-card"
                        style={{ marginTop: '20px' }}
                    >
                        <h3>
                            {editingId !== null
                                ? 'Edit Leave Type'
                                : 'Add New Leave Type'}
                        </h3>

                        <label>
                            Leave Type Name
                            <input
                                type="text"
                                name="leaveTypeName"
                                placeholder="Example: CASUAL"
                                value={form.leaveTypeName}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Description
                            <textarea
                                name="description"
                                placeholder="Enter leave type description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </label>

                        <label>
                            Annual Quota (Days)
                            <input
                                type="number"
                                name="annualQuota"
                                min="0"
                                step="1"
                                value={form.annualQuota}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <input
                                type="checkbox"
                                name="allowNegativeBalance"
                                checked={form.allowNegativeBalance}
                                onChange={handleChange}
                            />
                            Allow Negative Leave Balance
                        </label>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Please wait...'
                                    : editingId !== null
                                        ? 'Update Leave Type'
                                        : 'Save Leave Type'}
                            </button>

                            <button
                                type="button"
                                className="button button-light"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {message && (
                    <div className="policy-message">
                        {message}
                    </div>
                )}

                {loading && <p>Loading leave types...</p>}

                <div className="policy-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Leave Type</th>
                                <th>Description</th>
                                <th>Annual Quota</th>
                                <th>Negative Balance</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {leaveTypes.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="6">
                                        No leave types found. Add your first leave type.
                                    </td>
                                </tr>
                            ) : (
                                leaveTypes.map(item => (
                                    <tr key={item.leaveTypeId}>
                                        <td>{item.leaveTypeId}</td>
                                        <td>
                                            <strong>{item.leaveTypeName}</strong>
                                        </td>
                                        <td>{item.description}</td>
                                        <td>{item.annualQuota} Days</td>
                                        <td>
                                            {item.allowNegativeBalance
                                                ? 'Allowed'
                                                : 'Not Allowed'}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(item.leaveTypeId)}
                                                style={{ marginLeft: '6px' }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="policy-total">
                    <span>Total Annual Leave Quota</span>
                    <strong>{totalDays} Days</strong>
                </div>
            </div>
        </>
    );
}
