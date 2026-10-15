import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import '../Styles/confirmation-message.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { RiDeleteBin5Line } from "react-icons/ri";
import CreateTrip from '../Components/CreateTrip';
import AgentSearch from '../Components/AgentSearch';
import AgentProfile from '../Components/AgentProfile';
import { apiFetch } from '../api';

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
    const [showAgentProfile, setShowAgentProfile] = useState(false);
    const [visitingAgent, setVisitingAgent] = useState(undefined);

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

        if(userInfo.user_type==='customer')
        {
            const response = await apiFetch(`http://localhost:3000/trip/fetch-complete-trips`, {
                method: 'GET'  
            });
            
            const suggestedTrips = await response.json();
            console.log(suggestedTrips)
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

    const setAgent = () => {
        setShowAgentSearch(true);
    }

    const handleGoToCurrentPage = () => {
        setShowTrips(false);
    }

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

    const deleteTrip = async (index) => {
        const trip = trips[currentCategory][index];
        const response = await apiFetch(`http://localhost:3000/trip/delete-trip?tripId=${trip.trip_id}`, {
            method: 'DELETE'
        });

        await response.json();

        func();
        setRefreshPage(!refreshPage);
    }

    const customerConfirm = async () => {
        const response = await apiFetch(`http://localhost:3000/trip/update-trip-status`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            {
                tripStatus: "PENDING",
                tripId: visitingTrip.trip_id
            })
        });

        await response.json();
        
        func();
        setShowTrips(false);
    }

    const updateAgent = async () => {
        const response = await apiFetch(`http://localhost:3000/trip/update-agent`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(
            {
                tripId: visitingTrip.trip_id,
                agentId: agentProfile.user_id
            })
        });

        await response.json();
        setShowAgentSearch(false);
        func();
        setRefreshPage(!refreshPage);
    }

    const visitAgentProfile = async (agentId) => {
            const response = await apiFetch(`http://localhost:3000/agent/fetch/${agentId}`, {
                method: 'GET'
            });

            const result = await response.json();
        setVisitingAgent(result);
        setShowAgentProfile(true);
    }

    return(
        <> 
            {showAgentProfile ? <AgentProfile agent={visitingAgent} setShowAgentProfile={setShowAgentProfile}/>
            :
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
                                {userInfo.user_type==='customer' && <button className="customer-confirm-button custom-btn" onClick={()=>setCreateTrip(true)}>Create a new trip</button>}
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
                                            <h3 style={{marginTop: '0px', marginBottom: '8px'}}>{trip.name}</h3>
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
                                                <p>Agent: {trip.user_id ? trip.username : 'not set yet'}</p>
                                                {/* {currentCategory===4 && <p>Rating: {trip.rating!==0 ? <Rating rating={trip.rating} state={0} setRating={null}/> : 'no rating given yet'}</p>} */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>}
                        </>

                        :
                        
                        <>
                            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <h2>{visitingTrip.name}</h2>
                                {currentCategory===1 && isThereContent && <button className="customer-confirm-button custom-btn" onClick={customerConfirm}>Confirm</button>}
                                {currentCategory===0 && !visitingTrip.user_id && <button className="customer-confirm-button custom-btn" onClick={showAgentSearch ? updateAgent : setAgent}>{showAgentSearch ? 'Set Agent'  : 'Find Agent'}</button>}
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
                                <p>Discount: {Number(visitingTrip.discount)!==0 ?visitingTrip.discount+"%" : 'none'}</p>
                                {/* {(currentCategory===3 || currentCategory===4) && <p>Rating: {visitingTrip.rating!==0 ? <Rating rating={visitingTrip.rating} state={0} setRating={null}/> : 'no rating given yet'}</p>} */}
                                <p onClick={()=>visitAgentProfile(visitingTrip.user_id)}>Agent: {visitingTrip.user_id ? visitingTrip.username : <span id="set-agent-link" onClick={setAgent}>not set yet</span>}</p>

                                {showAgentSearch && <AgentSearch setProfile={setAgentProfile}/>}

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
                                                <p>Booking Date: 
                                                    {new Date(restaurant.booking_date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                                <p>Number of seats: {restaurant.number_of_seats}</p>
                                                <p>Arrival Time: {new Date(restaurant.arrival_time).toLocaleTimeString('en-US',
                                                    {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })}
                                                </p>
                                                <p>Departure Time: {new Date(restaurant.departure_time).toLocaleTimeString('en-US',
                                                    {
                                                        hour: 'numeric',
                                                        minute: 'numeric',
                                                        hour12: true,
                                                    })}
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
                    </div>}
                </div>
            </div>}
        </>
    )
}

Trips.propTypes = {
    setShowTrips: PropTypes.func
}

export default Trips;