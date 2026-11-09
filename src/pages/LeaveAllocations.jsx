
import { useEffect, useMemo, useState } from 'react';
import {
    getEmployees,
    getLeaveTypes,
    getLeaveAllocations,
    getEmployeeAllocations,
    getYearAllocations,
    allocateLeave
} from '../services/adminService';
import { getErrorMessage } from '../services/api';

export default function LeaveAllocations() {
    const [employees, setEmployees] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [allocations, setAllocations] = useState([]);

    const [employeeId, setEmployeeId] = useState('');
    const [leaveTypeId, setLeaveTypeId] = useState('');
    const [totalDays, setTotalDays] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());

    const [filterEmployee, setFilterEmployee] = useState('');
    const [filterYear, setFilterYear] = useState(String(new Date().getFullYear()));

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setLoading(true);
            const [employeeResponse, leaveTypeResponse, allocationResponse] =
                await Promise.all([
                    getEmployees(),
                    getLeaveTypes(),
                    getLeaveAllocations()
                ]);

            setEmployees(employeeResponse.data || []);
            setLeaveTypes(leaveTypeResponse.data || []);
            setAllocations(allocationResponse.data || []);
        } catch (error) {
            showMessage(getErrorMessage(error), 'error');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (text, type = 'success') => {
        setMessage(text);
        setMessageType(type);
    };

    const refreshAllocations = async () => {
        try {
            let response;

            if (filterEmployee) {
                response = await getEmployeeAllocations(filterEmployee);
            } else if (filterYear) {
                response = await getYearAllocations(filterYear);
            } else {
                response = await getLeaveAllocations();
            }

            let result = response.data || [];

            if (filterYear) {
                result = result.filter(
                    item => Number(item.year) === Number(filterYear)
                );
            }

            setAllocations(result);
        } catch (error) {
            showMessage(getErrorMessage(error), 'error');
        }
    };

    const handleAllocate = async (event) => {
        event.preventDefault();

        if (!employeeId || !leaveTypeId || !totalDays || !year) {
            showMessage('Please fill in all allocation fields.', 'error');
            return;
        }

        if (!Number.isInteger(Number(totalDays)) || Number(totalDays) <= 0) {
            showMessage('Allocated days must be a positive whole number.', 'error');
            return;
        }

        const duplicate = allocations.some(
            item =>
                Number(item.employeeId) === Number(employeeId) &&
                Number(item.leaveTypeId) === Number(leaveTypeId) &&
                Number(item.year) === Number(year)
        );

        if (duplicate) {
            showMessage(
                'This employee already has an allocation for this leave type and year.',
                'error'
            );
            return;
        }

        const requestData = {
            employeeId: Number(employeeId),
            leaveTypeId: Number(leaveTypeId),
            totalAllocatedDays: Number(totalDays),
            usedDays: 0,
            remainingDays: Number(totalDays),
            year: Number(year)
        };

        try {
            setLoading(true);
            setMessage('');

            await allocateLeave(requestData);

            showMessage('Leave allocated successfully!', 'success');

            setEmployeeId('');
            setLeaveTypeId('');
            setTotalDays('');
            setYear(new Date().getFullYear());

            await refreshAllocations();
        } catch (error) {
            showMessage(getErrorMessage(error), 'error');
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeName = (id) => {
        const employee = employees.find(
            item => Number(item.employeeId) === Number(id)
        );

        return employee
            ? employee.employeeName
            : `Employee ${id}`;
    };

    const getLeaveTypeName = (id) => {
        const leaveType = leaveTypes.find(
            item => Number(item.leaveTypeId) === Number(id)
        );

        return leaveType
            ? leaveType.leaveTypeName
            : `Leave Type ${id}`;
    };

    const displayedAllocations = useMemo(() => {
        return allocations.filter(item => {
            const matchesEmployee =
                !filterEmployee ||
                Number(item.employeeId) === Number(filterEmployee);

            const matchesYear =
                !filterYear ||
                Number(item.year) === Number(filterYear);

            return matchesEmployee && matchesYear;
        });
    }, [allocations, filterEmployee, filterYear]);

    const totalAllocated = displayedAllocations.reduce(
        (sum, item) => sum + Number(item.totalAllocatedDays || 0),
        0
    );

    const totalUsed = displayedAllocations.reduce(
        (sum, item) => sum + Number(item.usedDays || 0),
        0
    );

    const totalRemaining = displayedAllocations.reduce(
        (sum, item) => sum + Number(item.remainingDays || 0),
        0
    );

    return (
        <>
            <div className="page-header">
                <div>
                    <h1>Leave Allocation</h1>
                    <p>
                        Allocate annual leave balances to employees and
                        monitor their remaining leave.
                    </p>
                </div>
            </div>

            <div className="policy-info">
                <h3>Employee Leave Allocation</h3>
                <p>
                    Select an employee and leave type, then configure
                    the number of leave days for the selected year.
                </p>
            </div>

            <div className="policy-card">
                <h3>Allocate Leave</h3>

                <form onSubmit={handleAllocate}>
                    <div className="allocation-form-grid">
                        <label>
                            Select Employee
                            <select
                                value={employeeId}
                                onChange={event => setEmployeeId(event.target.value)}
                                required
                            >
                                <option value="">Choose Employee</option>
                                {employees.map(employee => (
                                    <option
                                        key={employee.employeeId}
                                        value={employee.employeeId}
                                    >
                                        {employee.employeeName} (ID: {employee.employeeId})
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Select Leave Type
                            <select
                                value={leaveTypeId}
                                onChange={event => setLeaveTypeId(event.target.value)}
                                required
                            >
                                <option value="">Choose Leave Type</option>
                                {leaveTypes.map(type => (
                                    <option
                                        key={type.leaveTypeId}
                                        value={type.leaveTypeId}
                                    >
                                        {type.leaveTypeName} ({type.annualQuota} days)
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Total Allocated Days
                            <input
                                type="number"
                                min="1"
                                step="1"
                                placeholder="Enter number of days"
                                value={totalDays}
                                onChange={event => setTotalDays(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Allocation Year
                            <input
                                type="number"
                                min="2020"
                                max="2100"
                                value={year}
                                onChange={event => setYear(event.target.value)}
                                required
                            />
                        </label>
                    </div>

                    {message && (
                        <p className="policy-message">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="button button-primary"
                        disabled={loading}
                    >
                        {loading ? 'Please wait...' : 'Allocate Leave'}
                    </button>
                </form>
            </div>

            <div className="allocation-summary">
                <div className="policy-card">
                    <span>Total Allocated</span>
                    <h2>{totalAllocated}</h2>
                    <small>Days</small>
                </div>

                <div className="policy-card">
                    <span>Used Leave</span>
                    <h2>{totalUsed}</h2>
                    <small>Days</small>
                </div>

                <div className="policy-card">
                    <span>Remaining Leave</span>
                    <h2>{totalRemaining}</h2>
                    <small>Days</small>
                </div>
            </div>

            <div className="policy-card">
                <h3>Employee Leave Balances</h3>

                <div className="allocation-filters">
                    <label>
                        Filter by Employee
                        <select
                            value={filterEmployee}
                            onChange={event => setFilterEmployee(event.target.value)}
                        >
                            <option value="">All Employees</option>
                            {employees.map(employee => (
                                <option
                                    key={employee.employeeId}
                                    value={employee.employeeId}
                                >
                                    {employee.employeeName}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Filter by Year
                        <input
                            type="number"
                            value={filterYear}
                            onChange={event => setFilterYear(event.target.value)}
                        />
                    </label>

                    <button
                        type="button"
                        className="button button-light"
                        onClick={refreshAllocations}
                    >
                        Refresh
                    </button>
                </div>

                {loading && <p>Loading allocations...</p>}

                <div className="policy-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Allocation ID</th>
                                <th>Employee</th>
                                <th>Leave Type</th>
                                <th>Total Days</th>
                                <th>Used Days</th>
                                <th>Remaining Days</th>
                                <th>Year</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayedAllocations.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        No leave allocations found.
                                    </td>
                                </tr>
                            ) : (
                                displayedAllocations.map(item => (
                                    <tr key={item.allocationId}>
                                        <td>{item.allocationId}</td>
                                        <td>
                                            {getEmployeeName(item.employeeId)}
                                        </td>
                                        <td>
                                            {getLeaveTypeName(item.leaveTypeId)}
                                        </td>
                                        <td>{item.totalAllocatedDays}</td>
                                        <td>{item.usedDays}</td>
                                        <td>
                                            <strong>{item.remainingDays}</strong>
                                        </td>
                                        <td>{item.year}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
