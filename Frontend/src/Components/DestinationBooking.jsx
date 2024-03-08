import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import { ImCross } from "react-icons/im";
import '../Styles/confirmation-message.css';
import '../Styles/login-signup.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { FaRegCalendarAlt } from "react-icons/fa";
import CreateTrip from "./CreateTrip";

const DestinationBooking = ({header, destination, setShowConfirmationMessage}) => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);

    const filterTrips = (trip) => {
        let found = false;

        if(trip.TRIP_STATUS==='UPDATING')
        {
            for(let a of trip.DESTINATIONS)
            {
                if(a.DESTINATION_ID === destination.DESTINATION_ID)
                {
                    found = true;
                    break;
                }
            }
        }
        else
        {
            found = false;
        }

        return found;
    }

    useEffect(() => {
        const t = userInfo.TRIPS.filter(trip => !filterTrips(trip));
        setTrips(t);
    }, [userInfo.TRIPS]);

    const [page, setPage] = useState(1);
    const message = ["Would you like to book this destination?",
                     "How would you like to add this accommodation to your package?",
                     "No already created trip package exists. Would you like to create a new one?"];

    const date = new Date();
    const [checkInDate, setCheckInDate] = useState(new Date(date));
    const [checkOutDate, setCheckOutDate] = useState(new Date(date.setDate(date.getDate()+1)));
    const [numberOfDays, setNumberOfDays] = useState(1);

    useEffect(() => {
        const resizeComponent = () => {
            if(page===5 || page===6)
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '400px';
            }
            else if(page===2)
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '300px';
            }
            else
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '180px';
            }
        }
        resizeComponent();
    }, [page]);

    const handleGoToCurrentPage = () => {
        setShowConfirmationMessage(false);
    }

    const goToNextPage = () => {
        setPage(page+1);
    }

    const handleCheckInDateChange = (date) =>
    {
        const sysdate = new Date();

        if(date<sysdate)
        {
            alert("Check-in Date cannot be in the past");
        }
        else
        {
            setCheckInDate(new Date(date));
            
            if(checkOutDate<date)
            {
                date.setDate(date.getDate()+1);
                setCheckOutDate(new Date(date));
                setNumberOfDays(1)
            }
            else
            {
                setNumberOfDays(Math.round((checkOutDate-date)/86400000));
            }
        }
    }

    const handleCheckOutDateChange = (date) =>
    {
        if(date<checkInDate)
        {
            const newDate = new Date(checkInDate);
            newDate.setDate(newDate.getDate()+1);
            setCheckOutDate(newDate);
            setNumberOfDays(1);
        }
        else
        {
            setCheckOutDate(new Date(date));
            setNumberOfDays(Math.round((date-checkInDate)/86400000));
        }
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

        const inDate = new Intl.DateTimeFormat('en-US', options).format(checkInDate);
        const outDate = new Intl.DateTimeFormat('en-US', options).format(checkOutDate);

        const response = await fetch(`http://localhost:3000/booking/add-destination-booking`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: destination.DESTINATION_ID,
                tripId: tripId,
                checkInDate: inDate,
                checkOutDate: outDate,
                bookingType: 'DESTINATION'
            }),
        });

        const data = await response.json();
        if(data.status === "ok")
        {
            alert("Booking added successfully!");
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
                    {page===1 && 
                    <>
                        <div className='message-title'>{header}</div>
                        <p className='message-content'>{message[page-1]}</p>
                        <div>
                            <button className='custom-btn' onClick={goToNextPage}>Yes</button>
                            <button className='custom-btn' onClick={handleGoToCurrentPage}>Cancel</button>
                        </div>
                    </>}

                    {page===2 &&
                    <>
                        <div className='message-title'>{header}</div>
                        <label> Check-in Date:
                            <div style={{display: 'inline-block', marginLeft: '5px'}}>
                                <div className='datepicker-container'>
                                    <DatePicker
                                        selected={checkInDate}
                                        onChange={(e)=>handleCheckInDateChange(e)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Departure Date"
                                    />
                                    <FaRegCalendarAlt className='calendar-img'/>
                                </div>
                            </div>
                        </label>
                        
                        <label> Check-out Date:
                            <div style={{display: 'inline-block', marginLeft: '5px'}}>
                                <div className='datepicker-container'>
                                    <DatePicker
                                        selected={checkOutDate}
                                        onChange={(e)=>handleCheckOutDateChange(e)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Return Date"
                                    />
                                    <FaRegCalendarAlt className='calendar-img'/>
                                </div>
                            </div>
                        </label>
                        
                        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div>Staying: {numberOfDays} {numberOfDays===1 ? 'night' : 'nights'}</div>
                            </div>
                        </div>
                        
                        <button className='custom-btn' onClick={()=>setPage(trips.length!==0 ? (userInfo.USER_TYPE==='customer' ? 3 : 5) : 4)}>Next</button>
                    </>}

                    {page===3 &&
                    <>
                        <div className='message-title'>{header}</div>
                        <p className='message-content'>{message[1]}</p>
                        <div>
                            <button className='custom-btn' onClick={() => setPage(5)}>Add to an existing package</button>
                            <button className='custom-btn' onClick={() => setPage(6)}>Create a new package</button>
                        </div>
                    </>}

                    {page===4 &&
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

DestinationBooking.propTypes = {
    header: PropTypes.string,
    destination: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
}

export default DestinationBooking;