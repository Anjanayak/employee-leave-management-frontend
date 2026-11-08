
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';

import {
    getEmployees,
    getManagers,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    assignManager
} from '../services/adminService';

import { getErrorMessage } from '../services/api';

const emptyForm = {
    employeeName: '',
    email: '',
    designation: ''
};

export default function Employees() {
    const [rows, setRows] = useState([]);
    const [managers, setManagers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedManager, setSelectedManager] = useState('');

    // Load employees and managers
    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [employeeResponse, managerResponse] = await Promise.all([
                getEmployees(),
                getManagers()
            ]);

            setRows(
                Array.isArray(employeeResponse.data)
                    ? employeeResponse.data
                    : []
            );

            setManagers(
                Array.isArray(managerResponse.data)
                    ? managerResponse.data
                    : []
            );

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Handle form input
    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    // Reset employee form
    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
    };

    // Open add employee form
    const handleAdd = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(true);
        setSelectedEmployee(null);
        setMessage('');
        setError('');
    };

    // Open edit employee form
    const handleEdit = (employee) => {
        setForm({
            employeeName: employee.employeeName || '',
            email: employee.email || '',
            designation: employee.designation || ''
        });

        setEditingId(employee.employeeId);
        setShowForm(true);
        setSelectedEmployee(null);
        setMessage('');
        setError('');
    };

    // Create or update employee
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError('');
            setMessage('');

            if (editingId !== null) {
                await updateEmployee(editingId, form);
                setMessage('Employee updated successfully.');
            } else {
                await addEmployee(form);
                setMessage('Employee added successfully.');
            }

            resetForm();
            await loadData();

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    // Delete employee
    const handleDelete = async (employeeId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this employee?'
        );

        if (!confirmed) return;

        try {
            setError('');
            setMessage('');

            await deleteEmployee(employeeId);

            setMessage('Employee deleted successfully.');
            await loadData();

        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    // Open manager assignment form
    const openManagerAssignment = (employee) => {
        setSelectedEmployee(employee);

        setSelectedManager(
            employee.managerId
                ? String(employee.managerId)
                : ''
        );

        setShowForm(false);
        setError('');
        setMessage('');
    };

    // Assign manager using existing backend API
    const handleAssignManager = async (event) => {
        event.preventDefault();

        if (!selectedManager) {
            setError('Please select a manager.');
            return;
        }

        try {
            setSaving(true);
            setError('');
            setMessage('');

            await assignManager(
                selectedEmployee.employeeId,
                Number(selectedManager)
            );

            setMessage('Manager assigned successfully.');
            setSelectedEmployee(null);

            await loadData();

        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageHeader
                title="Employees"
                subtitle="Add, update and manage employees in your organization."
            />

            {error && (
                <div className="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="policy-message">
                    {message}
                </div>
            )}

            <div className="policy-card">

                {/* Employee heading */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap'
                }}>
                    <div>
                        <h3>Employee Management</h3>
                        <p>Total Employees: {rows.length}</p>
                    </div>

                    <button
                        type="button"
                        className="button button-primary"
                        onClick={handleAdd}
                    >
                        + Add Employee
                    </button>
                </div>

                {/* Add / Edit Employee Form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="holiday-form-card"
                        style={{ marginTop: '20px' }}
                    >
                        <h3>
                            {editingId !== null
                                ? 'Edit Employee'
                                : 'Add New Employee'}
                        </h3>

                        <label>
                            Employee Name
                            <input
                                type="text"
                                name="employeeName"
                                value={form.employeeName}
                                onChange={handleChange}
                                placeholder="Enter employee name"
                                maxLength="100"
                                required
                            />
                        </label>

                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                            />
                        </label>

                        <label>
                            Designation
                            <input
                                type="text"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="Example: Java Developer"
                                required
                            />
                        </label>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '15px'
                        }}>
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingId !== null
                                        ? 'Update Employee'
                                        : 'Save Employee'}
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

                {/* Assign Manager Form */}
                {selectedEmployee && (
                    <form
                        onSubmit={handleAssignManager}
                        className="holiday-form-card"
                        style={{ marginTop: '20px' }}
                    >
                        <h3>
                            Assign Manager to {selectedEmployee.employeeName}
                        </h3>

                        <label>
                            Select Manager

                            <select
                                value={selectedManager}
                                onChange={event =>
                                    setSelectedManager(event.target.value)
                                }
                                required
                            >
                                <option value="">
                                    Choose Manager
                                </option>

                                {managers.map(manager => (
                                    <option
                                        key={manager.managerId}
                                        value={manager.managerId}
                                    >
                                        {manager.managerName} (ID: {manager.managerId})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '15px'
                        }}>
                            <button
                                type="submit"
                                className="button button-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Assign Manager'}
                            </button>

                            <button
                                type="button"
                                className="button button-light"
                                onClick={() => setSelectedEmployee(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Employee Table */}
                {loading ? (
                    <p>Loading employees...</p>
                ) : (
                    <div className="policy-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Employee Name</th>
                                    <th>Email</th>
                                    <th>Designation</th>
                                    <th>Manager</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">
                                            No employees found.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map(employee => {
                                        const manager = managers.find(
                                            item =>
                                                Number(item.managerId) ===
                                                Number(employee.managerId)
                                        );

                                        return (
                                            <tr key={employee.employeeId}>
                                                <td>{employee.employeeId}</td>
                                                <td>{employee.employeeName}</td>
                                                <td>{employee.email}</td>
                                                <td>{employee.designation}</td>

                                                <td>
                                                    {manager
                                                        ? manager.managerName
                                                        : employee.managerId || 'Not assigned'}
                                                </td>

                                                <td>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '6px',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(employee)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => openManagerAssignment(employee)}
                                                        >
                                                            Assign Manager
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(employee.employeeId)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
