import PropTypes from 'prop-types';
import { useState } from 'react';
import DateField from './DateField';
import { apiFetch } from '../api';
import AddToTrip from './AddToTrip';
import { BookingPopup, CountStepper } from './BookingPopup';
import { addDays, startOfDay, toApiDateTime } from './tripHelpers';

// Booking an accommodation: rooms and dates, then the trip it goes into
const AccommodationBooking = ({ accommodation, setShowConfirmationMessage }) => {
    const today = startOfDay(new Date());
    const [step, setStep] = useState('details'); // 'details', then 'trip'
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [checkInDate, setCheckInDate] = useState(today);
    const [checkOutDate, setCheckOutDate] = useState(addDays(today, 1));
    const [error, setError] = useState(null);

    const nights = Math.round((checkOutDate - checkInDate) / 86400000);
    const totalCost = accommodation.room_price * (Number(numberOfRooms) || 1) * nights;

    const close = () => setShowConfirmationMessage(false);

    const handleCheckInDateChange = (date) => {
        const day = startOfDay(date);
        if(day < today)
        {
            setError("Check-in can't be in the past");
            return;
        }
        setError(null);
        setCheckInDate(day);
        if(checkOutDate <= day)
        {
            setCheckOutDate(addDays(day, 1));
        }
    }

    const handleCheckOutDateChange = (date) => {
        const day = startOfDay(date);
        if(day <= checkInDate)
        {
            setError("Check-out must be at least one night after check-in");
            return;
        }
        setError(null);
        setCheckOutDate(day);
    }

    const addToTrip = (tripId) => apiFetch(`http://localhost:3000/booking/add-accommodation-booking`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemId: accommodation.accommodation_id,
            tripId: tripId,
            checkInDate: toApiDateTime(checkInDate),
            checkOutDate: toApiDateTime(checkOutDate),
            numberOfRooms: Number(numberOfRooms) || 1,
            totalCost: totalCost
        }),
    });

    return (
        <BookingPopup onClose={close}>
            {step === 'details' ?
            <>
                <div className='message-title'>Book {accommodation.name}</div>
                <div className='booking-fields booking-fields-grid styled-form'>
                    <label className='booking-field'>
                        <span className='booking-field-label'>Check-in</span>
                        <DateField selected={checkInDate} onChange={handleCheckInDateChange} minDate={today} inPopup/>
                    </label>
                    <label className='booking-field'>
                        <span className='booking-field-label'>Check-out</span>
                        <DateField selected={checkOutDate} onChange={handleCheckOutDateChange} minDate={addDays(checkInDate, 1)} inPopup/>
                    </label>
                    <label className='booking-field'>
                        <span className='booking-field-label'>Rooms</span>
                        <CountStepper value={numberOfRooms} setValue={setNumberOfRooms}/>
                    </label>
                </div>

                <div className='booking-summary'>
                    <div>{nights} {nights === 1 ? 'night' : 'nights'} × {Number(numberOfRooms) || 1} {Number(numberOfRooms) === 1 || numberOfRooms === '' ? 'room' : 'rooms'} × ৳ {Number(accommodation.room_price).toLocaleString('en-US')}</div>
                    <div className='booking-total'>Total: ৳ {totalCost.toLocaleString('en-US')}</div>
                </div>

                {error && <p className='trip-form-error'>{error}</p>}
                <div className='popup-buttons'>
                    <button className='my-trips-btn my-trips-btn-primary' onClick={() => setStep('trip')}>Next</button>
                </div>
            </>
            :
            <AddToTrip
                itemName={accommodation.name}
                from={checkInDate}
                to={checkOutDate}
                isAlreadyIn={(trip) => trip.accommodations.some(a => a.accommodation_id === accommodation.accommodation_id)}
                addToTrip={addToTrip}
                onBack={() => setStep('details')}
                onClose={close}/>}
        </BookingPopup>
    );
};

AccommodationBooking.propTypes = {
    accommodation: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
};

export default AccommodationBooking;
