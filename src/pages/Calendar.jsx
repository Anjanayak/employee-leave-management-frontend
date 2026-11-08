
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import {
    getHolidays,
    addHoliday,
    updateHoliday,
    deleteHoliday
} from '../services/adminService';
import { getErrorMessage } from '../services/api';

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('HOLIDAY');
    const [showForm, setShowForm] = useState(false);
    const [holidayName, setHolidayName] = useState('');
    const [holidayDate, setHolidayDate] = useState('');
    const [holidays, setHolidays] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Load holidays using the common Axios service
    const loadHolidays = async () => {
        try {
            setLoading(true);
            setMessage('');

            const response = await getHolidays();
            setHolidays(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHolidays();
    }, []);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = currentDate.toLocaleString('default', {
        month: 'long'
    });

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const today = new Date();

    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0')
    ].join('-');

    const resetForm = () => {
        setHolidayName('');
        setHolidayDate('');
        setEditingId(null);
        setShowForm(false);
        setMessage('');
    };

    // Add or update holiday
    const handleSaveHoliday = async (event) => {
        event.preventDefault();

        if (!holidayName.trim() || !holidayDate) {
            setMessage('Please enter the holiday name and date.');
            return;
        }

        const duplicate = holidays.some(
            holiday =>
                holiday.holidayDate === holidayDate &&
                holiday.holidayId !== editingId
        );

        if (duplicate) {
            setMessage('A holiday already exists on this date.');
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            const requestBody = {
                holidayName: holidayName.trim(),
                holidayDate
            };

            if (editingId !== null) {
                await updateHoliday(editingId, requestBody);
            } else {
                await addHoliday(requestBody);
            }

            resetForm();
            await loadHolidays();

        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const handleEditHoliday = (holiday) => {
        setHolidayName(holiday.holidayName);
        setHolidayDate(holiday.holidayDate);
        setEditingId(holiday.holidayId);
        setShowForm(true);
        setMessage('');
    };

    const handleDeleteHoliday = async (holidayId) => {
        if (!window.confirm('Are you sure you want to delete this holiday?')) {
            return;
        }

        try {
            setLoading(true);
            setMessage('');

            await deleteHoliday(holidayId);
            await loadHolidays();

        } catch (error) {
            setMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageHeader
                title="Calendar"
                subtitle="Manage holidays and view employee leave schedules."
            />

            <div className="calendar-toolbar">
                <div className="calendar-tabs">
                    <button
                        className={view === 'HOLIDAY' ? 'selected' : ''}
                        onClick={() => setView('HOLIDAY')}
                    >
                        Holiday Calendar
                    </button>

                    <button
                        className={view === 'EMPLOYEE' ? 'selected' : ''}
                        onClick={() => setView('EMPLOYEE')}
                    >
                        Employee Leave Calendar
                    </button>
                </div>

                <div className="month-controls">
                    <button onClick={previousMonth}>Previous</button>
                    <strong>{monthName} {year}</strong>
                    <button onClick={nextMonth}>Next</button>
                </div>
            </div>

            {view === 'HOLIDAY' && (
                <div className="holiday-actions">
                    <button
                        className="button button-primary"
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                                setMessage('');
                            }
                        }}
                    >
                        {showForm ? 'Cancel' : '+ Add Holiday'}
                    </button>
                </div>
            )}

            {showForm && view === 'HOLIDAY' && (
                <div className="holiday-form-card">
                    <h3>
                        {editingId !== null ? 'Edit Holiday' : 'Add New Holiday'}
                    </h3>

                    <form onSubmit={handleSaveHoliday}>
                        <label>
                            Holiday Name
                            <input
                                type="text"
                                placeholder="Enter holiday name"
                                value={holidayName}
                                onChange={(event) =>
                                    setHolidayName(event.target.value)
                                }
                                required
                            />
                        </label>

                        <label>
                            Holiday Date
                            <input
                                type="date"
                                value={holidayDate}
                                onChange={(event) =>
                                    setHolidayDate(event.target.value)
                                }
                                required
                            />
                        </label>

                        {message && (
                            <p className="policy-message">{message}</p>
                        )}

                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={loading}
                        >
                            {loading
                                ? 'Please wait...'
                                : editingId !== null
                                    ? 'Update Holiday'
                                    : 'Save Holiday'}
                        </button>

                        <button
                            type="button"
                            className="button button-light"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {message && !showForm && (
                <p className="policy-message">{message}</p>
            )}

            {loading && <p>Loading holidays...</p>}

            <div className="calendar-card">
                <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        .map(day => (
                            <div className="calendar-heading" key={day}>
                                {day}
                            </div>
                        ))}

                    {Array.from({ length: firstDay }).map((_, index) => (
                        <div
                            className="calendar-day empty"
                            key={`empty-${index}`}
                        />
                    ))}

                    {Array.from({ length: daysInMonth }, (_, index) => {
                        const day = index + 1;

                        const dateString = [
                            year,
                            String(month + 1).padStart(2, '0'),
                            String(day).padStart(2, '0')
                        ].join('-');

                        const isToday = dateString === todayString;

                        const dayHolidays = holidays.filter(
                            holiday => holiday.holidayDate === dateString
                        );

                        return (
                            <div
                                className={`calendar-day
    ${isToday ? 'today' : ''}
    ${view === 'HOLIDAY' && dayHolidays.length > 0 ? 'has-holiday' : ''}`}
                                key={day}
                            >
                                <span>{day}</span>

                                {view === 'HOLIDAY' &&
                                    dayHolidays.map(holiday => (
                                        <div key={holiday.holidayId}>
                                            <div className="holiday-label">
                                                {holiday.holidayName}
                                            </div>

                                            <div className="holiday-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditHoliday(holiday)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteHoliday(holiday.holidayId)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-note">
                <strong>
                    {view === 'HOLIDAY'
                        ? 'Holiday Calendar'
                        : 'Employee Leave Calendar'}
                </strong>

                <p>
                    {view === 'HOLIDAY'
                        ? 'Holidays are loaded from the Admin Service.'
                        : 'Employee leave dates will appear here after connecting the leave API.'}
                </p>
            </div>
        </>
    );
}
