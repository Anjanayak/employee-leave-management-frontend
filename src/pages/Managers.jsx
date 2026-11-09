
import { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import {
    getManagers,
    addManager,
    updateManager,
    deleteManager,
    getEmployeesByManager
} from '../services/adminService'
import { getErrorMessage } from '../services/api'

export default function Managers() {
    const [rows, setRows] = useState([])
    const [employees, setEmployees] = useState([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [selectedManager, setSelectedManager] = useState(null)

    const [form, setForm] = useState({
        managerName: '',
        email: '',
        designation: ''
    })

    // ================= LOAD MANAGERS =================

    const loadManagers = async () => {
        try {
            setLoading(true)
            setError('')

            const response = await getManagers()

            setRows(
                Array.isArray(response.data)
                    ? response.data
                    : []
            )
        } catch (e) {
            setError(getErrorMessage(e))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadManagers()
    }, [])

    // ================= FORM HANDLING =================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const openAddForm = () => {
        setEditingId(null)

        setForm({
            managerName: '',
            email: '',
            designation: ''
        })

        setError('')
        setMessage('')
        setShowForm(true)
    }

    const openEditForm = (manager) => {
        setEditingId(manager.managerId)

        setForm({
            managerName: manager.managerName || '',
            email: manager.email || '',
            designation: manager.designation || ''
        })

        setError('')
        setMessage('')
        setShowForm(true)
    }

    // ================= ADD / UPDATE MANAGER =================

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setError('')
            setMessage('')

            if (editingId !== null) {
                await updateManager(editingId, form)
                setMessage('Manager updated successfully.')
            } else {
                await addManager(form)
                setMessage('Manager added successfully.')
            }

            setShowForm(false)
            setEditingId(null)

            await loadManagers()
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    // ================= DELETE MANAGER =================

    const handleDelete = async (managerId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this manager?'
        )

        if (!confirmed) return

        try {
            setError('')
            setMessage('')

            await deleteManager(managerId)

            setMessage('Manager deleted successfully.')

            if (selectedManager === managerId) {
                setSelectedManager(null)
                setEmployees([])
            }

            await loadManagers()
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    // ================= VIEW EMPLOYEES =================

    const handleViewEmployees = async (managerId) => {
        try {
            setError('')
            setMessage('')

            const response = await getEmployeesByManager(managerId)

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            )

            setSelectedManager(managerId)
        } catch (e) {
            setError(getErrorMessage(e))
        }
    }

    // ================= UI =================

    return (
        <>
            <PageHeader
                title="Managers"
                subtitle="Add, update and manage managers in your organization."
            />

            {error && (
                <div className="alert">
                    {error}
                </div>
            )}

            {message && (
                <div className="alert">
                    {message}
                </div>
            )}

            <div className="card">

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <div>
                        <h2>Manager Management</h2>
                        <p>Total Managers: {rows.length}</p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={openAddForm}
                    >
                        + Add Manager
                    </button>
                </div>

                {/* ADD / EDIT FORM */}

                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="card"
                        style={{ marginBottom: '20px' }}
                    >
                        <h3>
                            {editingId !== null
                                ? 'Update Manager'
                                : 'Add New Manager'}
                        </h3>

                        <div className="form-grid">

                            <div>
                                <label>Manager Name</label>
                                <input
                                    type="text"
                                    name="managerName"
                                    value={form.managerName}
                                    onChange={handleChange}
                                    placeholder="Enter manager name"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>

                            <div>
                                <label>Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    placeholder="Enter designation"
                                    required
                                />
                            </div>

                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '16px'
                        }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingId !== null
                                    ? 'Update Manager'
                                    : 'Save Manager'}
                            </button>

                            <button
                                type="button"
                                className="btn"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* MANAGER TABLE */}

                {loading ? (
                    <p>Loading managers...</p>
                ) : rows.length === 0 ? (
                    <p>No managers found.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Manager ID</th>
                                    <th>Manager Name</th>
                                    <th>Email</th>
                                    <th>Designation</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {rows.map(manager => (
                                    <tr key={manager.managerId}>
                                        <td>{manager.managerId}</td>
                                        <td>{manager.managerName}</td>
                                        <td>{manager.email}</td>
                                        <td>{manager.designation}</td>

                                        <td>
                                            <div style={{
                                                display: 'flex',
                                                gap: '8px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <button
                                                    className="btn"
                                                    onClick={() => openEditForm(manager)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        handleViewEmployees(manager.managerId)
                                                    }
                                                >
                                                    View Employees
                                                </button>

                                                <button
                                                    className="btn"
                                                    onClick={() =>
                                                        handleDelete(manager.managerId)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* EMPLOYEES UNDER MANAGER */}

            {selectedManager !== null && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <h2>
                        Employees Under Manager #{selectedManager}
                    </h2>

                    {employees.length === 0 ? (
                        <p>No employees are assigned to this manager.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Email</th>
                                        <th>Designation</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {employees.map(employee => (
                                        <tr key={employee.employeeId}>
                                            <td>{employee.employeeId}</td>
                                            <td>{employee.employeeName}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.designation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
