import { useContext, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import AgentSearch from './AgentSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FaRegCalendarAlt} from 'react-icons/fa';
import PropTypes from 'prop-types';

const CreateTrip = (props) => {
    const {setCreateTrip} = props;
    const {userInfo, setInfo} = useContext(UserInfoContext);

    const [tripName, setTripName] = useState('');
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [agent, setAgent] = useState(undefined);
    const [isTripNameUnique, setIsTripNameUnique] = useState(true);

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

    const handleTripNameChange = async (e) =>
    {
        setTripName(e.target.value);
        if(e.target.value !== "")
        {
            const response = await fetch(`http://localhost:3000/trip/check-tripname?tripName=${e.target.value}`, {
                method: "GET"
            });

            const result = await response.json();
            if(result === 1)
            {
                setIsTripNameUnique(false);
            }
            else
            {
                setIsTripNameUnique(true);
            }
        }
        else
        {
            setIsTripNameUnique(true);
        }
    
    }

    const createTripPackage = async () => {
        if(tripName === "" || !isTripNameUnique)
        {
            alert("Please enter a valid trip name");
        } 
        else if(agent===undefined)
        {
            alert("Please select an agent");
        }
        else
        {
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
                    agentId: agent.USER_ID,
                    name: tripName,
                    departureDate: inDate,
                    returnDate: outDate,
                    totalCost: 0,
                    discount: 0,
                    tripStatus: 'REQUESTING',
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
            setCreateTrip(false);
        }
    } 

    return(
    <>
        <div className='message-title'>Create a new trip -</div>
            <div className='trip-creation-container'>
                <label>Trip Name: <input type='text' value={tripName} placeholder='Enter a name' onChange={handleTripNameChange}/></label>
                {!isTripNameUnique ? <h5 style={{ color: "red" }}>Trip name already exists</h5> : <br/>}

                <label>Search for an agent: <AgentSearch setProfile={setAgent}/></label>

                <label> Departure Date:
                    <div style={{display: 'inline-block', marginLeft: '5px'}}>
                        <div className='datepicker-container'>
                            <DatePicker
                                selected={departureDate}
                                onChange={(e)=>handleDepartureDateChange(e)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Departure Date"
                            />
                            <FaRegCalendarAlt className='calendar-img'/>
                        </div>
                    </div>
                </label><br/>

                <label> Return Date:
                    <div style={{display: 'inline-block', marginLeft: '5px'}}>
                        <div className='datepicker-container'>
                            <DatePicker
                                selected={returnDate}
                                onChange={(e)=>handleReturnDateChange(e)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Return Date"
                            />
                            <FaRegCalendarAlt className='calendar-img'/>
                        </div>
                    </div>
                </label>
            </div>
        <button className='custom-btn' onClick={createTripPackage}>Create Trip</button>
    </>);
}

CreateTrip.propTypes = {
    setCreateTrip: PropTypes.func.isRequired
}

export default CreateTrip;