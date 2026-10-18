import { useState } from "react";
import AgentSearch from './AgentSearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FaRegCalendarAlt} from 'react-icons/fa';
import PropTypes from 'prop-types';
import { apiFetch } from '../api';
import { addDays, errorMessage, formatDate, startOfDay, toApiDate } from './tripHelpers';

// A customer creates a trip. When it is made for a booking (fromDate/toDate), the trip's dates must include the booking's.
// The agent is optional: they can also be chosen later from My Trips.
const CreateTrip = ({onCreated, onCancel, fromDate, toDate}) => {
    const [tripName, setTripName] = useState('');
    const [departureDate, setDepartureDate] = useState(startOfDay(fromDate ?? new Date()));
    const [returnDate, setReturnDate] = useState(startOfDay(toDate ?? addDays(fromDate ?? new Date(), 1)));
    const [agent, setAgent] = useState(undefined);
    const [isTripNameUnique, setIsTripNameUnique] = useState(true);
    const [selectAnAgent, setSelectAnAgent] = useState(false);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleDepartureDateChange = (date) =>
    {
        if(startOfDay(date) < startOfDay(new Date()))
        {
            setError("The trip can't start in the past");
        }
        else if(fromDate && startOfDay(date) > startOfDay(fromDate))
        {
            setError(`The trip must start by ${formatDate(fromDate)}, the first day of this booking`);
        }
        else
        {
            setError(null);
            setDepartureDate(startOfDay(date));
            if(returnDate < startOfDay(date))
            {
                setReturnDate(startOfDay(date));
            }
        }
    }

    const handleReturnDateChange = (date) =>
    {
        if(startOfDay(date) < departureDate)
        {
            setError("The trip can't end before it starts");
        }
        else if(toDate && startOfDay(date) < startOfDay(toDate))
        {
            setError(`The trip must last until ${formatDate(toDate)}, the last day of this booking`);
        }
        else
        {
            setError(null);
            setReturnDate(startOfDay(date));
        }
    }

    const handleTripNameChange = async (e) =>
    {
        const name = e.target.value;
        setTripName(name);
        setError(null);
        if(name.trim() === "")
        {
            setIsTripNameUnique(true);
            return;
        }

        const response = await apiFetch(`http://localhost:3000/trip/check-tripname?tripName=${encodeURIComponent(name)}`, {
            method: "GET"
        });
        if(response.ok)
        {
            setIsTripNameUnique(await response.json() !== 1);
        }
    }

    const createTripPackage = async () => {
        if(tripName.trim() === "")
        {
            setError("Give the trip a name");
            return;
        }
        if(!isTripNameUnique)
        {
            setError("You already have a trip with this name");
            return;
        }
        if(selectAnAgent && agent === undefined)
        {
            setError("Pick an agent from the search, or choose No");
            return;
        }

        setIsSaving(true);
        const response = await apiFetch(`http://localhost:3000/trip/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agentId: selectAnAgent ? agent.user_id : null,
                name: tripName.trim(),
                departureDate: toApiDate(departureDate),
                returnDate: toApiDate(returnDate)
            }),
        });
        setIsSaving(false);

        if(!response.ok)
        {
            setError(await errorMessage(response, "Could not create the trip"));
            return;
        }
        const { tripId } = await response.json();
        onCreated(tripId, tripName.trim());
    }

    return(
    <>
        <div className='message-title'>Create a new trip</div>

        <div className='trip-creation-container'>
            <label>Trip Name: <input type='text' value={tripName} placeholder='Enter a name' onChange={handleTripNameChange}/></label>
            {!isTripNameUnique && <h5 className='trip-form-error'>You already have a trip with this name</h5>}

            <div className="radio-group">
                <h3>Choose an agent now?</h3>
                <label className="radio-option">
                    <input type="radio" name="selectAnAgent" checked={selectAnAgent} onChange={()=>setSelectAnAgent(true)} />Yes
                </label>

                <label className="radio-option">
                    <input type="radio" name="selectAnAgent" checked={!selectAnAgent} onChange={()=>setSelectAnAgent(false)} />No, later
                </label>
            </div>

            {selectAnAgent &&
            <div id='select-agent'>
                <span>Search for an agent:</span>
                <AgentSearch setProfile={setAgent}/>
                {agent && <p className='trip-form-note'>Agent: <strong>{agent.username}</strong></p>}
            </div>}

            <label> Departure Date:
                <div style={{display: 'inline-block', marginLeft: '5px'}}>
                    <div className='datepicker-container'>
                        <DatePicker
                            selected={departureDate}
                            onChange={handleDepartureDateChange}
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
                            onChange={handleReturnDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Return Date"
                        />
                        <FaRegCalendarAlt className='calendar-img'/>
                    </div>
                </div>
            </label>

            {error && <p className='trip-form-error'>{error}</p>}
        </div>

        <div className='popup-buttons'>
            <button className='custom-btn' style={{color:"black"}} disabled={isSaving} onClick={createTripPackage}>Create Trip</button>
            <button className='custom-btn' style={{color:"black"}} onClick={onCancel}>Back</button>
        </div>
    </>);
}

CreateTrip.propTypes = {
    onCreated: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
}

export default CreateTrip;
