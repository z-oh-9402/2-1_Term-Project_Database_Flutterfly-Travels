import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import Rating from '../Components/Rating';
import { RiDeleteBin5Line } from "react-icons/ri";
import CreateTrip from '../Components/CreateTrip';
import AgentSearch from '../Components/AgentSearch';

const Trips = (props) => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);
    const {setShowTrips} = props;
    const [currentCategory, setCurrentCategory] = useState(0);
    const [page, setPage] = useState(1);
    const [visitingTrip, setVisitingTrip] = useState(undefined);
    const [isThereContent, setIsThereContent] = useState(false);
    const [refreshPage, setRefreshPage] = useState(false);
    const [createTrip, setCreateTrip] = useState(false);
    const [showAgentSearch, setShowAgentSearch] = useState(false);
    const [agentProfile, setAgentProfile] = useState(undefined);

    const sortTrips = async (tripList) => {
        let newTrips = [];
        const requestingTrips = [];
        const updatingTrips = [];
        const pendingTrips = [];
        const confirmedTrips = [];

        for(let trip of tripList)
        {
            if(trip.TRIP_STATUS === "REQUESTING")
            {
                requestingTrips.push(trip);
            }
            if(trip.TRIP_STATUS === "UPDATING")
            {
                updatingTrips.push(trip);
            }
            if(trip.TRIP_STATUS === "PENDING")
            {
                pendingTrips.push(trip);
            }
            if(trip.TRIP_STATUS === "CONFIRMED")
            {
                confirmedTrips.push(trip);
            }
        }

        newTrips.push(requestingTrips);
        newTrips.push(updatingTrips);
        newTrips.push(pendingTrips);
        newTrips.push(confirmedTrips);

        if(userInfo.USER_TYPE==='customer')
        {
            const response = await fetch(`http://localhost:3000/trip/fetch-complete-trips`, {
                method: 'GET'  
            });
            
            const suggestedTrips = await response.json();
            newTrips.push(suggestedTrips);
        }

        setTrips(newTrips);
    }

    useEffect(() => {
        const resizeComponent = () => {
            if(createTrip)
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '400px';
            }
            else
            {
                const loginSignupContainer = document.querySelector('.trip-container');
                loginSignupContainer.style.height = '500px';
            }
        }
        resizeComponent();
    }, [createTrip]);

    
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

    const setAgent = () => {
        setShowAgentSearch(true);
    }

    const handleGoToCurrentPage = () => {
        setShowTrips(false);
    }

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

    const customerConfirm = async () => {
        const response = await fetch(`http://localhost:3000/trip/update-trip-status`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            {
                tripStatus: "PENDING",
                tripId: visitingTrip.TRIP_ID
            })
        });

        await response.json();
        
        func();
        setShowTrips(false);
    }

    const updateAgent = async () => {
        const response = await fetch(`http://localhost:3000/trip/update-agent`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            {
                tripId: visitingTrip.TRIP_ID,
                agentId: agentProfile.USER_ID
            })
        });

        await response.json();
        setShowAgentSearch(false);
        func();
        setRefreshPage(!refreshPage);
    }

    return(
        <>
            <div className='login-signup-popup'>
                <div className="close-container" style={{position: 'relative'}}>
                    <ImCross className='close' onClick={handleGoToCurrentPage} />

                    {createTrip ? 
                    <div className='login-signup-container confirmation-message-container'>
                        <CreateTrip setCreateTrip={setCreateTrip}/>
                    </div>

                    :

                    <div className='login-signup-container trip-container'>
                        {page===1 ?
                        <>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <h2>My Trips</h2>
                                {userInfo.USER_TYPE==='customer' && <button className="customer-confirm-button custom-btn" onClick={()=>setCreateTrip(true)}>Create a new trip</button>}
                            </div>
                            <div className="category-bar" id="categoryBar">
                                <div className={"category" + (currentCategory===0 ? " selected-category" : "")} id="category0" onClick={()=>setCurrentCategory(0)}>Requesting</div>
                                <div className={"category" + (currentCategory===1 ? " selected-category" : "")} id="category1" onClick={()=>setCurrentCategory(1)}>Updating</div>
                                <div className={"category" + (currentCategory===2 ? " selected-category" : "")} id="category2" onClick={()=>setCurrentCategory(2)}>Pending</div>
                                <div className={"category" + (currentCategory===3 ? " selected-category" : "")} id="category3" onClick={()=>setCurrentCategory(3)}>Confirmed</div>
                                <div className={"category" + (currentCategory===4 ? " selected-category" : "")} id="category4" onClick={()=>setCurrentCategory(4)}>Suggested</div>
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
                                        {currentCategory===0 && <RiDeleteBin5Line className='delete-button' onClick={()=>deleteTrip(index)}/>}
                                        <div className='trip-child-div' onClick={()=>{visitTripProfile(trip)}}>
                                            <h3 style={{marginTop: '0px', marginBottom: '8px'}}>{trip.NAME}</h3>
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
                                                <p>Agent: {trip.USER_ID ? trip.USERNAME : 'not set yet'}</p>
                                                {currentCategory===4 && <p>Rating: {trip.RATING!==0 ? <Rating rating={trip.RATING} state={0} setRating={null}/> : 'no rating given yet'}</p>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>}
                        </>

                        :
                        
                        <>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <h2>{visitingTrip.NAME}</h2>
                                {currentCategory===1 && isThereContent && <button className="customer-confirm-button custom-btn" onClick={customerConfirm}>Confirm</button>}
                                {currentCategory===0 && !visitingTrip.USER_ID && <button className="customer-confirm-button custom-btn" onClick={showAgentSearch ? updateAgent : setAgent}>{showAgentSearch ? 'Set Agent'  : 'Find Agent'}</button>}
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
                                <p>Agent: {visitingTrip.USER_ID ? visitingTrip.USERNAME : <span id="set-agent-link" onClick={setAgent}>not set yet</span>}</p>

                                {showAgentSearch && <AgentSearch setProfile={setAgentProfile}/>}

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
                                                <p>Booking Date: 
                                                    {new Date(restaurant.BOOKING_DATE).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p>Number of seats: {restaurant.NUMBER_OF_SEATS}</p>
                                                <p>Arrival Time: {new Date(restaurant.ARRIVAL_TIME).toLocaleTimeString('en-US',
                                                    {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })}
                                                </p>
                                                <p>Departure Time: {new Date(restaurant.DEPARTURE_TIME).toLocaleTimeString('en-US',
                                                    {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>}

                                    {visitingTrip.FLIGHTS.length!==0 && 
                                    <div>
                                        <h3>Flights -</h3>
                                        {visitingTrip.FLIGHTS.map((flight, index) => 
                                            <div key={index} className="reservation">
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
                    </div>}
                </div>
            </div>
        </>
    )
}

Trips.propTypes = {
    setShowTrips: PropTypes.func
}

export default Trips;