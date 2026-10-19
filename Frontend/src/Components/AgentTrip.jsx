import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import '../Styles/agent-trips.css';
import { useContext, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import Rating from '../Components/Rating';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import TripBookings from './TripBookings';
import { canEditBookings, errorMessage, hasNoBookings, tabStatus, tripLength } from './tripHelpers';
import { apiFetch, photoUrl } from '../api';

const categories = [
    { name: 'Requesting', status: 'REQUESTING', empty: 'No new requests. When a customer picks you for a trip, it shows up here.' },
    { name: 'Updating', status: 'UPDATING', empty: 'No trips to plan right now.' },
    { name: 'Pending', status: 'PENDING', empty: 'No trips waiting for an admin.' },
    { name: 'Confirmed', status: 'CONFIRMED', empty: 'No confirmed trips.' },
    { name: 'Completed', status: 'COMPLETED', empty: 'No completed trips yet.' },
];

// What the agent can do with a trip in each status
const statusHints = {
    REQUESTING: 'The customer asked you to plan this trip. Accept it to start adding bookings, or decline it.',
    UPDATING: 'Add bookings with "Book Now!" or "Add to Trip" on any hotel, restaurant, flight or destination page. The customer sends the trip for approval when it is ready.',
    PENDING: 'The customer sent the trip to an admin for approval. Its bookings can no longer be changed.',
    CONFIRMED: 'Approved by an admin.',
    COMPLETED: 'This trip is over.',
    DROPPED: 'This trip was dropped: its return date passed before an admin confirmed it.',
};

const customerName = (trip) => `${trip.first_name ?? ''} ${trip.last_name ?? ''}`.trim() || trip.username;

const money = (amount) => `৳ ${Number(amount).toLocaleString('en-US')}`;

// "Oct 21 – Oct 25, 2026"; both years when the trip runs into the next one, a single day for a day trip
const dateRange = (trip) => {
    const from = new Date(trip.departure_date);
    const to = new Date(trip.return_date);
    const short = (date, withYear) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(withYear ? { year: 'numeric' } : {}) });
    if(from.toDateString() === to.toDateString())
    {
        return short(to, true);
    }
    return `${short(from, from.getFullYear() !== to.getFullYear())} – ${short(to, true)}`;
}

// "1 destination · 2 restaurants", or null when there is nothing booked
const bookingSummary = (trip) => {
    const parts = [
        [trip.destinations.length, 'destination'],
        [trip.accommodations.length, 'accommodation'],
        [trip.restaurants.length, 'restaurant'],
        [trip.flights.length, 'flight'],
    ].filter(([count]) => count !== 0).map(([count, word]) => `${count} ${word}${count === 1 ? '' : 's'}`);
    return parts.length === 0 ? null : parts.join(' · ');
}

// An approved agent's trips, on their profile page
const AgentTrip = () => {
    const {userInfo, reloadTrips} = useContext(UserInfoContext);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [visitingTripId, setVisitingTripId] = useState(null);
    const [error, setError] = useState(null);

    const trips = userInfo.trips ?? [];
    const shownTrips = trips.filter(trip => tabStatus(trip) === categories[currentCategory].status);
    // looked up again on every render, so it always shows the trip as last loaded
    const visitingTrip = visitingTripId === null ? null : shownTrips.find(trip => trip.trip_id === visitingTripId) ?? null;

    const openTrip = (trip) => {
        setError(null);
        setVisitingTripId(trip.trip_id);
    }

    const backToList = () => {
        setVisitingTripId(null);
        setError(null);
    }

    // Sends a change, reloads the trips, and shows the server's message if it failed
    const run = async (request, fallback) => {
        setError(null);
        const response = await request();
        if(!response.ok)
        {
            setError(await errorMessage(response, fallback));
        }
        await reloadTrips();
        return response.ok;
    }

    const removeBooking = (type, booking) => run(() => type === 'destination' ?
        apiFetch(`http://localhost:3000/trip/delete-destination?tripDestinationId=${booking.trip_destination_id}`, { method: 'DELETE' }) :
        apiFetch(`http://localhost:3000/booking/delete-booking?bookingId=${booking.booking_id}`, { method: 'DELETE' }),
        'Could not remove the booking');

    // Accepting moves the trip to Updating; declining hands it back to the customer without an agent
    const agentDecision = async (trip, accept) => {
        const done = await run(() => apiFetch(`http://localhost:3000/trip/update-trip`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripStatus: "UPDATING", tripId: trip.trip_id, agentId: accept ? trip.agent_id : null })
        }), accept ? 'Could not accept the trip' : 'Could not decline the trip');

        if(done)
        {
            setVisitingTripId(null);
            if(accept)
            {
                setCurrentCategory(categories.findIndex(category => category.status === 'UPDATING'));
            }
        }
    }

    // Accept / Decline, on a requested trip's card and its page; on the card they don't open the trip
    const decisionButtons = (trip) => (
        <div className='agent-trip-decision'>
            <button className='agent-btn agent-btn-accept' onClick={(e) => { e.stopPropagation(); agentDecision(trip, true); }}>
                <TiTick/> Accept
            </button>
            <button className='agent-btn agent-btn-decline' onClick={(e) => { e.stopPropagation(); agentDecision(trip, false); }}>
                <RxCross2/> Decline
            </button>
        </div>
    );

    const errorLine = error && <p className='trip-form-error agent-trips-error'>{error}</p>;

    if(visitingTrip === null)
    {
        return (
        <div className='agent-trips'>
            <h2 className='agent-trips-heading'>My Trips</h2>
            <div className='agent-trips-tabs' role='tablist'>
                {categories.map((category, index) => {
                    const count = trips.filter(trip => tabStatus(trip) === category.status).length;
                    return (
                        <button key={category.name} role='tab' aria-selected={currentCategory === index}
                                className={'agent-trips-tab' + (currentCategory === index ? ' selected' : '')}
                                onClick={() => { setCurrentCategory(index); setError(null); }}>
                            {category.name}
                            {count !== 0 && <span className='agent-trips-count'>{count}</span>}
                        </button>
                    );
                })}
            </div>

            {errorLine}
            {shownTrips.length === 0 ?
                <div className='agent-trips-empty'>{categories[currentCategory].empty}</div>
            :
            <div className='agent-trips-grid'>
                {shownTrips.map((trip) =>
                    <div key={trip.trip_id} className='agent-trip-card' role='button' tabIndex={0}
                         onClick={() => openTrip(trip)} onKeyDown={(e) => { if(e.target === e.currentTarget && e.key === 'Enter') openTrip(trip); }}>
                        <div className='agent-trip-card-top'>
                            <h3>{trip.name}{trip.trip_status === 'DROPPED' && <span className='agent-trip-status status-dropped'>Dropped</span>}</h3>
                            <span className='agent-trip-cost'>{money(trip.total_cost)}</span>
                        </div>
                        <p className='agent-trip-line'>
                            <FaRegCalendarAlt/> {dateRange(trip)}
                            <span className='agent-trip-muted'>· {tripLength(trip)}</span>
                        </p>
                        <p className='agent-trip-line'>
                            <img className='agent-trip-avatar' src={photoUrl(trip.photo)} alt=''/>
                            {customerName(trip)} <span className='agent-trip-muted'>@{trip.username}</span>
                        </p>
                        <p className='agent-trip-bookings'>{bookingSummary(trip) ?? 'No bookings yet'}</p>
                        {trip.trip_status === 'REQUESTING' && decisionButtons(trip)}
                    </div>
                )}
            </div>}
        </div>);
    }

    const status = visitingTrip.trip_status;
    const canEdit = canEditBookings(visitingTrip, userInfo);
    return (
    <div className='agent-trips'>
        <button className='agent-trips-back' onClick={backToList}><IoArrowBack/> All trips</button>

        <div className='agent-trip-title'>
            <h2>{visitingTrip.name}</h2>
            <span className={`agent-trip-status status-${status.toLowerCase()}`}>{status === 'DROPPED' ? 'Dropped' : categories.find(category => category.status === status)?.name}</span>
            {status === 'REQUESTING' && decisionButtons(visitingTrip)}
        </div>

        <p className='trip-status-hint'>{statusHints[status]}</p>

        <div className='agent-trip-stats'>
            <div className='agent-trip-stat'>
                <span className='agent-trip-stat-label'>Dates</span>
                <span className='agent-trip-stat-value'>{dateRange(visitingTrip)}</span>
                <span className='agent-trip-stat-note'>{tripLength(visitingTrip)}</span>
            </div>
            <div className='agent-trip-stat'>
                <span className='agent-trip-stat-label'>Total cost</span>
                <span className='agent-trip-stat-value agent-trip-cost'>{money(visitingTrip.total_cost)}</span>
                <span className='agent-trip-stat-note'>
                    {Number(visitingTrip.discount) !== 0 ? `${visitingTrip.discount}% discount` : bookingSummary(visitingTrip) ?? 'Nothing booked yet'}
                </span>
            </div>
            <div className='agent-trip-stat'>
                <span className='agent-trip-stat-label'>Customer</span>
                <div className='agent-trip-person'>
                    <img src={photoUrl(visitingTrip.photo)} alt=''/>
                    <div className='agent-trip-person-text'>
                        <span className='agent-trip-stat-value'>{customerName(visitingTrip)}</span>
                        <span className='agent-trip-stat-note'>@{visitingTrip.username}</span>
                        <span className='agent-trip-stat-note' title={visitingTrip.email}>{visitingTrip.email}</span>
                    </div>
                </div>
            </div>
            {(status === 'CONFIRMED' || status === 'COMPLETED') &&
            <div className='agent-trip-stat'>
                <span className='agent-trip-stat-label'>Customer&apos;s rating</span>
                {Number(visitingTrip.rating) !== 0 ?
                    <Rating rating={Number(visitingTrip.rating)} isChanging={false} setRating={null}/> :
                    <span className='agent-trip-stat-note'>Not rated yet</span>}
            </div>}
        </div>

        {errorLine}

        <h3 className='agent-trip-section-title'>Bookings</h3>
        {hasNoBookings(visitingTrip) ?
            <div className='agent-trips-empty'>
                <p>Nothing booked yet.{canEdit && ' Open a place and use "Book Now!" or "Add to Trip".'}</p>
            </div>
        :
        <TripBookings trip={visitingTrip} canEdit={canEdit} onRemove={removeBooking}/>}
    </div>);
};

export default AgentTrip;
