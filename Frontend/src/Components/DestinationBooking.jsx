import PropTypes from 'prop-types';
import { useState } from 'react';
import DateField from './DateField';
import { apiFetch } from '../api';
import AddToTrip from './AddToTrip';
import { BookingPopup } from './BookingPopup';
import { addDays, startOfDay, toApiDateTime } from './tripHelpers';

// Adding a destination to a trip: the days spent there, then the trip (destinations have no cost)
const DestinationBooking = ({ destination, setShowConfirmationMessage }) => {
    const today = startOfDay(new Date());
    const [step, setStep] = useState('details'); // 'details', then 'trip'
    const [arrivalDate, setArrivalDate] = useState(today);
    const [leavingDate, setLeavingDate] = useState(addDays(today, 1));
    const [error, setError] = useState(null);

    const close = () => setShowConfirmationMessage(false);

    const handleArrivalDateChange = (date) => {
        const day = startOfDay(date);
        if(day < today)
        {
            setError("The visit can't start in the past");
            return;
        }
        setError(null);
        setArrivalDate(day);
        if(leavingDate < day)
        {
            setLeavingDate(day);
        }
    }

    const handleLeavingDateChange = (date) => {
        const day = startOfDay(date);
        if(day < arrivalDate)
        {
            setError("You can't leave before you arrive");
            return;
        }
        setError(null);
        setLeavingDate(day);
    }

    const addToTrip = (tripId) => apiFetch(`http://localhost:3000/booking/add-destination-booking`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemId: destination.destination_id,
            tripId: tripId,
            checkInDate: toApiDateTime(arrivalDate),
            checkOutDate: toApiDateTime(leavingDate)
        }),
    });

    return (
        <BookingPopup onClose={close}>
            {step === 'details' ?
            <>
                <div className='message-title'>Visit {destination.name}</div>
                <div className='booking-fields booking-fields-grid styled-form'>
                    <label className='booking-field'>
                        <span className='booking-field-label'>Arriving on</span>
                        <DateField selected={arrivalDate} onChange={handleArrivalDateChange} minDate={today} inPopup/>
                    </label>
                    <label className='booking-field'>
                        <span className='booking-field-label'>Leaving on</span>
                        <DateField selected={leavingDate} onChange={handleLeavingDateChange} minDate={arrivalDate} inPopup/>
                    </label>
                </div>
                <p className='booking-hint'>Visiting a destination is free; add its hotels and restaurants to the same trip from their pages.</p>

                {error && <p className='trip-form-error'>{error}</p>}
                <div className='popup-buttons'>
                    <button className='my-trips-btn my-trips-btn-primary' onClick={() => setStep('trip')}>Next</button>
                </div>
            </>
            :
            <AddToTrip
                itemName={destination.name}
                from={arrivalDate}
                to={leavingDate}
                isAlreadyIn={(trip) => trip.destinations.some(d => d.destination_id === destination.destination_id)}
                addToTrip={addToTrip}
                onBack={() => setStep('details')}
                onClose={close}/>}
        </BookingPopup>
    );
};

DestinationBooking.propTypes = {
    destination: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
};

export default DestinationBooking;
