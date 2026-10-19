import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { RiDeleteBin5Line } from "react-icons/ri";
import CreateTrip from '../Components/CreateTrip';
import AgentSearch from '../Components/AgentSearch';
import AgentProfile from '../Components/AgentProfile';
import TripBookings from '../Components/TripBookings';
import { canEditBookings, errorMessage, formatDate } from '../Components/tripHelpers';
import { apiFetch } from '../api';

// The tabs of My Trips; "Suggested" holds other customers' completed trips, as ideas
const categories = [
    { name: 'Requesting', status: 'REQUESTING' },
    { name: 'Updating', status: 'UPDATING' },
    { name: 'Pending', status: 'PENDING' },
    { name: 'Confirmed', status: 'CONFIRMED' },
    { name: 'Completed', status: 'COMPLETED' },
    { name: 'Suggested' },
];

// What happens next with a trip in each status
const statusHint = (trip) => ({
    REQUESTING: trip.agent_id ? `Waiting for ${trip.username} to accept the trip. You can already add bookings.`
                              : 'Choose an agent to send them this trip. You can already add bookings.',
    UPDATING: 'Your agent accepted the trip and is putting it together with you. When it looks right, send it to an admin for approval.',
    PENDING: 'Waiting for an admin to approve the trip. Its bookings can no longer be changed.',
    CONFIRMED: 'Approved by an admin. Have a great trip!',
    COMPLETED: 'This trip is over.',
}[trip.trip_status]);

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
    const shownTrips = isSuggested ? suggestedTrips : ownTrips.filter(trip => trip.trip_status === categories[currentCategory].status);
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

    const tripSummary = (trip) => (
        <div className="trip-details">
            <p>{formatDate(trip.departure_date)} – {formatDate(trip.return_date)}</p>
            <p>Total Cost: ৳ {Number(trip.total_cost).toLocaleString('en-US')}</p>
            <p>Agent: {trip.agent_id ? trip.username : 'not chosen yet'}</p>
        </div>
    );

    return(
        <div className='login-signup-popup'>
            <div className="close-container" style={{position: 'relative'}}>
                <ImCross className='close' onClick={() => setShowTrips(false)} />

                <div className={'login-signup-container trip-container' + (createTrip ? ' create-mode' : '')}>
                    {createTrip ?
                    <CreateTrip
                        onCreated={async () => { await reloadTrips(); setCreateTrip(false); setCurrentCategory(0); }}
                        onCancel={() => setCreateTrip(false)}/>

                    : visitingTrip === null ?
                    <>
                        <div className='trips-header'>
                            <h2>My Trips</h2>
                            <button className="customer-confirm-button custom-btn" onClick={()=>setCreateTrip(true)}>Create a new trip</button>
                        </div>
                        <div className="category-bar">
                            {categories.map((category, index) =>
                                <div key={category.name} className={"category" + (currentCategory===index ? " selected-category" : "")}
                                     onClick={() => { setCurrentCategory(index); setVisitingTripId(null); }}>
                                    {category.name}
                                </div>
                            )}
                        </div>

                        {error && <p className='trip-form-error'>{error}</p>}
                        <div className="category-data">
                            {shownTrips.length===0 ?
                                <div className="no-trips">
                                    <h3>{isSuggested ? 'No completed trips to suggest yet' : 'No trips in this category'}</h3>
                                </div>
                            :
                            shownTrips.map((trip) =>
                                <div key={trip.trip_id} className="trip">
                                    {trip.trip_status === 'REQUESTING' && !isSuggested &&
                                        <RiDeleteBin5Line className='delete-button' title='Delete trip' onClick={() => deleteTrip(trip)}/>}
                                    <div className='trip-child-div' onClick={() => openTrip(trip)}>
                                        <h3 style={{marginTop: '0px', marginBottom: '8px'}}>{trip.name}</h3>
                                        {tripSummary(trip)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </>

                    :
                    <>
                        <div className='trips-header'>
                            <h2>{visitingTrip.name}</h2>
                            <button className='custom-btn customer-confirm-button' onClick={() => { setVisitingTripId(null); setError(null); }}>All Trips</button>
                        </div>

                        {!isSuggested && <p className='trip-status-hint'>{statusHint(visitingTrip)}</p>}

                        <div className="trip-details">
                            <p>{formatDate(visitingTrip.departure_date)} – {formatDate(visitingTrip.return_date)}</p>
                            <p>Total Cost: ৳ {Number(visitingTrip.total_cost).toLocaleString('en-US')}</p>
                            {Number(visitingTrip.discount) !== 0 && <p>Discount: {visitingTrip.discount}%</p>}
                            <p>Agent: {visitingTrip.agent_id ?
                                <span className='visit-agent-profile' onClick={() => visitAgentProfile(visitingTrip.agent_id)}>{visitingTrip.username}</span> :
                                'not chosen yet'}
                            </p>
                        </div>

                        {visitingTrip.trip_status === 'REQUESTING' && !visitingTrip.agent_id && !isSuggested &&
                        <div className='trip-agent-picker'>
                            {showAgentSearch ?
                            <>
                                <AgentSearch setProfile={setPickedAgent}/>
                                <div className='popup-buttons'>
                                    <button className='custom-btn' disabled={!pickedAgent} onClick={() => setAgent(visitingTrip)}>
                                        {pickedAgent ? `Send the request to ${pickedAgent.username}` : 'Pick an agent above'}
                                    </button>
                                    <button className='custom-btn' onClick={() => { setShowAgentSearch(false); setPickedAgent(undefined); }}>Cancel</button>
                                </div>
                            </>
                            :
                            <button className='custom-btn' onClick={() => setShowAgentSearch(true)}>Choose an agent</button>}
                        </div>}

                        {error && <p className='trip-form-error'>{error}</p>}

                        <TripBookings trip={visitingTrip} canEdit={!isSuggested && canEditBookings(visitingTrip, userInfo)} onRemove={removeBooking}/>

                        {!isSuggested &&
                        <div className='popup-buttons'>
                            {visitingTrip.trip_status === 'UPDATING' &&
                                <button className='custom-btn' onClick={() => sendForApproval(visitingTrip)}
                                        disabled={[visitingTrip.destinations, visitingTrip.accommodations, visitingTrip.restaurants, visitingTrip.flights].every(list => list.length === 0)}>
                                    Send for approval
                                </button>}
                            {visitingTrip.trip_status === 'REQUESTING' &&
                                <button className='custom-btn btn-no' onClick={() => deleteTrip(visitingTrip)}>Delete trip</button>}
                        </div>}
                    </>}
                </div>
            </div>
        </div>
    )
}

Trips.propTypes = {
    setShowTrips: PropTypes.func
}

export default Trips;
