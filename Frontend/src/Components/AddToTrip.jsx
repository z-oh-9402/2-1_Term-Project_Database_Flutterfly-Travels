import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { TiTick } from 'react-icons/ti';
import UserInfoContext from '../Context/UserInfoContext';
import CreateTrip from './CreateTrip';
import { canEditBookings, errorMessage, tripCovers } from './tripHelpers';
import '../Styles/confirmation-message.css';

const shortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusLabels = { REQUESTING: 'Waiting for an agent', UPDATING: 'Agent accepted' };

// The last step of every booking popup: pick one of the user's open trips (or, for a customer, create one)
// and add the booking to it. addToTrip(tripId) sends the booking and returns the fetch response.
const AddToTrip = ({ itemName, from, to, isAlreadyIn, addToTrip, onBack, onClose }) => {
    const { userInfo, reloadTrips } = useContext(UserInfoContext);
    const [view, setView] = useState('list'); // 'list', 'create' or 'done'
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addedTo, setAddedTo] = useState(null);

    if(!userInfo)
    {
        return (
            <>
                <div className='message-title'>Add to a trip</div>
                <p className='message-content'>Log in to add {itemName} to a trip.</p>
                <div className='popup-buttons'><button className='custom-btn' onClick={onClose}>Close</button></div>
            </>
        );
    }

    const isCustomer = userInfo.user_type === 'customer';
    // only trips whose bookings this user may change now (see canEditBookings)
    const openTrips = (userInfo.trips ?? []).filter(trip => canEditBookings(trip, userInfo));

    // why a trip can't take this booking, or null when it can
    const unavailableReason = (trip) =>
        isAlreadyIn(trip) ? 'Already in this trip' :
        !tripCovers(trip, from, to) ? `Trip dates (${shortDate(trip.departure_date)} – ${shortDate(trip.return_date)}) don't cover this booking` :
        null;

    const add = async (tripId, tripName) => {
        setIsAdding(true);
        setError(null);
        const response = await addToTrip(tripId);
        await reloadTrips();
        setIsAdding(false);

        if(response.ok)
        {
            setAddedTo(tripName);
            setView('done');
        }
        else
        {
            setError(await errorMessage(response, 'Could not add the booking'));
            setView('list');
        }
    }

    if(view === 'create')
    {
        // the new trip already covers the booking's dates, so the booking goes straight in
        return <CreateTrip fromDate={from} toDate={to} onCreated={add} onCancel={() => setView('list')}/>;
    }

    if(view === 'done')
    {
        return (
            <>
                <div className='message-title'>Added to your trip</div>
                <div className='booking-done'>
                    <TiTick className='booking-done-icon'/>
                    <p>{itemName} was added to <strong>{addedTo}</strong>.</p>
                    <p className='booking-hint'>{isCustomer ? 'You can see it under My Trips.' : 'You can see it in My Trips on your profile.'}</p>
                </div>
                <div className='popup-buttons'><button className='custom-btn' onClick={onClose}>Done</button></div>
            </>
        );
    }

    return (
        <>
            <div className='message-title'>Add to a trip</div>
            <p className='booking-hint'>
                {from.toDateString() === to.toDateString() ? `For ${shortDate(from)}` : `For ${shortDate(from)} – ${shortDate(to)}`}
            </p>

            {openTrips.length === 0 ?
                <p className='message-content'>
                    {isCustomer ? "You don't have a trip that can take bookings yet. Create one for this booking."
                                : "None of your trips are open for bookings right now. You can add bookings to trips you have accepted, until the customer sends them for approval."}
                </p>
                :
                <div className='trips-container'>
                    {openTrips.map((trip) => {
                        const reason = unavailableReason(trip);
                        return (
                            <div key={trip.trip_id} className={'trip-item' + (reason ? ' unavailable' : '')}>
                                <div>
                                    <div className='trip-name'>{trip.name}</div>
                                    <div>{shortDate(trip.departure_date)} – {shortDate(trip.return_date)}</div>
                                    <div>Total so far: ৳ {Number(trip.total_cost).toLocaleString('en-US')}</div>
                                    {isCustomer ?
                                        <div>Agent: {trip.username ?? 'not chosen yet'} · {statusLabels[trip.trip_status]}</div> :
                                        <div>Customer: {trip.username}</div>}
                                    {reason && <div className='trip-item-reason'>{reason}</div>}
                                </div>
                                {!reason && <button className='custom-btn plus-button' disabled={isAdding} onClick={() => add(trip.trip_id, trip.name)}>Add</button>}
                            </div>
                        );
                    })}
                </div>}

            {error && <p className='trip-form-error'>{error}</p>}

            <div className='popup-buttons'>
                {onBack && <button className='custom-btn' onClick={onBack}>Back</button>}
                {isCustomer && <button className='custom-btn' onClick={() => setView('create')}>Create a new trip</button>}
            </div>
        </>
    );
}

AddToTrip.propTypes = {
    itemName: PropTypes.string.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    isAlreadyIn: PropTypes.func.isRequired,
    addToTrip: PropTypes.func.isRequired,
    onBack: PropTypes.func,
    onClose: PropTypes.func.isRequired,
}

export default AddToTrip;
