import { useContext, useState } from "react";
import AgentSearch from './AgentSearch';
import DateField from './DateField';
import PropTypes from 'prop-types';
import UserInfoContext from '../Context/UserInfoContext';
import { apiFetch } from '../api';
import { errorMessage, formatDate, startOfDay, toApiDate } from './tripHelpers';
import '../Styles/login-signup.css';
import '../Styles/form-fields.css';
import '../Styles/trips.css';

// A customer creates a trip. When it is made for a booking (fromDate/toDate), the trip's dates must include the booking's.
// The name and the agent are optional: an unnamed trip is called "Trip N", and the agent can be chosen later from My Trips.
const CreateTrip = ({onCreated, onCancel, fromDate, toDate}) => {
    const { userInfo } = useContext(UserInfoContext);
    const today = startOfDay(new Date());
    const [tripName, setTripName] = useState('');
    const [departureDate, setDepartureDate] = useState(startOfDay(fromDate ?? today));
    const [returnDate, setReturnDate] = useState(startOfDay(toDate ?? fromDate ?? today));

    // The name a trip gets when it is left empty: "Trip N" after the customer's trip count, skipping names they already use
    const takenNames = new Set((userInfo?.trips ?? []).map(trip => trip.name));
    let defaultNumber = (userInfo?.trips?.length ?? 0) + 1;
    while(takenNames.has(`Trip ${defaultNumber}`))
    {
        defaultNumber++;
    }
    const defaultName = `Trip ${defaultNumber}`;
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
        const name = tripName.trim() || defaultName;
        if(tripName.trim() !== "" && !isTripNameUnique)
        {
            setError("You already have a trip with this name");
            return;
        }
        if(selectAnAgent && agent === undefined)
        {
            setError("Pick an agent from the search, or choose Later");
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
                name: name,
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
        onCreated(tripId, name);
    }

    // Laid out like the sign-up and login forms: each field's name above it, and a fixed slot for its warning
    return(
    <div className='create-trip styled-form'>
        <div className='message-title'>Create a new trip</div>

        <label className='create-trip-field'>
            <span className='field-label'>Trip name (Optional)</span>
            {/* left empty, the trip gets the name shown in the placeholder */}
            <input type='text' aria-invalid={!isTripNameUnique} value={tripName} placeholder={defaultName} onChange={handleTripNameChange}/>
        </label>
        <div className='field-warning-slot'>
            {!isTripNameUnique && <h5 className='field-warning'>You already have a trip with this name</h5>}
        </div>

        <div className='create-trip-field'>
            <span className='field-label'>Agent</span>
            <div className='create-trip-choices'>
                <label><input type="radio" name="selectAnAgent" checked={selectAnAgent} onChange={()=>setSelectAnAgent(true)} />Choose one now</label>
                <label><input type="radio" name="selectAnAgent" checked={!selectAnAgent} onChange={()=>setSelectAnAgent(false)} />Later, maybe</label>
            </div>
            {selectAnAgent &&
            <>
                <AgentSearch setProfile={setAgent}/>
                {agent && <p className='trip-form-note'>Agent: <strong>{agent.username}</strong></p>}
            </>}
        </div>

        <div className='create-trip-dates'>
            <label className='create-trip-field'>
                <span className='field-label'>Departure <span className='required'>*</span></span>
                <DateField selected={departureDate} onChange={handleDepartureDateChange} minDate={today} maxDate={fromDate ? startOfDay(fromDate) : undefined} inPopup/>
            </label>
            <label className='create-trip-field'>
                <span className='field-label'>Return <span className='required'>*</span></span>
                <DateField selected={returnDate} onChange={handleReturnDateChange} minDate={toDate && startOfDay(toDate) > departureDate ? startOfDay(toDate) : departureDate} inPopup/>
            </label>
        </div>
        <div className='field-warning-slot'>
            {error && <h5 className='field-warning'>{error}</h5>}
        </div>

        <div className='popup-buttons'>
            <button className='custom-btn' style={{color:"black"}} disabled={isSaving} onClick={createTripPackage}>Create Trip</button>
            <button className='custom-btn' style={{color:"black"}} onClick={onCancel}>Back</button>
        </div>
    </div>);
}

CreateTrip.propTypes = {
    onCreated: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
}

export default CreateTrip;
