import { useState, useEffect } from 'react';
import FlightFliter from '../Components/FlightFliter';
import RangeSlider from '../Components/RangeSlider';
import { WiSunrise } from "react-icons/wi";
import { WiDaySunny } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { WiMoonrise } from "react-icons/wi";
import PaginatedItemBars from '../Components/PaginatedItemBars';
import FlightBooking from '../Components/FlightBooking';
import { apiFetch } from '../api';

const seatClassOptions = [
    { value: '', label: 'All classes' },
    { value: 'Economy', label: 'Economy' },
    { value: 'Business', label: 'Business' },
    { value: 'First', label: 'First' }
];

// What the page lists before the user searches: one way flights from Dhaka to anywhere, in every seat class
const defaultSearch = {departureAirport: 'DAC', arrivalAirport: '', seatClass: '', flightStyle: 'One Way'};

// Runs FETCH_FILTERED_FLIGHTS; an empty airport or seat class means any
const fetchFlights = async (search) => {
    const response = await apiFetch(`http://localhost:3000/flight/filtered-flights`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(search),
    });
    return response.ok ? await response.json() : [];
}

const marks = {
    4000: '৳4,000',
    8000: '৳8,000',
    12000: '৳12,000',
    16000: '৳16,000',
    20000: '৳20,000'
};

const airlines = ["Air Astra","Novo Air","US-Bangla","Biman Bangladesh"];

// Six-hour parts of the day, picked in the time filters
const times =  [{
                    startHour: 0,
                    icon: <WiSunrise className='time-img'/>,
                    label: "0 - 6"
                },
                {
                    startHour: 6,
                    icon: <WiDaySunny className='time-img'/>,
                    label: "6 - 12"
                },
                {
                    startHour: 12,
                    icon: <WiSunset className='time-img'/>,
                    label: "12 - 18"
                },
                {
                    startHour: 18,
                    icon: <WiMoonrise className='time-img'/>,
                    label: "18 - 0"
                }];

// Whether a flight time falls in times[slot]; only the time of day counts
const inTimeSlot = (time, slot) => time.getHours() >= times[slot].startHour && time.getHours() < times[slot].startHour + 6;

const noTimeSlots = times.map(() => false);

// Whether a flight time falls in one of the picked parts of the day (none picked means any time)
const inPickedSlots = (time, picked) => !picked.includes(true) || picked.some((isPicked, slot) => isPicked && inTimeSlot(time, slot));

const Flights = () => {
    const [showBooking, setShowBooking] = useState(false);
    const [departureAirport, setDepartureAirport] = useState(defaultSearch.departureAirport);
    const [arrivalAirport, setArrivalAirport] = useState(defaultSearch.arrivalAirport);
    const airportSet = {departureAirport, arrivalAirport, setDepartureAirport, setArrivalAirport};

    const [seatClass, setSeatClass] = useState(defaultSearch.seatClass);

    const [flightStyle, setFlightStyle] = useState(defaultSearch.flightStyle);
    const flightStyleSet = {flightStyle, setFlightStyle};

    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const dateSet = {departureDate, returnDate, setDepartureDate, setReturnDate};

    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const seatNumberSet = {numberOfSeats, setNumberOfSeats};

    const [filteredFlights, setFilteredFlights] = useState(null); // null while the first search is running
    const [searched, setSearched] = useState(defaultSearch); // the search the list shows
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [prices, setPrices] = useState([4000,20000]);
    const [airlinesChecked, setAirlinesChecked] = useState([false,false,false,false]);
    // the parts of the day picked in each time filter; several can be picked at once
    const [departureTimes, setDepartureTimes] = useState(noTimeSlots);
    const [arrivalTimes, setArrivalTimes] = useState(noTimeSlots);
    const [returnDepartureTimes, setReturnDepartureTimes] = useState(noTimeSlots);
    const [returnArrivalTimes, setReturnArrivalTimes] = useState(noTimeSlots);

    const [flight, setFlight] = useState(undefined);

    const [airportOptions, setAirportOptions] = useState([]);

    useEffect(()=>{
        const fetchAirports = async () => {
            const response = await apiFetch(`http://localhost:3000/flight/airports`, {
                method: "GET",
            });
            const airports = await response.json();

            setAirportOptions(airports.map((airport)=>({
                value: airport.iata_code,
                label: `${airport.name} (${airport.district_name})`
            })));
        }
        fetchAirports();
    }, []);

    // Searches again whenever the route, seat class or trip type changes
    // (the date and number of seats only change which flights can be booked, worked out below)
    useEffect(() => {
        let ignore = false;
        const search = {departureAirport, arrivalAirport, seatClass, flightStyle};
        fetchFlights(search).then(flights => {
            if(!ignore)
            {
                setFilteredFlights(flights);
                setSearched(search);
            }
        });
        return () => { ignore = true; };
    }, [departureAirport, arrivalAirport, seatClass, flightStyle]);

    const arrivalOptions = [{ value: '', label: 'All airports' }, ...airportOptions];

    const resetFilter = () => {
        setIsFilterApplied(false);

        setPrices([4000,20000]);
        setDepartureTimes(noTimeSlots);
        setArrivalTimes(noTimeSlots);
        setReturnDepartureTimes(noTimeSlots);
        setReturnArrivalTimes(noTimeSlots);
        setAirlinesChecked([false,false,false,false]);
    }

    const checkAirline = (index) => {
        let temp = [...airlinesChecked];
        temp[index] = !temp[index];
        setAirlinesChecked(temp);
        setIsFilterApplied(true);
    }

    const toggleTimeSlot = (setPicked, index) => {
        setPicked(picked => picked.map((isPicked, slot) => slot===index ? !isPicked : isPicked));
        setIsFilterApplied(true);
    }

    // A row of part-of-day buttons for one time filter
    const timeSlotPicker = (picked, setPicked) =>
        <div className='all-times-container'>
            {times.map((time,index)=>
                <div key={index} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                    <button type="button" className={'time-container' + (picked[index] ? ' selected' : '')}
                            aria-pressed={picked[index]} aria-label={`${time.label} hours`}
                            onClick={()=>toggleTimeSlot(setPicked, index)}>
                        {time.icon}
                    </button>
                    <label className='time-label'>{time.label}</label>
                </div>
            )}
        </div>;

    const compareWithSystemTime = (time, targetTime) => {
        const currtime = new Date();
        const compTime = new Date(departureDate);
        compTime.setHours(0,0,0,0);
        currtime.setHours(0,0,0,0);

        if(compTime > currtime)
        {
            return true;
        }

        const currentHour = targetTime.getHours();
        const currentMinute = targetTime.getMinutes();

        const targetHour = time.getHours();
        const targetMinute = time.getMinutes();

        return targetHour >= currentHour+2 || (targetHour >= currentHour+1 && targetMinute >= currentMinute);
    }

    const filterCheck = (flight) => {
        let isChecked = true;

        if(isChecked)
        {
            isChecked = flight.seat_price>=prices[0] && flight.seat_price<=prices[1];
        }

        if(isChecked)
        {
            let time = new Date(flight.departure_time);
            const currTime = new Date();
            isChecked = compareWithSystemTime(time, currTime) && inPickedSlots(time, departureTimes);
        }

        if(isChecked)
        {
            let time = new Date(flight.arrival_time)
            isChecked = inPickedSlots(time, arrivalTimes);
        }

        if(flight.flight_style==="Round Trip")
        {
            if(isChecked)
            {
                let time = new Date(flight.return_departure_time);
                let targetTime = new Date(flight.arrival_time);
                isChecked = compareWithSystemTime(time, targetTime) && inPickedSlots(time, returnDepartureTimes);
            }

            if(isChecked)
            {
                let time = new Date(flight.return_arrival_time)
                isChecked = inPickedSlots(time, returnArrivalTimes);
            }
        }

        if(isChecked)
        {
            for(let i=0;i<4;i++)
            {
                if(airlinesChecked[i])
                {
                    isChecked = flight.airline_name===airlines[i];
                    if(isChecked) break;
                }
            }
        }

        return isChecked;
    }

    const openBooking = (item) => {
        setShowBooking(true);
        setFlight(item);
    }

    // the class and trip type come from the flight picked, since a list can mix seat classes
    const bookingDetails = {
        departureDate,
        returnDate: flight?.flight_style==="Round Trip" ? returnDate : undefined,
        numberOfSeats,
        seatClass: flight?.seat_class
    }

    // e.g. "One Way flights from DAC to CGP, Business class"
    const listTitle = `${searched.flightStyle} flights from ${searched.departureAirport}`
        + (searched.arrivalAirport ? ` to ${searched.arrivalAirport}` : '')
        + (searched.seatClass ? `, ${searched.seatClass} class` : '');

    // flights leaving too soon to book are hidden unless filters are set
    const shownFlights = (filteredFlights ?? []).filter(flight =>
        isFilterApplied ? filterCheck(flight) : compareWithSystemTime(new Date(flight.departure_time), new Date()));

    const emptyMessage = filteredFlights===null ? 'Loading flights…'
        : isFilterApplied ? 'No flights match these filters.'
        : filteredFlights.length===0 ? 'No flights found for this search.'
        : 'No more flights today. Pick a later departure date.';

    return (
        <>
            {showBooking && <FlightBooking flight={flight} setShowConfirmationMessage={setShowBooking} bookingDetails={bookingDetails}/>}
            <FlightFliter airportSet={airportSet} seatClass={seatClass} setSeatClass={setSeatClass} dateSet={dateSet} flightStyleSet={flightStyleSet} seatNumberSet={seatNumberSet} airportOptions={airportOptions} arrivalOptions={arrivalOptions} seatClassOptions={seatClassOptions}/>

            <div className='destination-search' style={{marginTop: "20px"}}>
                <div className="filter">
                    <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>

                    <h3>Price Range</h3>
                    <RangeSlider marks={marks} minValue={4000} maxValue={20000} values={prices} setValues={setPrices} setIsFilterApplied={setIsFilterApplied}/>

                    <h3>Departure Time:</h3>
                    {timeSlotPicker(departureTimes, setDepartureTimes)}

                    <h3>Arrival Time:</h3>
                    {timeSlotPicker(arrivalTimes, setArrivalTimes)}

                    {flightStyle==="Round Trip" &&
                    <>
                        <h3>Return Departure Time:</h3>
                        {timeSlotPicker(returnDepartureTimes, setReturnDepartureTimes)}

                        <h3>Return Arrival Time:</h3>
                        {timeSlotPicker(returnArrivalTimes, setReturnArrivalTimes)}
                    </>}

                    <div style={{margin: '40px 0px 40px 0px'}}>
                        <h3>Choose Your Preferred Airline:</h3>
                        <label><input type="checkbox" checked={airlinesChecked[0]} onChange={()=>checkAirline(0)}/>Air Astra</label><br/>
                        <label><input type="checkbox" checked={airlinesChecked[1]} onChange={()=>checkAirline(1)}/>Novo Air</label><br/>
                        <label><input type="checkbox" checked={airlinesChecked[2]} onChange={()=>checkAirline(2)}/>US-Bangla</label><br/>
                        <label><input type="checkbox" checked={airlinesChecked[3]} onChange={()=>checkAirline(3)}/>Biman Bangladesh</label><br/>
                    </div>
                    
                </div>
                <div className='recommendation-container browse-results'>
                    <div className='browse-results-header'>
                        <h1>{listTitle}</h1>
                    </div>
                    <PaginatedItemBars itemType='flight' items={shownFlights} showBooking={openBooking} emptyMessage={emptyMessage}/>
                </div>
            </div>
        </>
    );
}

export default Flights;