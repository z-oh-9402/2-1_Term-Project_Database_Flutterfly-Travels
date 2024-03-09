import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import PropTyes from 'prop-types';
import { ImCross } from "react-icons/im";
import CreateTrip from "./CreateTrip";

const FlightBooking = ({ header, flight, setShowConfirmationMessage, bookingDetails }) => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);

    const filterTrips = (trip) => {
        let found = false;

        if(trip.TRIP_STATUS==='UPDATING')
        {
            for(let a of trip.FLIGHTS)
            {
                if(a.FLIGHT_ID === flight.FLIGHT_ID)
                {
                    found = true;
                    break;
                }
            }
        }
        else
        {
            found = true;
        }

        return found;
    }

    useEffect(() => {
        const t = userInfo.TRIPS.filter(trip => !filterTrips(trip));
        setTrips(t);
    }, [userInfo.TRIPS]);

    const totalCost = flight.SEAT_PRICE*bookingDetails.numberOfSeats;
    const [page, setPage] = useState(3);
    const message = ["Would you like to book this flight?",
                     "How would you like to add this flight to your package?",
                     "No already created trip package exists. Would you like to create a new one?"];

    useEffect(() => {
        const resizeComponent = () => {
            if(page===2 || page===5 || page===6)
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '400px';
            }
            else
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '150px';
            }
        }
        resizeComponent();
    }, [page]);

    const handleGoToCurrentPage = () => {
        setShowConfirmationMessage(false);
    }

    const addBooking = async (tripId) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        let inDate = new Intl.DateTimeFormat('en-US', options).format(bookingDetails.departureDate);
        if(inDate.includes(', 24:')) {
            inDate = inDate.replace(', 24:', ', 00:');
        }

        let outDate = undefined
        if(bookingDetails.returnDate!==undefined)
        {
            outDate = new Intl.DateTimeFormat('en-US', options).format(bookingDetails.returnDate);
            if(outDate.includes(', 24:')) {
                outDate = inDate.replace(', 24:', ', 00:');
            }
        }

        const response = await fetch(`http://localhost:3000/booking/add-flight-booking`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: flight.FLIGHT_ID,
                tripId: tripId,
                departureDate: inDate,
                returnDate: outDate,
                numberOfSeats: bookingDetails.numberOfSeats,
                seatClass: bookingDetails.seatClass,
                flightStyle: flight.FLIGHT_STYLE,
                totalCost: totalCost,
                bookingType: 'FLIGHT'
            }),
        });

        const data = await response.json();
        if(data.status === "ok")
        {
            if(userInfo.USER_TYPE === 'customer')
            {
                const response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.USER_ID}`, {
                    method: "GET"
                });

                const result = await response.json();
                userInfo.TRIPS = result;
            }
            if(userInfo.USER_TYPE === 'agent')
            {
                const response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.USER_ID}`, {
                    method: "GET"
                });

                const result = await response.json();
                userInfo.TRIPS = result;
            }

            setInfo(userInfo);
            setShowConfirmationMessage(false);
        }
    }

    const setCreateTrip = (param) => {
        if(!param)
        {
            setPage(5);
        }
    }

    return (
        <div className='login-signup-popup blurry-background'>
            <div className="close-container" style={{position: 'relative'}}>
                <div className='login-signup-container confirmation-message-container'>
                    <ImCross className='close2' onClick={handleGoToCurrentPage}/>

                    {page===1 && <></>}

                    {page===2 && <></>}

                    {page===3 && trips.length!==0 &&
                    <>
                        <div className='message-title'>{header}</div>
                        <p className='message-content'>{message[1]}</p>
                        <div>
                            <button className='custom-btn' onClick={() => setPage(5)}>Add to an existing package</button>
                            <button className='custom-btn' onClick={() => setPage(6)}>Create a new package</button>
                        </div>
                    </>}

                    {page===4 && trips.length===0 &&
                    <>
                        <div className='message-title'>{header}</div>
                        <p className='message-content'>{message[2]}</p>
                        <div>
                            <button className='custom-btn' onClick={() => setPage(6)}>Create a new package</button>
                        </div>
                    </>}

                    {page===5 &&
                    <>
                        <div className='message-title'>{header}</div>
                        <div className='trips-container'>
                            {trips.map((trip, index) => 
                            <div key={index} className='trip-item'>
                                <div>
                                    <div className='trip-name'>{trip.NAME}</div>
                                    <div>Departure Date:&nbsp;
                                        {new Date(trip.DEPARTURE_DATE).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>Return Date:&nbsp;
                                        {new Date(trip.RETURN_DATE).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>Total Cost: ৳ {(trip.TOTAL_COST).toLocaleString('en-US')}</div>
                                    <div>Agent: {trip.USERNAME ? trip.USERNAME : 'Not Set'}</div>
                                </div>
                                <button className='custom-btn plus-button' onClick={()=>addBooking(trip.TRIP_ID)}>+</button>
                            </div>)}
                        </div>
                    </>}

                    {page===6 &&
                    <>
                        <CreateTrip setCreateTrip={setCreateTrip}/>
                    </>}
                </div>
            </div>
        </div>
    );
}

FlightBooking.propTypes = {
    header: PropTyes.string,
    flight: PropTyes.object,
    setShowConfirmationMessage: PropTyes.func,
    bookingDetails: PropTyes.object
}

export default FlightBooking;