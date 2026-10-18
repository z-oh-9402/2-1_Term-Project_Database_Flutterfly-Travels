import PropTypes from 'prop-types';
import { RiDeleteBin5Line } from "react-icons/ri";
import { formatDate, formatTime } from './tripHelpers';
import '../Styles/trips.css';

const cost = (booking) => booking.cost !== undefined && booking.cost !== null && <p>Cost: ৳ {Number(booking.cost).toLocaleString('en-US')}</p>;

// A trip's destinations and bookings (customer's and agent's trip views), with remove buttons while they can be changed
const TripBookings = ({ trip, canEdit, onRemove }) => {
    const isEmpty = [trip.destinations, trip.accommodations, trip.restaurants, trip.flights].every(list => list.length === 0);
    if(isEmpty)
    {
        return (
            <p className='no-bookings'>
                No bookings yet.{canEdit && ' Use "Add to Trip" on a destination, or "Book Now!" on a hotel, restaurant or flight.'}
            </p>
        );
    }

    const removeButton = (type, booking) =>
        canEdit && <RiDeleteBin5Line className='delete-button' title='Remove from trip' onClick={() => onRemove(type, booking)}/>;

    return (
        <div className="trip-reservations">
            {trip.destinations.length!==0 &&
            <div>
                <h3>Destinations</h3>
                {trip.destinations.map((destination) =>
                    <div key={destination.trip_destination_id} className="reservation">
                        {removeButton('destination', destination)}
                        <p className='reservation-name'>{destination.name}</p>
                        <p>{destination.location_name}, {destination.district_name}</p>
                        <p>{formatDate(destination.departure_date)} – {formatDate(destination.return_date)}</p>
                    </div>
                )}
            </div>}

            {trip.accommodations.length!==0 &&
            <div>
                <h3>Accommodations</h3>
                {trip.accommodations.map((accommodation) =>
                    <div key={accommodation.booking_id} className="reservation">
                        {removeButton('accommodation', accommodation)}
                        <p className='reservation-name'>{accommodation.name}</p>
                        <p>Check-in {formatDate(accommodation.check_in)} · Check-out {formatDate(accommodation.check_out)}</p>
                        <p>Rooms: {accommodation.number_of_rooms}</p>
                        {cost(accommodation)}
                    </div>
                )}
            </div>}

            {trip.restaurants.length!==0 &&
            <div>
                <h3>Restaurants</h3>
                {trip.restaurants.map((restaurant) =>
                    <div key={restaurant.booking_id} className="reservation">
                        {removeButton('restaurant', restaurant)}
                        <p className='reservation-name'>{restaurant.name}</p>
                        <p>{formatDate(restaurant.booking_date)}, {formatTime(restaurant.arrival_time)} – {formatTime(restaurant.departure_time)}</p>
                        <p>Seats: {restaurant.number_of_seats}</p>
                        {cost(restaurant)}
                    </div>
                )}
            </div>}

            {trip.flights.length!==0 &&
            <div>
                <h3>Flights</h3>
                {trip.flights.map((flight) =>
                    <div key={flight.booking_id} className="reservation">
                        {removeButton('flight', flight)}
                        <p className='reservation-name'>{flight.airline_name} · {flight.flight_style}</p>
                        <p>Departs {formatDate(flight.departure_at)}, {formatTime(flight.departure_at)}</p>
                        {flight.arrival_at && <p>Returns {formatDate(flight.arrival_at)}, {formatTime(flight.arrival_at)}</p>}
                        <p>{flight.seat_class} class · {flight.number_of_seats} {flight.number_of_seats === 1 ? 'seat' : 'seats'}</p>
                        {cost(flight)}
                    </div>
                )}
            </div>}
        </div>
    );
}

TripBookings.propTypes = {
    trip: PropTypes.object.isRequired,
    canEdit: PropTypes.bool,
    onRemove: PropTypes.func,
}

export default TripBookings;
