// Small helpers shared by the booking popups and the trip views

// "October 20, 2026"
export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

// "9:30 AM"
export const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

// The backend reads booking dates as 'MM/DD/YYYY, HH24:MI:SS'
export const toApiDateTime = (date) => {
    const text = new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(date);
    // some browsers write midnight as 24:00
    return text.replace(', 24:', ', 00:');
}

// ... and trip dates as 'MM/DD/YYYY'
export const toApiDate = (date) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

export const startOfDay = (date) => {
    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    return day;
}

export const addDays = (date, days) => {
    const day = new Date(date);
    day.setDate(day.getDate() + days);
    return day;
}

// Whether this user may add or remove the trip's bookings now (the same rule as bookingEditProblem in Backend/auth.js):
// the customer until the trip is sent for approval, the agent once they have accepted it
export const canEditBookings = (trip, user) => {
    if(!user)
    {
        return false;
    }
    if(user.user_type === 'customer')
    {
        return trip.trip_status === 'REQUESTING' || trip.trip_status === 'UPDATING';
    }
    if(user.user_type === 'agent')
    {
        return trip.trip_status === 'UPDATING';
    }
    return false;
}

// Whether the trip's dates include every day from `from` to `to`
export const tripCovers = (trip, from, to) =>
    startOfDay(from) >= startOfDay(trip.departure_date) && startOfDay(to) <= startOfDay(trip.return_date);

// The message from a failed API response, or a fallback
export const errorMessage = async (response, fallback) => {
    try
    {
        const body = await response.json();
        return body.message || fallback;
    }
    catch
    {
        return fallback;
    }
}
