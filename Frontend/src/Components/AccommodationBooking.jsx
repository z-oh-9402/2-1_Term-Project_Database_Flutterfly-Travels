import '../Styles/confirmation-message.css';
import '../Styles/login-signup.css';
import '../Styles/button.css';

import { ImCross } from 'react-icons/im';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { FaMinus, FaPlus, FaRegCalendarAlt } from 'react-icons/fa';
import UserInfoContext from '../Context/UserInfoContext';
import CreateTrip from './CreateTrip';


const message = ["Would you like to book this accommodation?",
    "How would you like to add this accommodation to your package?",
    "No already created trip package exists. Would you like to create a new one?"];

const AccommodationBooking = ({ accommodation, setShowConfirmationMessage }) => {
    const {userInfo, setInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);

    const filterTrips = (trip) => {
        let found = false;

        if(trip.trip_status==='UPDATING')
        {
            for(let a of trip.accommodations)
            {
                if(a.accommodation_id === accommodation.accommodation_id)
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
        const t = userInfo.trips.filter(trip => !filterTrips(trip));
        setTrips(t);
    }, [userInfo.trips]);

    const roomPrice = accommodation.room_price;
    const [page, setPage] = useState(1);

    const [numberOfRooms, setNumberOfRooms] = useState(1);

    const date = new Date();
    const [checkInDate, setCheckInDate] = useState(new Date(date));
    const [checkOutDate, setCheckOutDate] = useState(new Date(date.setDate(date.getDate()+1)));
    const [numberOfDays, setNumberOfDays] = useState(1);
    const [totalCost, setTotalCost] = useState(roomPrice);

    useEffect(() => {
        const resizeComponent = () => {
            if(page===2 || page===5 || page===6)
            {
                const loginSignupContainer = document.querySelector('.confirmation-message-container');
                loginSignupContainer.style.height = '420px';
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
            setNumberOfRooms(parseInt(numberOfRooms)+1);
            setTotalCost((totalCost/numberOfRooms)*(numberOfRooms+1));
        }
        else
        {
            if(numberOfRooms > 1)
            {
                setNumberOfRooms(parseInt(numberOfRooms)-1);
                setTotalCost((totalCost/numberOfRooms)*(numberOfRooms-1));
            }
        }
    }

    const handleSeatNumberChange = (e) => {
        const isValid = /^[1-9]\d*$/.test(e.target.value);
        if(isValid || e.target.value.length === 0)
        {
            setNumberOfRooms(e.target.value);
            setTotalCost(roomPrice*e.target.value*numberOfDays);
        }
    }

    const fixValue = () => {
        if(numberOfRooms.length === 0)
        {
            setNumberOfRooms(1);
        }
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
                const days = Math.round((checkOutDate-date)/86400000);
                setNumberOfDays(days);
                setTotalCost(roomPrice*numberOfRooms*days)
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
            const days = Math.round((date-checkInDate)/86400000);
            setCheckOutDate(new Date(date));
            setNumberOfDays(days);
            setTotalCost(roomPrice*numberOfRooms*days);
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

        let inDate = new Intl.DateTimeFormat('en-US', options).format(checkInDate);
        if(inDate.includes(', 24:')) {
            inDate = inDate.replace(', 24:', ', 00:');
        }

        let outDate = new Intl.DateTimeFormat('en-US', options).format(checkOutDate);
        if(outDate.includes(', 24:')) {
            outDate = outDate.replace(', 24:', ', 00:');
        }

        const response = await fetch(`http://localhost:3000/booking/add-accommodation-booking`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: accommodation.accommodation_id,
                tripId: tripId,
                checkInDate: inDate,
                checkOutDate: outDate,
                numberOfRooms: numberOfRooms,
                totalCost: totalCost,
                bookingType: 'ACCOMMODATION'
            }),
        });

        const data = await response.json();
        if(data.status === "ok")
        {
            if(userInfo.user_type === 'customer')
            {
                const response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.user_id}`, {
                    method: "GET"
                });

                const result = await response.json();
                userInfo.trips = result;
            }
            if(userInfo.user_type === 'agent')
            {
                const response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.user_id}`, {
                    method: "GET"
                });

                const result = await response.json();
                userInfo.trips = result;
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
                        <div className='message-title'>Book accommodation -</div>
                        <p className='message-content'>{message[page-1]}</p>
                        <div style={{width: '150px', display: 'flex', justifyContent: 'space-between'}}>
                            <button className='custom-btn btn-yes' onClick={goToNextPage}>Yes</button>
                            <button className='custom-btn btn-no' onClick={handleGoToCurrentPage}>Cancel</button>
                        </div>
                    </>}

                    {page===2 &&
                    <>
                        <div className='message-title'>Book accommodation -</div>
                        <label>Number of rooms: 
                            <div style={{position: "relative", display: 'inline-block', marginLeft: "5px"}}>
                                <input className='seat-number' type="text" value={numberOfRooms} onChange={handleSeatNumberChange} onBlur={fixValue}/>
                                {numberOfRooms.length!==0 &&
                                <FaMinus className='seat-number-buttons minus' onClick={()=>changeSeatNumber(false)} />}
                                {numberOfRooms.length!==0 &&
                                <FaPlus className='seat-number-buttons plus' onClick={()=>changeSeatNumber(true)} />}
                            </div>
                        </label>

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
                                <div>Total Room Price: ৳ {totalCost.toLocaleString('en-US')}</div>
                            </div>
                        </div>
                        
                        <button className='custom-btn' onClick={()=>setPage(trips.length!==0 ? (userInfo.user_type==='customer' ? 3 : 5) : 4)}>Next</button>
                    </>}

                    {page===3 &&
                    <>
                        <div className='message-title'>Book accommodation -</div>
                        <p className='message-content'>{message[1]}</p>
                        <div>
                            <button className='custom-btn' onClick={() => setPage(5)}>Add to an existing package</button>
                            <button className='custom-btn' onClick={() => setPage(6)}>Create a new package</button>
                        </div>
                    </>}

                    {page===4 &&
                    <>
                        <div className='message-title'>Book accommodation -</div>
                        <p className='message-content'>{message[2]}</p>
                        <div>
                            <button className='custom-btn' onClick={() => setPage(6)}>Create a new package</button>
                        </div>
                    </>}

                    {page===5 &&
                    <>
                        <div className='message-title'>Book accommodation -</div>
                        <div className='trips-container'>
                            {trips.map((trip, index) => 
                            <div key={index} className='trip-item'>
                                <div>
                                    <div className='trip-name'>{trip.name}</div>
                                    <div>Departure Date:&nbsp;
                                        {new Date(trip.departure_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>Return Date:&nbsp;
                                        {new Date(trip.return_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </div>
                                    <div>Total Cost: ৳ {(trip.total_cost).toLocaleString('en-US')}</div>
                                    <div>Agent: {trip.username ? trip.username : 'Not Set'}</div>
                                </div>
                                <button className='custom-btn plus-button' onClick={()=>addBooking(trip.trip_id)}>+</button>
                            </div>)}
                        </div>
                    </>}

                    {page===6 &&
                    <>
                        <CreateTrip initDepartureDate={checkInDate} initReturnDate={checkOutDate} setCreateTrip={setCreateTrip}/>
                    </>}
                </div>
            </div>
        </div>
    );
};

AccommodationBooking.propTypes = {
    accommodation: PropTypes.object,
    setShowConfirmationMessage: PropTypes.func
};

export default AccommodationBooking;