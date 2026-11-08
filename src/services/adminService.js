
import api from './api'

// ================= DASHBOARD =================

export const getDashboard = () =>
    api.get('/api/admin/dashboard')


// ================= EMPLOYEE MANAGEMENT =================

export const getEmployees = () =>
    api.get('/api/admin/employees')

export const getEmployeeById = (employeeId) =>
    api.get(`/api/admin/employees/${employeeId}`)

export const addEmployee = (employeeData) =>
    api.post('/api/admin/employees', employeeData)

export const updateEmployee = (employeeId, employeeData) =>
    api.put(`/api/admin/employees/${employeeId}`, employeeData)

export const deleteEmployee = (employeeId) =>
    api.delete(`/api/admin/employees/${employeeId}`)

export const assignManager = (employeeId, managerId) =>
    api.put(
        `/api/admin/employees/${employeeId}/manager`,
        { managerId }
    )

export const getAssignedManager = (employeeId) =>
    api.get(`/api/admin/employees/${employeeId}/manager`)

export const getEmployeesByManager = (managerId) =>
    api.get(`/api/admin/managers/${managerId}/employees`)


// ================= MANAGER MANAGEMENT =================

export const getManagers = () =>
    api.get('/api/admin/managers')

export const addManager = (managerData) =>
    api.post('/api/admin/managers', managerData)

export const updateManager = (managerId, managerData) =>
    api.put(`/api/admin/managers/${managerId}`, managerData)

export const deleteManager = (managerId) =>
    api.delete(`/api/admin/managers/${managerId}`)


// ================= LEAVE REQUESTS =================

export const getLeaves = (status) =>
    api.get('/api/admin/leaves', {
        params: status ? { status } : {},
    })


// ================= HOLIDAY MANAGEMENT =================

export const getHolidays = () =>
    api.get('/api/admin/holidays')

export const addHoliday = (holidayData) =>
    api.post('/api/admin/holidays', holidayData)

export const updateHoliday = (holidayId, holidayData) =>
    api.put(`/api/admin/holidays/${holidayId}`, holidayData)

export const deleteHoliday = (holidayId) =>
    api.delete(`/api/admin/holidays/${holidayId}`)


// ================= LEAVE TYPE MANAGEMENT =================

export const getLeaveTypes = () =>
    api.get('/api/admin/leave-types')

export const addLeaveType = (leaveTypeData) =>
    api.post('/api/admin/leave-types', leaveTypeData)

export const updateLeaveType = (leaveTypeId, leaveTypeData) =>
    api.put(`/api/admin/leave-types/${leaveTypeId}`, leaveTypeData)

export const deleteLeaveType = (leaveTypeId) =>
    api.delete(`/api/admin/leave-types/${leaveTypeId}`)


// ================= LEAVE ALLOCATION =================

export const getLeaveAllocations = () =>
    api.get('/api/admin/leave-allocations')

export const allocateLeave = (allocationData) =>
    api.post('/api/admin/leave-allocations', allocationData)

export const getEmployeeAllocations = (employeeId) =>
    api.get(`/api/admin/leave-allocations/employee/${employeeId}`)

export const getYearAllocations = (year) =>
    api.get(`/api/admin/leave-allocations/year/${year}`)


// ================= AUDIT LOGS =================

export const getAuditLogs = () =>
    api.get('/api/admin/audit-logs')


// ================= CSV REPORT =================

export async function downloadLeaveReport() {
    const response = await api.get(
        '/api/admin/reports/leaves',
        { responseType: 'blob' }
    )

    const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'text/csv' })
    )

    const link = document.createElement('a')

    link.href = url
    link.download = 'leave-report.csv'

    document.body.appendChild(link)
    link.click()
    link.remove()

    window.URL.revokeObjectURL(url)
}
