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
import TimePicker from './TimePicker';

const types = ['arrival', 'departure'];

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

    const bookingCost = restaurant.BOOKING_COST;
    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const [bookingDate, setBookingDate] = useState(new Date());
    const [totalCost, setTotalCost] = useState(restaurant.BOOKING_COST);
    const [arrivalTime, setArrivalTime] = useState({hour: 9, minute: 0, am: true});
    const [departureTime, setDepartureTime] = useState({hour: 10, minute: 0, am: true});

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
            setTotalCost((totalCost/numberOfSeats)*(numberOfSeats+1));
        }
        else
        {
            if(numberOfSeats > 1)
            {
                setNumberOfSeats(parseInt(numberOfSeats)-1);
                setTotalCost((totalCost/numberOfSeats)*(numberOfSeats-1));
            }
        }
    }

    const handleSeatNumberChange = (e) => {
        const isValid = /^[1-9]\d*$/.test(e.target.value);

        if(e.target.value.length === 0)
        {
            setNumberOfSeats(e.target.value);
            setTotalCost(bookingCost);
        }
        if(isValid)
        {
            setNumberOfSeats(parseInt(e.target.value));
            setTotalCost(bookingCost*e.target.value);
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

    const formatTimestamp = ({ hour, minute, am }) => {
        const ampm = am ? 'AM' : 'PM';
        const formattedHour = am ? (hour === 12 ? 0 : hour) : hour + 12;
        const timestampString = `${formattedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
        return timestampString;
    }

    const addBooking = async (tripId) => {
        const at = (arrivalTime.hour + (arrivalTime.am ? 0 : 12)) * 60 + arrivalTime.minute;
        const dt = (departureTime.hour + (departureTime.am ? 0 : 12)) * 60 + departureTime.minute;

        if(at>dt-60)
        {
            alert("Arrival time must be at least 1 hour before departure time");
        }
        else if(at>(20*60))
        {
            alert("Arrival time must be before 8:00 PM");
        }
        else
        {
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
    
            let inDate = new Intl.DateTimeFormat('en-US', options).format(bookingDate);
            if(inDate.includes(', 24:')) {
                inDate = inDate.replace(', 24:', ', 00:');
            }

            let inTime = formatTimestamp(arrivalTime);
            let outTime = formatTimestamp(departureTime);
    
            const response = await fetch(`http://localhost:3000/booking/add-restaurant-booking`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId: restaurant.RESTAURANT_ID,
                    tripId: tripId,
                    bookingDate: inDate,
                    arrivalTime: inTime,
                    departureTime: outTime,
                    numberOfSeats: numberOfSeats,
                    totalCost: totalCost,
                    bookingType: 'RESTAURANT'
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
    }

    const setCreateTrip = (param) => {
        if(!param)
        {
            setPage(5);
        }
    }

    const setTime = (type) => {
        const element = document.getElementById(`${type}-time-picker`);
        console.log(type)
        element.style.display = 'flex';
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
                        <div style={{display: 'flex', width: '100%', height: '50%', flexDirection: 'column', justifyContent: "space-between"}}>
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

                            <label>Arrival Time: <span style={{cursor: 'pointer'}} onClick={()=>setTime(types[0])}>{arrivalTime.hour.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:{arrivalTime.minute.toLocaleString('en-US', { minimumIntegerDigits: 2 })} {arrivalTime.am ? 'AM' : 'PM'}</span>
                                <TimePicker time={arrivalTime} setTime={setArrivalTime} type={types[0]}/>
                            </label>

                            <label>Departure Time: <span style={{cursor: 'pointer'}} onClick={()=>setTime(types[1])}>{departureTime.hour.toLocaleString('en-US', { minimumIntegerDigits: 2 })}:{departureTime.minute.toLocaleString('en-US', { minimumIntegerDigits: 2 })} {departureTime.am ? 'AM' : 'PM'}</span>
                                <TimePicker time={departureTime} setTime={setDepartureTime} type={types[1]}/>
                            </label>
                        </div>
                        
                        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <div>Total Booking Price: ৳ {totalCost.toLocaleString('en-US')}</div>
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

RestaurantBooking.propTypes = {
    header: PropTypes.string,
    restaurant: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
}

export default RestaurantBooking;