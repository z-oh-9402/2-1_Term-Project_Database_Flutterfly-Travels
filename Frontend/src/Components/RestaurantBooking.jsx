import { ImCross } from 'react-icons/im';
import '../Styles/confirmation-message.css';
import '../Styles/login-signup.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';
import { FaMinus, FaPlus, FaRegCalendarAlt } from 'react-icons/fa';
import CreateTrip from './CreateTrip';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const RestaurantBooking = ({header, restaurant, setShowConfirmationMessage}) => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);

    const filterTrips = (trip) => {
        let found = false;

        if(trip.TRIP_STATUS==='UPDATING')
        {
            for(let a of trip.RESTAURANTS)
            {
                if(a.RESTAURANT_ID === restaurant.RESTAURANT_ID)
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

    const [page, setPage] = useState(1);
    const message = ["Would you like to book this restaurant?",
                     "How would you like to add this restaurant to your package?",
                     "No already created trip package exists. Would you like to create a new one?"];

    const [numberOfSeats, setNumberOfSeats] = useState(1);

    const date = new Date();
    const [bookingDate, setBookingDate] = useState(new Date(date));
    const [arrivalTime, setArrivalTime] = useState(new Date(date));
    const [departureTime, setDepartureTime] = useState(new Date(date));
    const [numberOfHours, setNumberOfHours] = useState(1);

    const [tripName, setTripName] = useState('New Trip');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());

    const [agent, setAgent] = useState(undefined);

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

    const goToNextPage = () => {
        setPage(page+1);
    }

    const changeSeatNumber = (increase) => {
        
        if(increase)
        {
            setNumberOfSeats(parseInt(numberOfSeats)+1);
        }
        else
        {
            if(numberOfSeats > 1)
            {
                setNumberOfSeats(parseInt(numberOfSeats)-1);
            }
        }
    }

    const handleSeatNumberChange = (e) => {
        const isValid = /^[1-9]\d*$/.test(e.target.value);
        if(isValid || e.target.value.length === 0)
        {
            setNumberOfSeats(e.target.value);
        }
    }

    const fixValue = () => {
        if(numberOfSeats.length === 0)
        {
            setNumberOfSeats(1);
        }
    }

    const handleBookingDateChange = (date) =>
    {
        const sysdate = new Date();

        if(date<sysdate)
        {
            alert("Check-in Date cannot be in the past");
        }
        else
        {
            setBookingDate(new Date(date));
        }
    }

    const handleDepartureDateChange = (date) =>
    {
        const sysdate = new Date();

        if(date<sysdate)
        {
            alert("Departure Date cannot be in the past");
        }
        else
        {
            setDepartureDate(date);
            
            if(returnDate<date)
            {
                setReturnDate(date);
            }
        }
    }

    const handleReturnDateChange = (date) =>
    {
        if(date<departureDate)
        {
            setReturnDate(departureDate);
        }
        else
        {
            setReturnDate(date);
        }
    }

    const handleArrivalTimeChange = (time) =>
    {
        setArrivalTime(time);
        console.log(time);
    }

    const handleDepartureTimeChange = (time) =>
    {
        setDepartureTime(time);
        console.log(time);
    }

    const createTripPackage = async () => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };

        const inDate = new Intl.DateTimeFormat('en-US', options).format(departureDate);
        const outDate = new Intl.DateTimeFormat('en-US', options).format(returnDate);

        const response = await fetch(`http://localhost:3000/trip/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: userInfo.USER_ID,
                agentId: agent!==undefined ? agent.USER_ID : null,
                name: tripName,
                departureDate: inDate,
                returnDate: outDate,
                totalCost: 0,
                discount: 0,
                tripStatus: 'UPDATING',
                rating: 0
            }),
        });

        await response.json();

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
        setPage(5);
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

        const inDate = new Intl.DateTimeFormat('en-US', options).format(bookingDate);

        const response = await fetch(`http://localhost:3000/booking/add-restaurant-booking`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: restaurant.RESTAURANT_ID,
                tripId: tripId,
                checkInDate: inDate,
                numberOfSeats: numberOfSeats,
                bookingType: 'RESTAURANT'
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

    const params = {
        data: {
            header,
            tripName,
            departureDate,
            returnDate
        },
        functions: {
            setTripName,
            setDepartureDate,
            setReturnDate,
            setAgent,
            handleDepartureDateChange,
            handleReturnDateChange,
            createTripPackage
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
                        <label>Number of seats: 
                            <div style={{position: "relative", display: 'inline-block', marginLeft: "5px"}}>
                                <input className='seat-number' type="text" value={numberOfSeats} onChange={handleSeatNumberChange} onBlur={fixValue}/>
                                {numberOfSeats.length!==0 &&
                                <FaMinus className='seat-number-buttons minus' onClick={()=>changeSeatNumber(false)} />}
                                {numberOfSeats.length!==0 &&
                                <FaPlus className='seat-number-buttons plus' onClick={()=>changeSeatNumber(true)} />}
                            </div>
                        </label>

                        <label> Booking Date:
                            <div style={{display: 'inline-block', marginLeft: '5px'}}>
                                <div className='datepicker-container'>
                                    <DatePicker
                                        selected={bookingDate}
                                        onChange={(e)=>handleBookingDateChange(e)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Departure Date"
                                    />
                                    <FaRegCalendarAlt className='calendar-img'/>
                                </div>
                            </div>
                        </label>

                        
                        <div style={{display: 'inline-block', marginLeft: '5px'}}>
                            <div>
                                <p>Arrival Time: {bookingDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                                <TimePicker onChange={(time) => handleDepartureTimeChange(time)} value={departureTime}/>
                            </div>
                        </div>

                        <div style={{display: 'inline-block', marginLeft: '5px'}}>
                            <div>
                                <p>Departure Time: {bookingDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                                {/* <TimePicker
                                    value={departureTime}
                                    onChange={(time) => handleDepartureTimeChange(time)}
                                    format="h:mm a"
                                    maxTime="18:00"
                                    minTime="08:00"
                                    clearIcon={null}
                                    className="my-time-picker"
                                    use12Hours
                                /> */}
                            </div>
                        </div>
                        
                        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div>Staying: {numberOfHours} {numberOfHours===1 ? 'hour' : 'hours'}</div>
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
                        <CreateTrip data={params.data} functions={params.functions}/>
                    </>}
                </div>
            </div>
        </div>
    );
}

RestaurantBooking.propTypes = {
    header: PropTypes.string,
    restaurant: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
}

export default RestaurantBooking;