import { useState } from "react";
import PropTypes from 'prop-types';
import { apiFetch } from '../api';
import AddToTrip from './AddToTrip';
import { BookingPopup } from './BookingPopup';
import { formatDate, formatTime, toApiDateTime } from './tripHelpers';

// The day of `date` at the time of day of `time` (flight times are stored as times on 1970-01-01)
const atTimeOf = (date, time) => {
    const result = new Date(date);
    const clock = new Date(time);
    result.setHours(clock.getHours(), clock.getMinutes(), 0, 0);
    return result;
}

// Booking a flight: the date, seats and class come from the Flights page; this confirms them and picks the trip
const FlightBooking = ({ flight, setShowConfirmationMessage, bookingDetails }) => {
    const [step, setStep] = useState('details'); // 'details', then 'trip'

    const seats = Number(bookingDetails.numberOfSeats) || 1;
    const totalCost = flight.seat_price * seats;
    const isRoundTrip = flight.flight_style === 'Round Trip';
    const departureAt = atTimeOf(bookingDetails.departureDate, flight.departure_time);
    const returnAt = isRoundTrip ? atTimeOf(bookingDetails.returnDate ?? bookingDetails.departureDate, flight.return_departure_time ?? flight.departure_time) : null;

    const close = () => setShowConfirmationMessage(false);

    const addToTrip = (tripId) => apiFetch(`http://localhost:3000/booking/add-flight-booking`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            itemId: flight.flight_id,
            tripId: tripId,
            departureDate: toApiDateTime(departureAt),
            returnDate: returnAt ? toApiDateTime(returnAt) : undefined,
            numberOfSeats: seats,
            seatClass: bookingDetails.seatClass,
            flightStyle: flight.flight_style,
            totalCost: totalCost
        }),
    });

    return (
        <BookingPopup onClose={close}>
            {step === 'details' ?
            <>
                <div className='message-title'>Book {flight.airline_name}</div>
                <div className='booking-fields booking-facts'>
                    <div><span>Route</span>{flight.departure_airport} → {flight.arrival_airport}{isRoundTrip && ` → ${flight.departure_airport}`}</div>
                    <div><span>Departure</span>{formatDate(departureAt)}, {formatTime(departureAt)}</div>
                    {returnAt && <div><span>Return</span>{formatDate(returnAt)}, {formatTime(returnAt)}</div>}
                    <div><span>Class</span>{bookingDetails.seatClass}</div>
                    <div><span>Seats</span>{seats}</div>
                </div>

                <div className='booking-summary'>
                    <div>{seats} × ৳ {Number(flight.seat_price).toLocaleString('en-US')}{isRoundTrip && ' (both ways)'}</div>
                    <div className='booking-total'>Total: ৳ {totalCost.toLocaleString('en-US')}</div>
                </div>
                <p className='booking-hint'>To change the date, seats or class, close this and change them on the Flights page.</p>

                <div className='popup-buttons'>
                    <button className='custom-btn' onClick={() => setStep('trip')}>Next</button>
                </div>
            </>
            :
            <AddToTrip
                itemName={`The ${flight.airline_name} flight`}
                from={departureAt}
                to={returnAt ?? departureAt}
                isAlreadyIn={(trip) => trip.flights.some(f => f.flight_id === flight.flight_id)}
                addToTrip={addToTrip}
                onBack={() => setStep('details')}
                onClose={close}/>}
        </BookingPopup>
    );
}

FlightBooking.propTypes = {
    flight: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func,
    bookingDetails: PropTypes.object
}

export default FlightBooking;
