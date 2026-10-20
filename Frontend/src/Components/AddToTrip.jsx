import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TiTick } from 'react-icons/ti';
import { FaPlus, FaRegCalendarAlt, FaUserTie } from 'react-icons/fa';
import UserInfoContext from '../Context/UserInfoContext';
import CreateTrip from './CreateTrip';
import { dateRange, errorMessage, money, toApiDate } from './tripHelpers';
import { apiFetch, photoUrl } from '../api';
import '../Styles/confirmation-message.css';
import '../Styles/my-trips.css';

const shortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusLabels = { REQUESTING: 'Waiting for an agent', UPDATING: 'Agent accepted' };

// The last step of every booking popup: pick one of the user's open trips that cover the booking's dates
// (or, for a customer, create one) and add the booking to it. addToTrip(tripId) sends the booking and returns the fetch response.
const AddToTrip = ({ itemName, from, to, isAlreadyIn, addToTrip, onBack, onClose }) => {
    const { userInfo, reloadTrips } = useContext(UserInfoContext);
    const [view, setView] = useState('list'); // 'list', 'create' or 'done'
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [addedTo, setAddedTo] = useState(null);
    // null while loading; the backend only sends trips that are open for bookings and cover these dates
    const [trips, setTrips] = useState(null);

    const fromText = toApiDate(from);
    const toText = toApiDate(to);
    const isLoggedIn = userInfo !== null;
    useEffect(() => {
        if(!isLoggedIn)
        {
            return;
        }
        let ignore = false;
        apiFetch(`http://localhost:3000/trip/open-for-booking?from=${encodeURIComponent(fromText)}&to=${encodeURIComponent(toText)}`, { method: 'GET' })
            .then(response => response.ok ? response.json() : [])
            .then(found => { if(!ignore) setTrips(found); });
        return () => { ignore = true; };
    }, [fromText, toText, isLoggedIn]);

    if(!userInfo)
    {
        return (
            <>
                <div className='message-title'>Add to a trip</div>
                <p className='message-content'>Log in to add {itemName} to a trip.</p>
                <div className='popup-buttons'><button className='my-trips-btn' onClick={onClose}>Close</button></div>
            </>
        );
    }

    const isCustomer = userInfo.user_type === 'customer';

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
                <div className='popup-buttons'><button className='my-trips-btn my-trips-btn-primary' onClick={onClose}>Done</button></div>
            </>
        );
    }

    const when = from.toDateString() === to.toDateString() ? shortDate(from) : `${shortDate(from)} – ${shortDate(to)}`;

    return (
        <>
            <div>
                <div className='message-title'>Add to a trip</div>
                <p className='booking-hint'>{itemName} · {when}</p>
            </div>

            {trips === null ?
                <p className='booking-empty'>Looking for your trips...</p>
            : trips.length === 0 ?
                <p className='booking-empty'>
                    {isCustomer ? `None of your open trips cover ${when}. Create a trip for these dates.`
                                : `None of the trips you are planning cover ${when}.`}
                </p>
            :
                <div className='booking-trip-list'>
                    {trips.map((trip) => {
                        const alreadyIn = isAlreadyIn(trip);
                        return (
                            <div key={trip.trip_id} className={'booking-trip' + (alreadyIn ? ' unavailable' : '')}>
                                <div className='booking-trip-info'>
                                    <div className='booking-trip-name'>
                                        {trip.name}
                                        {alreadyIn && <span className='booking-trip-tag'>Already in this trip</span>}
                                    </div>
                                    <p className='my-trip-line'><FaRegCalendarAlt/> {dateRange(trip)} <span className='my-trip-muted'>· {money(trip.total_cost)} so far</span></p>
                                    <p className='my-trip-line'>
                                        {trip.user_id ?
                                            <><img className='my-trip-avatar' src={photoUrl(trip.photo)} alt=''/> {trip.username}</> :
                                            <><FaUserTie/> <span className='my-trip-muted'>No agent yet</span></>}
                                        {isCustomer && <span className='my-trip-muted'>· {statusLabels[trip.trip_status]}</span>}
                                    </p>
                                </div>
                                {!alreadyIn &&
                                    <button className='my-trips-btn my-trips-btn-primary' disabled={isAdding} onClick={() => add(trip.trip_id, trip.name)}>Add</button>}
                            </div>
                        );
                    })}
                </div>}

            {error && <p className='trip-form-error'>{error}</p>}

            <div className='popup-buttons booking-actions'>
                {onBack && <button className='my-trips-btn' onClick={onBack}>Back</button>}
                {isCustomer && <button className='my-trips-btn my-trips-btn-primary' onClick={() => setView('create')}><FaPlus/> Create a new trip</button>}
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
