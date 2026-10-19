import PropTypes from 'prop-types';
import { useState } from 'react';
import DateField from './DateField';
import TimePicker from './TimePicker';
import { apiFetch } from '../api';
import AddToTrip from './AddToTrip';
import { BookingPopup, CountStepper } from './BookingPopup';
import { startOfDay, toApiDateTime } from './tripHelpers';

// {hour: 1-12, minute, am} -> minutes after midnight (12 AM is 0, 12 PM is 720)
const toMinutes = ({ hour, minute, am }) => ((hour % 12) + (am ? 0 : 12)) * 60 + minute;

// {hour, minute, am} -> "09:30 AM", the format the backend reads
const formatTime = ({ hour, minute, am }) =>
    `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${am ? 'AM' : 'PM'}`;

// Booking a restaurant table: seats, date and times, then the trip it goes into
const RestaurantBooking = ({restaurant, setShowConfirmationMessage}) => {
    const today = startOfDay(new Date());
    const [step, setStep] = useState('details'); // 'details', then 'trip'
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [bookingDate, setBookingDate] = useState(today);
    const [arrivalTime, setArrivalTime] = useState({hour: 9, minute: 0, am: true});
    const [departureTime, setDepartureTime] = useState({hour: 10, minute: 0, am: true});
    const [error, setError] = useState(null);

    const totalCost = restaurant.booking_cost * (Number(numberOfSeats) || 1);

    const close = () => setShowConfirmationMessage(false);

    const handleBookingDateChange = (date) => {
        if(startOfDay(date) < today)
        {
            setError("The booking date can't be in the past");
            return;
        }
        setError(null);
        setBookingDate(startOfDay(date));
    }

    const showTimePicker = (type) => {
        document.getElementById(`${type}-time-picker`).style.display = 'flex';
    }

    const goToNext = () => {
        const arrival = toMinutes(arrivalTime);
        const departure = toMinutes(departureTime);

        if(arrival < 9 * 60)
        {
            setError("Arrival must be 9:00 AM or later");
        }
        else if(arrival > 20 * 60)
        {
            setError("Arrival must be 8:00 PM or earlier");
        }
        else if(departure < arrival + 60)
        {
            setError("Departure must be at least 1 hour after arrival");
        }
        else
        {
            setError(null);
            setStep('trip');
        }
    }

    const addToTrip = (tripId) => apiFetch(`http://localhost:3000/booking/add-restaurant-booking`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemId: restaurant.restaurant_id,
            tripId: tripId,
            bookingDate: toApiDateTime(bookingDate),
            arrivalTime: formatTime(arrivalTime),
            departureTime: formatTime(departureTime),
            numberOfSeats: Number(numberOfSeats) || 1,
            totalCost: totalCost
        }),
    });

    return (
        <BookingPopup onClose={close}>
            {step === 'details' ?
            <>
                <div className='message-title'>Book {restaurant.name}</div>
                <div className='booking-fields'>
                    <label>Number of seats:
                        <CountStepper value={numberOfSeats} setValue={setNumberOfSeats}/>
                    </label>

                    <label> Booking Date:
                        <div style={{display: 'inline-block', marginLeft: '5px'}}>
                            <DateField selected={bookingDate} onChange={handleBookingDateChange} minDate={today} inPopup/>
                        </div>
                    </label>

                    <label>Arrival Time: <span className='time-choice' onClick={() => showTimePicker('arrival')}>{formatTime(arrivalTime)}</span>
                        <TimePicker time={arrivalTime} setTime={setArrivalTime} type='arrival'/>
                    </label>

                    <label>Departure Time: <span className='time-choice' onClick={() => showTimePicker('departure')}>{formatTime(departureTime)}</span>
                        <TimePicker time={departureTime} setTime={setDepartureTime} type='departure'/>
                    </label>
                </div>

                <div className='booking-summary'>
                    <div>{Number(numberOfSeats) || 1} × ৳ {Number(restaurant.booking_cost).toLocaleString('en-US')} per seat</div>
                    <div className='booking-total'>Total: ৳ {totalCost.toLocaleString('en-US')}</div>
                </div>

                {error && <p className='trip-form-error'>{error}</p>}
                <div className='popup-buttons'>
                    <button className='custom-btn' onClick={goToNext}>Next</button>
                </div>
            </>
            :
            <AddToTrip
                itemName={restaurant.name}
                from={bookingDate}
                to={bookingDate}
                isAlreadyIn={(trip) => trip.restaurants.some(r => r.restaurant_id === restaurant.restaurant_id)}
                addToTrip={addToTrip}
                onBack={() => setStep('details')}
                onClose={close}/>}
        </BookingPopup>
    );
}

RestaurantBooking.propTypes = {
    restaurant: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
};

export default RestaurantBooking;
