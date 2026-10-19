import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import '../Styles/my-trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaPlus, FaRegCalendarAlt, FaUserTie } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import CreateTrip from '../Components/CreateTrip';
import AgentSearch from '../Components/AgentSearch';
import AgentProfile from '../Components/AgentProfile';
import TripBookings from '../Components/TripBookings';
import { bookingSummary, canEditBookings, dateRange, errorMessage, hasNoBookings, money, tabStatus, tripLength } from '../Components/tripHelpers';
import { apiFetch, photoUrl } from '../api';

// The tabs of My Trips; "Suggested" holds other customers' completed trips, as ideas
const categories = [
    { name: 'Requesting', status: 'REQUESTING', empty: 'No trips waiting for an agent. Create a trip to start planning.' },
    { name: 'Updating', status: 'UPDATING', empty: 'No trips being planned with an agent right now.' },
    { name: 'Pending', status: 'PENDING', empty: 'No trips waiting for an admin.' },
    { name: 'Confirmed', status: 'CONFIRMED', empty: 'No confirmed trips yet.' },
    { name: 'Completed', status: 'COMPLETED', empty: 'No finished trips yet.' },
    { name: 'Suggested', empty: 'No completed trips to suggest yet.' },
];

const statusNames = { REQUESTING: 'Requesting', UPDATING: 'Updating', PENDING: 'Pending', CONFIRMED: 'Confirmed', COMPLETED: 'Completed', DROPPED: 'Dropped' };

const statusPill = (trip) => <span className={`my-trip-status status-${trip.trip_status.toLowerCase()}`}>{statusNames[trip.trip_status]}</span>;

// A customer's trips (opened from My Trips in the navbar)
const Trips = (props) => {
    const {setShowTrips} = props;
    const {userInfo, reloadTrips} = useContext(UserInfoContext);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [visitingTripId, setVisitingTripId] = useState(null);
    const [suggestedTrips, setSuggestedTrips] = useState([]);
    const [createTrip, setCreateTrip] = useState(false);
    const [showAgentSearch, setShowAgentSearch] = useState(false);
    const [pickedAgent, setPickedAgent] = useState(undefined);
    const [visitingAgent, setVisitingAgent] = useState(undefined);
    const [error, setError] = useState(null);

    useEffect(() => {
        let ignore = false;
        apiFetch(`http://localhost:3000/trip/fetch-complete-trips`, { method: 'GET' })
            .then(response => response.ok ? response.json() : [])
            .then(trips => { if(!ignore) setSuggestedTrips(trips); });
        return () => { ignore = true; };
    }, []);

    const isSuggested = categories[currentCategory].status === undefined;
    const ownTrips = userInfo.trips ?? [];
    const shownTrips = isSuggested ? suggestedTrips : ownTrips.filter(trip => tabStatus(trip) === categories[currentCategory].status);
    // looked up again on every render, so it always shows the trip as last loaded
    const visitingTrip = visitingTripId === null ? null : shownTrips.find(trip => trip.trip_id === visitingTripId) ?? null;

    const openTrip = (trip) => {
        setError(null);
        setShowAgentSearch(false);
        setPickedAgent(undefined);
        setVisitingTripId(trip.trip_id);
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

    const deleteTrip = async (trip) => {
        if(!window.confirm(`Delete the trip "${trip.name}" and all its bookings?`))
        {
            return;
        }
        if(await run(() => apiFetch(`http://localhost:3000/trip/delete-trip?tripId=${trip.trip_id}`, { method: 'DELETE' }), 'Could not delete the trip'))
        {
            setVisitingTripId(null);
        }
    }

    const sendForApproval = async (trip) => {
        const sent = await run(() => apiFetch(`http://localhost:3000/trip/update-trip-status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripStatus: "PENDING", tripId: trip.trip_id })
        }), 'Could not send the trip for approval');
        if(sent)
        {
            // follow the trip to its new tab
            setCurrentCategory(categories.findIndex(category => category.status === 'PENDING'));
        }
    }

    const setAgent = async (trip) => {
        const saved = await run(() => apiFetch(`http://localhost:3000/trip/update-agent`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tripId: trip.trip_id, agentId: pickedAgent.user_id })
        }), 'Could not set the agent');
        if(saved)
        {
            setShowAgentSearch(false);
            setPickedAgent(undefined);
        }
    }

    const visitAgentProfile = async (agentId) => {
        const response = await apiFetch(`http://localhost:3000/agent/fetch/${agentId}`, { method: 'GET' });
        if(response.ok)
        {
            setVisitingAgent(await response.json());
        }
    }

    if(visitingAgent)
    {
        return <AgentProfile agent={visitingAgent} setShowAgentProfile={() => setVisitingAgent(undefined)}/>;
    }

    const backToList = () => {
        setVisitingTripId(null);
        setError(null);
    }

    const errorLine = error && <p className='trip-form-error my-trips-error'>{error}</p>;

    const tripList = () => (
        <>
            <div className='my-trips-header'>
                <h2>My Trips</h2>
                <button className='my-trips-btn my-trips-btn-primary' onClick={()=>setCreateTrip(true)}><FaPlus/> Create a new trip</button>
            </div>
            <div className='my-trips-tabs' role='tablist'>
                {categories.map((category, index) => {
                    const count = category.status === undefined ? 0 : ownTrips.filter(trip => tabStatus(trip) === category.status).length;
                    return (
                        <button key={category.name} role='tab' aria-selected={currentCategory === index}
                                className={'my-trips-tab' + (currentCategory === index ? ' selected' : '')}
                                onClick={() => { setCurrentCategory(index); setVisitingTripId(null); setError(null); }}>
                            {category.name}
                            {count !== 0 && <span className='my-trips-count'>{count}</span>}
                        </button>
                    );
                })}
            </div>

            {errorLine}
            {shownTrips.length === 0 ?
                <div className='my-trips-empty'>{categories[currentCategory].empty}</div>
            :
            <div className='my-trips-list'>
                {shownTrips.map((trip) =>
                    <div key={trip.trip_id} className='my-trip-card' role='button' tabIndex={0}
                         onClick={() => openTrip(trip)} onKeyDown={(e) => { if(e.target === e.currentTarget && e.key === 'Enter') openTrip(trip); }}>
                        <div className='my-trip-card-top'>
                            <h3>{trip.name}{trip.trip_status === 'DROPPED' && statusPill(trip)}</h3>
                            <span className='my-trip-cost'>{money(trip.total_cost)}</span>
                            {trip.trip_status === 'REQUESTING' && !isSuggested &&
                                <button className='my-trip-delete' title='Delete trip' onClick={(e) => { e.stopPropagation(); deleteTrip(trip); }}>
                                    <RiDeleteBin5Line/>
                                </button>}
                        </div>
                        <p className='my-trip-line'>
                            <FaRegCalendarAlt/> {dateRange(trip)} <span className='my-trip-muted'>· {tripLength(trip)}</span>
                        </p>
                        <p className='my-trip-line'>
                            {trip.agent_id ?
                                <><img className='my-trip-avatar' src={photoUrl(trip.photo)} alt=''/> {trip.username}</> :
                                <><FaUserTie/> <span className='my-trip-muted'>No agent yet</span></>}
                        </p>
                        <p className='my-trip-bookings'>{bookingSummary(trip) ?? 'No bookings yet'}</p>
                    </div>
                )}
            </div>}
        </>
    );

    const tripPage = (trip) => {
        const canEdit = !isSuggested && canEditBookings(trip, userInfo);
        const canPickAgent = !isSuggested && trip.trip_status === 'REQUESTING' && !trip.agent_id;
        return (
        <>
            <button className='my-trips-back' onClick={backToList}><IoArrowBack/> All trips</button>
            <div className='my-trip-title'>
                <h2>{trip.name}</h2>
                {trip.trip_status === 'DROPPED' && statusPill(trip)}
            </div>

            <div className='my-trip-stats'>
                <div className='my-trip-stat'>
                    <span className='my-trip-stat-label'>Dates</span>
                    <span className='my-trip-stat-value'>{dateRange(trip)}</span>
                    <span className='my-trip-stat-note'>{tripLength(trip)}</span>
                </div>
                <div className='my-trip-stat'>
                    <span className='my-trip-stat-label'>Total cost</span>
                    <span className='my-trip-stat-value my-trip-cost'>{money(trip.total_cost)}</span>
                    <span className='my-trip-stat-note'>
                        {Number(trip.discount) !== 0 ? `${trip.discount}% discount` : bookingSummary(trip) ?? 'Nothing booked yet'}
                    </span>
                </div>
                <div className='my-trip-stat my-trip-stat-wide'>
                    <span className='my-trip-stat-label'>Agent</span>
                    {trip.agent_id ?
                    <div className='my-trip-person' role='button' tabIndex={0} title='See their profile'
                         onClick={() => visitAgentProfile(trip.agent_id)} onKeyDown={(e) => { if(e.key === 'Enter') visitAgentProfile(trip.agent_id); }}>
                        <img src={photoUrl(trip.photo)} alt=''/>
                        <div>
                            <span className='my-trip-stat-value my-trip-agent-name'>{trip.username}</span>
                            {trip.experience_years !== undefined &&
                                <span className='my-trip-stat-note'>{trip.experience_years} years · {money(trip.fee)} fee</span>}
                        </div>
                    </div>
                    : canPickAgent && showAgentSearch ?
                    <div className='trip-agent-picker'>
                        <AgentSearch profile={pickedAgent} setProfile={setPickedAgent}/>
                        <div className='my-trip-actions'>
                            <button className='my-trips-btn' onClick={() => { setShowAgentSearch(false); setPickedAgent(undefined); }}>Cancel</button>
                            <button className='my-trips-btn my-trips-btn-primary' disabled={!pickedAgent} onClick={() => setAgent(trip)}>
                                {pickedAgent ? `Send the request to ${pickedAgent.username}` : 'Pick an agent above'}
                            </button>
                        </div>
                    </div>
                    :
                    <div className='my-trip-no-agent'>
                        <span className='my-trip-stat-note'>Not chosen yet</span>
                        {canPickAgent &&
                            <button className='my-trips-btn my-trips-btn-primary' onClick={() => setShowAgentSearch(true)}>Choose an agent</button>}
                    </div>}
                </div>
            </div>

            {errorLine}

            <h3 className='my-trip-section-title'>Bookings</h3>
            {hasNoBookings(trip) ?
                <div className='my-trips-empty'>
                    Nothing booked yet.{canEdit && ' Use "Add to Trip" on a destination, or "Book Now!" on a hotel, restaurant or flight.'}
                </div>
            :
            <TripBookings trip={trip} canEdit={canEdit} onRemove={removeBooking}/>}

            {!isSuggested && (trip.trip_status === 'UPDATING' || trip.trip_status === 'REQUESTING') &&
            <div className='my-trip-actions'>
                {trip.trip_status === 'REQUESTING' &&
                    <button className='my-trips-btn my-trips-btn-danger' onClick={() => deleteTrip(trip)}><RiDeleteBin5Line/> Delete trip</button>}
                {trip.trip_status === 'UPDATING' &&
                    <button className='my-trips-btn my-trips-btn-primary' onClick={() => sendForApproval(trip)} disabled={hasNoBookings(trip)}
                            title={hasNoBookings(trip) ? 'Add a booking first' : undefined}>
                        Send for approval
                    </button>}
            </div>}
        </>);
    }

    return(
        <div className='login-signup-popup'>
            <div className="close-container" style={{position: 'relative'}}>
                <ImCross className='close' onClick={() => setShowTrips(false)} />

                <div className={'login-signup-container trip-container' + (createTrip ? ' create-mode' : '')}>
                    {createTrip ?
                    <CreateTrip
                        onCreated={async () => { await reloadTrips(); setCreateTrip(false); setCurrentCategory(0); }}
                        onCancel={() => setCreateTrip(false)}/>
                    :
                    <div className='my-trips'>
                        {visitingTrip === null ? tripList() : tripPage(visitingTrip)}
                    </div>}
                </div>
            </div>
        </div>
    )
}

Trips.propTypes = {
    setShowTrips: PropTypes.func
}

export default Trips;
