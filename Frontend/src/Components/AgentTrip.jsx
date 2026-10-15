import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import Rating from '../Components/Rating';
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { apiFetch } from '../api';

const AgentTrip = () => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(0);
    const [page, setPage] = useState(1);
    const [visitingTrip, setVisitingTrip] = useState(undefined);
    const [isThereContent, setIsThereContent] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);

    const sortTrips = async (tripList) => {
        let newTrips = [];
        const requestingTrips = [];
        const updatingTrips = [];
        const pendingTrips = [];
        const confirmedTrips = [];

        for(let trip of tripList)
        {
            if(trip.trip_status === "REQUESTING")
            {
                requestingTrips.push(trip);
            }
            if(trip.trip_status === "UPDATING")
            {
                updatingTrips.push(trip);
            }
            if(trip.trip_status === "PENDING")
            {
                pendingTrips.push(trip);
            }
            if(trip.trip_status === "CONFIRMED")
            {
                confirmedTrips.push(trip);
            }
        }

        newTrips.push(requestingTrips);
        newTrips.push(updatingTrips);
        newTrips.push(pendingTrips);
        newTrips.push(confirmedTrips);

        setTrips(newTrips);
    }

    
    useEffect(() => {
        sortTrips(userInfo.trips);
    }, [refreshPage, userInfo.trips,page]);

    useEffect(() => {
        if(page===2)
        {
            if(visitingTrip.destinations.length!==0 || visitingTrip.accommodations.length!==0 || visitingTrip.restaurants.length!==0 || visitingTrip.flights.length!==0)
            {
                setIsThereContent(true);
            }
            else
            {
                setIsThereContent(false);
            }
        }
    }, [page]);

    const visitTripProfile = (trip) => {
        if(userInfo.user_type==='customer' || currentCategory!==0)
        {
            setVisitingTrip(trip);
            setPage(2);
        }
    }

    const func = async () => {
        let result;
        if(userInfo.user_type === 'customer')
        {
            const response = await apiFetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.user_id}`, {
                method: "GET"
            });

            result = await response.json();
        }
        if(userInfo.user_type === 'agent')
        {
            const response = await apiFetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.user_id}`, {
                method: "GET"
            });

            result = await response.json();
        }

        userInfo.trips = result;
        setInfo(userInfo);
    }

    const deleteBooking = async (type, index) => {
        const trip = visitingTrip;
        const booking = type==='destination' ? trip.destinations[index] : 
                       type==='accommodation' ? trip.accommodations[index] : 
                       type==='restaurant' ? trip.restaurants[index] : 
                       trip.flights[index];
                       
        let response;
        if(type==='destination')
        {
            response = await apiFetch(`http://localhost:3000/trip/delete-destination?tripDestinationId=${booking.trip_destination_id}`, {
                method: 'DELETE'
            });
        }
        else
        {
            response = await apiFetch(`http://localhost:3000/booking/delete-booking?bookingId=${booking.booking_id}`, {
                method: 'DELETE'
            });
        }
        await response.json();

        func();
        setRefreshPage(!refreshPage);
    }

    const agentDecision = async (index, decision) => {
        const trip = trips[currentCategory][index];

        let response;
        if(decision)
        {
            response = await apiFetch(`http://localhost:3000/trip/update-trip`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    tripStatus: "UPDATING",
                    tripId: trip.trip_id,
                    agentId: trip.agent_id
                })
            });
        }
        else
        {
            response = await apiFetch(`http://localhost:3000/trip/update-trip`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    tripStatus: "UPDATING",
                    tripId: trip.trip_id,
                    agentId: null
                })
            });
        }
        await response.json();

        func();
        setRefreshPage(!refreshPage);
    }
    
    return (
    <div>
        <div className='trip-container agent-side'>
            {page===1 ?
            <>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h2>My Trips</h2>
                </div>
                <div className="category-bar" id="categoryBar">
                    <div className={"category" + (currentCategory===0 ? " selected-category" : "")} id="category0" onClick={()=>setCurrentCategory(0)}>Requesting</div>
                    <div className={"category" + (currentCategory===1 ? " selected-category" : "")} id="category1" onClick={()=>setCurrentCategory(1)}>Updating</div>
                    <div className={"category" + (currentCategory===2 ? " selected-category" : "")} id="category2" onClick={()=>setCurrentCategory(2)}>Pending</div>
                    <div className={"category" + (currentCategory===3 ? " selected-category" : "")} id="category3" onClick={()=>setCurrentCategory(3)}>Confirmed</div>
                </div>

                {trips.length!==0 &&
                <div className="category-data" id="categoryData">
                    {trips[currentCategory].length===0 ? 
                        <div className="no-trips">
                            <h3>No trips in this category</h3>
                        </div>
                    :
                    trips[currentCategory].map((trip, index) => 
                        <div key={index} className="trip">
                            {currentCategory===0 && userInfo.user_type==='agent' && <TiTick className='tick-button' onClick={()=>agentDecision(index, true)}/>}
                            {currentCategory===0 && userInfo.user_type==='agent' && <RxCross2 className='delete-button' onClick={()=>agentDecision(index, false)}/>}
                            <div className='trip-child-div' onClick={()=>{visitTripProfile(trip)}}>
                                <h3 style={{marginTop: '0px', marginBottom: '8px', fontFamily:'Brush Script, cursive'}}>{trip.name}</h3>
                                <div className="trip-details">
                                    <p>Departure Date:&nbsp;
                                        {new Date(trip.departure_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Return Date:&nbsp;
                                        {new Date(trip.return_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Total Cost: ৳ {trip.total_cost.toLocaleString('en-US')}</p>
                                    <p>Customer: {trip.username}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>}
            </>

            :
            
            <>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , fontFamily:'Brush Script, cursive'}}>
                    <h2>{visitingTrip.name}</h2>
                    <button className='custom-btn customer-confirm-button' onClick={()=>setPage(1)}>All Trips</button>
                </div>
                
                <div className="trip-details">
                    <p>Departure Date:&nbsp;
                        {new Date(visitingTrip.departure_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p>Return Date:&nbsp;
                        {new Date(visitingTrip.return_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p>Total Cost: ৳ {visitingTrip.total_cost.toLocaleString('en-US')}</p>
                    <p>Discount: {Number(visitingTrip.discount)!==0 ? visitingTrip.discount+"%" : 'none'}</p>
                    {(currentCategory===3 || currentCategory===4) && <p>Rating: {Number(visitingTrip.rating)!==0 ? <Rating rating={Number(visitingTrip.rating)}state={0} setRating={null}/> : 'no rating given yet'}</p>}
                    <p>Customer: {visitingTrip.username}</p>

                    {isThereContent ?
                    <div className="trip-reservations">
                        {visitingTrip.destinations.length!==0 && 
                        <div>
                            <h3>Destinations -</h3>
                            {visitingTrip.destinations.map((destination, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('destination',index)}/>}
                                    <p>Name: {destination.name}</p>
                                    <p>Location: {destination.location_name}</p>
                                    <p>District: {destination.district_name}</p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.accommodations.length!==0 && 
                        <div>
                            <h3>Accommodations -</h3>
                            {visitingTrip.accommodations.map((accommodation, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('accommodation',index)}/>}
                                    <p>Name: {accommodation.name}</p>
                                    <p>Check-In:&nbsp;
                                        {new Date(accommodation.check_in).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Check-Out:&nbsp; 
                                        {new Date(accommodation.check_out).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Number of rooms: {accommodation.number_of_rooms}</p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.restaurants.length!==0 && 
                        <div>
                            <h3>Restaurants -</h3>
                            {visitingTrip.restaurants.map((restaurant, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('restaurant',index)}/>}
                                    <p>Name: {restaurant.name}</p>
                                    <p>Location: {restaurant.location_name}</p>
                                    <p>Date:
                                        {new Date(restaurant.booking_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Number of seats: {restaurant.number_of_seats}</p>
                                    <p>Time: {new Date(restaurant.arrival_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                        {' - '}
                                        {new Date(restaurant.departure_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                                    </p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.flights.length!==0 && 
                        <div>
                            <h3>Flights -</h3>
                            {visitingTrip.flights.map((flight, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('flight',index)}/>}
                                    <p>Airline Name: {flight.airline_name}</p>
                                    <p>Flight Style: {flight.flight_style}</p>
                                    <p>Seat Class: {flight.seat_class}</p>
                                    <p>Number of Seats: {flight.number_of_seats}</p>
                                    <p>Departure Date: 
                                        {new Date(flight.departure_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {flight.arrival_at &&
                                    <p>Return Date:
                                        {new Date(flight.arrival_at).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>}
                                </div>
                            )}
                        </div>}
                    </div> 
                    : 
                    <h3>No reservations made yet</h3>}
                </div>
            </>}
        </div>
    </div>)
};

export default AgentTrip;