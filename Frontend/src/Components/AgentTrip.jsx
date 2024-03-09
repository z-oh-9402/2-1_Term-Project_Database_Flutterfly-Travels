import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import Rating from '../Components/Rating';
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";

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
        const confirmedTrips = [];
        const completedTrips = [];

        for(let trip of tripList)
        {
            if(trip.TRIP_STATUS === "REQUESTING")
            {
                requestingTrips.push(trip);
            }
            else if(trip.TRIP_STATUS === "UPDATING")
            {
                updatingTrips.push(trip);
            }
            else if(trip.TRIP_STATUS === "CONFIRMED")
            {
                confirmedTrips.push(trip);
            }
            else
            {
                completedTrips.push(trip);
            }
        }

        newTrips.push(requestingTrips);
        newTrips.push(updatingTrips);
        newTrips.push(confirmedTrips);
        newTrips.push(completedTrips);

        if(userInfo.USER_TYPE==='customer')
        {
            const response = await fetch(`http://localhost:3000/trip/fetch-other-trips?userId=${userInfo.USER_ID}`, {
                method: 'GET'  
            });
            
            const suggestedTrips = await response.json();
            newTrips.push(suggestedTrips);
        }

        setTrips(newTrips);
    }

    
    useEffect(() => {
        sortTrips(userInfo.TRIPS);
    }, [refreshPage, userInfo.TRIPS,page]);

    useEffect(() => {
        if(page===2)
        {
            if(visitingTrip.DESTINATIONS.length!==0 || visitingTrip.ACCOMMODATIONS.length!==0 || visitingTrip.RESTAURANTS.length!==0 || visitingTrip.FLIGHTS.length!==0)
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
        if(userInfo.USER_TYPE==='customer' || currentCategory!==0)
        {
            setVisitingTrip(trip);
            setPage(2);
        }
    }

    const func = async () => {
        let result;
        if(userInfo.USER_TYPE === 'customer')
        {
            const response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.USER_ID}`, {
                method: "GET"
            });

            result = await response.json();
        }
        if(userInfo.USER_TYPE === 'agent')
        {
            const response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.USER_ID}`, {
                method: "GET"
            });

            result = await response.json();
        }

        userInfo.TRIPS = result;
        setInfo(userInfo);
    }

    const deleteBooking = async (type, index) => {
        const trip = visitingTrip;
        const booking = type==='destination' ? trip.DESTINATIONS[index] : 
                       type==='accommodation' ? trip.ACCOMMODATIONS[index] : 
                       type==='restaurant' ? trip.RESTAURANTS[index] : 
                       trip.FLIGHTS[index];
                       
        let response;
        if(type==='destination')
        {
            response = await fetch(`http://localhost:3000/trip/delete-destination?tripDestinationId=${booking.TRIP_DESTINATION_ID}`, {
                method: 'DELETE'
            });
        }
        else
        {
            response = await fetch(`http://localhost:3000/booking/delete-booking?bookingId=${booking.BOOKING_ID}`, {
                method: 'DELETE'
            });
        }
        await response.json();

        func();
        setRefreshPage(!refreshPage);
    }

    const deleteTrip = async (index) => {
        const trip = trips[currentCategory][index];
        const response = await fetch(`http://localhost:3000/trip/delete-trip?tripId=${trip.TRIP_ID}`, {
            method: 'DELETE'
        });

        await response.json();

        func();
        setRefreshPage(!refreshPage);
    }

    const agentDecision = async (index, decision) => {
        const trip = trips[currentCategory][index];

        let response;
        if(decision)
        {
            response = await fetch(`http://localhost:3000/trip/update-trip`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    tripStatus: "UPDATING",
                    tripId: trip.TRIP_ID,
                    agentId: trip.AGENT_ID
                })
            });
        }
        else
        {
            response = await fetch(`http://localhost:3000/trip/update-trip`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    tripStatus: "UPDATING",
                    tripId: trip.TRIP_ID,
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
                    <div className={"category" + (currentCategory===2 ? " selected-category" : "")} id="category2" onClick={()=>setCurrentCategory(2)}>Confirmed</div>
                    <div className={"category" + (currentCategory===3 ? " selected-category" : "")} id="category3" onClick={()=>setCurrentCategory(3)}>Completed</div>
                    {userInfo.USER_TYPE==='customer' && 
                        <div className={"category" + (currentCategory===4 ? " selected-category" : "")} id="category4" onClick={()=>setCurrentCategory(4)}>Suggested</div>}
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
                            {currentCategory===0 && userInfo.USER_TYPE==='agent' && <TiTick className='tick-button' onClick={()=>agentDecision(index, true)}/>}
                            {currentCategory===0 && userInfo.USER_TYPE==='agent' && <RxCross2 className='delete-button' onClick={()=>agentDecision(index, false)}/>}
                            {currentCategory===0 && userInfo.USER_TYPE==='customer' && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteTrip(index)}/>}
                            <div className='trip-child-div' onClick={()=>{visitTripProfile(trip)}}>
                                <h3 style={{marginTop: '0px', marginBottom: '8px', fontFamily:'Brush Script, cursive'}}>{trip.NAME}</h3>
                                <div className="trip-details">
                                    <p>Departure Date:&nbsp;
                                        {new Date(trip.DEPARTURE_DATE).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Return Date:&nbsp;
                                        {new Date(trip.RETURN_DATE).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Total Cost: ৳ {trip.TOTAL_COST.toLocaleString('en-US')}</p>
                                    {userInfo.USER_TYPE==='customer' && <p>Agent: {trip.USER_ID ? trip.USERNAME : 'not set yet'}</p>}
                                    {userInfo.USER_TYPE==='agent' && <p>Customer: {trip.USERNAME}</p>}
                                    {(currentCategory===3 || currentCategory===4) && <p>Rating: {trip.RATING!==0 ? <Rating rating={trip.RATING} state={0} setRating={null}/> : 'no rating given yet'}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>}
            </>

            :
            
            <>
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' , fontFamily:'Brush Script, cursive'}}>
                    <h2>{visitingTrip.NAME}</h2>
                    <button className='custom-btn customer-confirm-button' onClick={()=>setPage(1)}>All Trips</button>
                </div>
                
                <div className="trip-details">
                    <p>Departure Date:&nbsp;
                        {new Date(visitingTrip.DEPARTURE_DATE).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p>Return Date:&nbsp;
                        {new Date(visitingTrip.RETURN_DATE).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p>Total Cost: ৳ {visitingTrip.TOTAL_COST.toLocaleString('en-US')}</p>
                    <p>Discount: {visitingTrip.DISCOUNT!==0 ? visitingTrip.DISCOUNT+"%" : 'none'}</p>
                    {(currentCategory===3 || currentCategory===4) && <p>Rating: {visitingTrip.RATING!==0 ? <Rating rating={visitingTrip.RATING} state={0} setRating={null}/> : 'no rating given yet'}</p>}
                    <p>Customer: {visitingTrip.USERNAME}</p>

                    {isThereContent ?
                    <div className="trip-reservations">
                        {visitingTrip.DESTINATIONS.length!==0 && 
                        <div>
                            <h3>Destinations -</h3>
                            {visitingTrip.DESTINATIONS.map((destination, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('destination',index)}/>}
                                    <p>Name: {destination.NAME}</p>
                                    <p>Location: {destination.LOCATION_NAME}</p>
                                    <p>District: {destination.DISTRICT_NAME}</p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.ACCOMMODATIONS.length!==0 && 
                        <div>
                            <h3>Accommodations -</h3>
                            {visitingTrip.ACCOMMODATIONS.map((accommodation, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('accommodation',index)}/>}
                                    <p>Name: {accommodation.NAME}</p>
                                    <p>Check-In:&nbsp;
                                        {new Date(accommodation.CHECK_IN).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Check-Out:&nbsp; 
                                        {new Date(accommodation.CHECK_OUT).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Number of rooms: {accommodation.NUMBER_OF_ROOMS}</p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.RESTAURANTS.length!==0 && 
                        <div>
                            <h3>Restaurants -</h3>
                            {visitingTrip.RESTAURANTS.map((restaurant, index) => 
                                <div key={index} className="reservation">
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('restaurant',index)}/>}
                                    <p>Name: {restaurant.NAME}</p>
                                    <p>Location: {restaurant.LOCATION}</p>
                                    <p>Date: 
                                        {new Date(restaurant.DATE).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Time: {restaurant.TIME}</p>
                                </div>
                            )}
                        </div>}

                        {visitingTrip.FLIGHTS.length!==0 && 
                        <div>
                            <h3>Flights -</h3>
                            {visitingTrip.FLIGHTS.map((flight, index) => 
                                <div key={index} className="reservation">
                                    {console.log(flight)}
                                    {currentCategory===1 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteBooking('flight',index)}/>}
                                    <p>Airline Name: {flight.AIRLINE_NAME}</p>
                                    <p>Flight Style: {flight.FLIGHT_STYLE}</p>
                                    <p>Seat Class: {flight.SEAT_CLASS}</p>
                                    <p>Number of Seats: {flight.NUMBER_OF_SEATS}</p>
                                    <p>Departure Date: 
                                        {new Date(flight.DEPARTURE_AT).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    {flight.RETURN_DATE &&
                                    <p>Return Date: 
                                        {new Date(flight.RETURN_DATE).toLocaleDateString('en-US', {
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