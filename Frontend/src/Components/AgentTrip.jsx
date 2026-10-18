import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import Rating from '../Components/Rating';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import TripBookings from './TripBookings';
import { canEditBookings, errorMessage, formatDate } from './tripHelpers';
import { apiFetch } from '../api';

const categories = [
    { name: 'Requesting', status: 'REQUESTING' },
    { name: 'Updating', status: 'UPDATING' },
    { name: 'Pending', status: 'PENDING' },
    { name: 'Confirmed', status: 'CONFIRMED' },
    { name: 'Completed', status: 'COMPLETED' },
];

// What the agent can do with a trip in each status
const statusHints = {
    REQUESTING: 'The customer asked you to plan this trip. Accept it to start adding bookings, or decline it.',
    UPDATING: 'Add bookings with "Book Now!" or "Add to Trip" on any hotel, restaurant, flight or destination page. The customer sends the trip for approval when it is ready.',
    PENDING: 'The customer sent the trip to an admin for approval. Its bookings can no longer be changed.',
    CONFIRMED: 'Approved by an admin.',
    COMPLETED: 'This trip is over.',
};

// An approved agent's trips, on their profile page
const AgentTrip = () => {
    const {userInfo, reloadTrips} = useContext(UserInfoContext);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [visitingTripId, setVisitingTripId] = useState(null);
    const [error, setError] = useState(null);

    const shownTrips = (userInfo.trips ?? []).filter(trip => trip.trip_status === categories[currentCategory].status);
    // looked up again on every render, so it always shows the trip as last loaded
    const visitingTrip = visitingTripId === null ? null : shownTrips.find(trip => trip.trip_id === visitingTripId) ?? null;

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

    return (
    <div>
        <div className='trip-container agent-side'>
            {visitingTrip === null ?
            <>
                <div className='trips-header'>
                    <h2>My Trips</h2>
                </div>
                <div className="category-bar">
                    {categories.map((category, index) =>
                        <div key={category.name} className={"category" + (currentCategory===index ? " selected-category" : "")}
                             onClick={() => { setCurrentCategory(index); setError(null); }}>
                            {category.name}
                        </div>
                    )}
                </div>

                {error && <p className='trip-form-error'>{error}</p>}
                <div className="category-data">
                    {shownTrips.length===0 ?
                        <div className="no-trips">
                            <h3>No trips in this category</h3>
                        </div>
                    :
                    shownTrips.map((trip) =>
                        <div key={trip.trip_id} className="trip">
                            {trip.trip_status === 'REQUESTING' && <TiTick className='tick-button' title='Accept' onClick={() => agentDecision(trip, true)}/>}
                            {trip.trip_status === 'REQUESTING' && <RxCross2 className='delete-button' title='Decline' onClick={() => agentDecision(trip, false)}/>}
                            <div className='trip-child-div' onClick={() => { setError(null); setVisitingTripId(trip.trip_id); }}>
                                <h3 style={{marginTop: '0px', marginBottom: '8px', fontFamily:'Brush Script, cursive'}}>{trip.name}</h3>
                                <div className="trip-details">
                                    <p>{formatDate(trip.departure_date)} – {formatDate(trip.return_date)}</p>
                                    <p>Total Cost: ৳ {Number(trip.total_cost).toLocaleString('en-US')}</p>
                                    <p>Customer: {trip.username}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </>

            :

            <>
                <div className='trips-header' style={{fontFamily:'Brush Script, cursive'}}>
                    <h2>{visitingTrip.name}</h2>
                    <button className='custom-btn customer-confirm-button' onClick={() => { setVisitingTripId(null); setError(null); }}>All Trips</button>
                </div>

                <p className='trip-status-hint'>{statusHints[visitingTrip.trip_status]}</p>

                <div className="trip-details">
                    <p>{formatDate(visitingTrip.departure_date)} – {formatDate(visitingTrip.return_date)}</p>
                    <p>Total Cost: ৳ {Number(visitingTrip.total_cost).toLocaleString('en-US')}</p>
                    {Number(visitingTrip.discount) !== 0 && <p>Discount: {visitingTrip.discount}%</p>}
                    {(visitingTrip.trip_status === 'CONFIRMED' || visitingTrip.trip_status === 'COMPLETED') &&
                        <p>Rating: {Number(visitingTrip.rating)!==0 ? <Rating rating={Number(visitingTrip.rating)} isChanging={false} setRating={null}/> : 'no rating given yet'}</p>}
                    <p>Customer: {visitingTrip.username}</p>
                </div>

                {error && <p className='trip-form-error'>{error}</p>}

                <TripBookings trip={visitingTrip} canEdit={canEditBookings(visitingTrip, userInfo)} onRemove={removeBooking}/>

                {visitingTrip.trip_status === 'REQUESTING' &&
                <div className='popup-buttons'>
                    <button className='custom-btn btn-yes' onClick={() => agentDecision(visitingTrip, true)}>Accept</button>
                    <button className='custom-btn btn-no' onClick={() => agentDecision(visitingTrip, false)}>Decline</button>
                </div>}
            </>}
        </div>
    </div>)
};

export default AgentTrip;
