import { useState } from 'react';
import FlightFliter from '../Components/FlightFliter';
import RangeSlider from '../Components/RangeSlider';
import { WiSunrise } from "react-icons/wi";
import { WiDaySunny } from "react-icons/wi";
import { WiSunset } from "react-icons/wi";
import { WiMoonrise } from "react-icons/wi";
import ItemBar from '../Components/ItemBar';
import FlightBooking from '../Components/FlightBooking';

const marks = {
    4000: '৳4,000',
    8000: '৳8,000',
    12000: '৳12,000',
    16000: '৳16,000',
    20000: '৳20,000'
};

const airlines = ["Air Astra","Novo Air","US-Bangla","Biman Bangladesh"];

const times =  [{
                    start: new Date('1970-01-01T00:00:00Z'), 
                    end: new Date('1970-01-01T05:59:59Z'), 
                    icon: <WiSunrise className='time-img'/>,
                    label: "0 - 6"
                },  
                {
                    start: new Date('1970-01-01T06:00:00Z'), 
                    end: new Date('1970-01-01T11:59:59Z'), 
                    icon: <WiDaySunny className='time-img'/>,
                    label: "6 - 12"
                }, 
                {
                    start: new Date('1970-01-01T12:00:00Z'), 
                    end: new Date('1970-01-01T17:59:59Z'), 
                    icon: <WiSunset className='time-img'/>,
                    label: "12 - 18"
                }, 
                {
                    start: new Date('1970-01-01T18:00:00Z'), 
                    end: new Date('1970-01-01T23:59:59Z'), 
                    icon: <WiMoonrise className='time-img'/>,
                    label: "18 - 0"
                }];

const Flights = () => {
    const [showBooking, setShowBooking] = useState(false);
    const [departureAirport, setDepartureAirport] = useState("");
    const [arrivalAirport, setArrivalAirport] = useState("");
    const airportSet = {setDepartureAirport, setArrivalAirport};

    const [seatClass, setSeatClass] = useState("");

    const [flightStyle, setFlightStyle] = useState("One Way");
    const flightStyleSet = {flightStyle, setFlightStyle};

    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const dateSet = {departureDate, returnDate, setDepartureDate, setReturnDate};

    const [numberOfSeats, setNumberOfSeats] = useState(1);
    const seatNumberSet = {numberOfSeats, setNumberOfSeats};

    const [filteredFlights, setFilteredFlights] = useState([]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [prices, setPrices] = useState([4000,20000]);
    const [airlinesChecked, setAirlinesChecked] = useState([false,false,false,false]);
    const [departureTime, setDepartureTime] = useState(-1);
    const [arrivalTime, setArrivalTime] = useState(-1);
    const [returnDepartureTime, setReturnDepartureTime] = useState(-1);
    const [returnArrivalTime, setReturnArrivalTime] = useState(-1);

    const [flight, setFlight] = useState(undefined);

    const airportOptions = [
        { value: 'DAC', label: `Hazrat Shahjalal International Airport (Dhaka)` },
        { value: 'CGP', label: `Shah Amanat International Airport (Chittagong)` },
        { value: 'ZYL', label: `Osmani International Airport (Sylhet)` },
        { value: 'RJH', label: `Shah Makhdum Airport (Rajshahi)` },
        { value: 'CXB', label: `Cox's Bazar Airport (Cox's Bazar)` },
        { value: 'JSR', label: `Jashore Airport (Jessore)` },
        { value: 'SPD', label: `Saidpur Airport (Sayedpur)` },
        { value: 'BZL', label: `Barishal Airport (Barisal)` },
    ];

    const seatClassOptions = [
        { value: 'Economy', label: `Economy` },
        { value: 'Business', label: `Business` },
        { value: 'First', label: `First` }
    ];

    const resetFilter = () => {
        setIsFilterApplied(false);

        setPrices([4000,20000]);
        setDepartureTime(-1);
        setArrivalTime(-1);
        setAirlinesChecked([false,false,false,false]);
    }

    const checkAirline = (index) => {
        let temp = [...airlinesChecked];
        temp[index] = !temp[index];
        setAirlinesChecked(temp);
        setIsFilterApplied(true);
    }

    const selectDepartureTime = (index) => {
        setDepartureTime(index);
        setIsFilterApplied(true);
    }

    const selectArrivalTime = (index) => {
        setArrivalTime(index);
        setIsFilterApplied(true);
    }

    const selectReturnDepartureTime = (index) => {
        setReturnDepartureTime(index);
        setIsFilterApplied(true);
    }

    const selectReturnArrivalTime = (index) => {
        setReturnArrivalTime(index);
        setIsFilterApplied(true);
    }

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
            isChecked = flight.SEAT_PRICE>=prices[0] && flight.SEAT_PRICE<=prices[1];
        }

        if(isChecked)
        {
            let time = new Date(flight.DEPARTURE_TIME);
            const currTime = new Date();
            isChecked = compareWithSystemTime(time, currTime);

            if(departureTime!==-1)
            {
                isChecked = isChecked && time>=times[departureTime].start && time<=times[departureTime].end;
            }
        }

        if(isChecked && arrivalTime!==-1)
        {
            let time = new Date(flight.ARRIVAL_TIME)
            isChecked = time>=times[arrivalTime].start && time<=times[arrivalTime].end;
        }

        if(flightStyle==="Round Trip")
        {
            if(isChecked)
            {
                let time = new Date(flight.RETURN_DEPARTURE_TIME);
                let targetTime = new Date(flight.ARRIVAL_TIME);
                isChecked = compareWithSystemTime(time, targetTime);
    
                if(returnDepartureTime!==-1)
                {
                    isChecked = isChecked && time>=times[returnDepartureTime].start && time<=times[returnDepartureTime].end;
                }
            }

            if(isChecked && returnArrivalTime!==-1)
            {
                let time = new Date(flight.RETURN_ARRIVAL_TIME)
                isChecked = isChecked && time>=times[returnArrivalTime].start && time<=times[returnArrivalTime].end;
            }
        }

        if(isChecked)
        {
            for(let i=0;i<4;i++)
            {
                if(airlinesChecked[i])
                {
                    isChecked = flight.AIRLINE_NAME===airlines[i];
                    if(isChecked) break;
                }
            }
        }

        return isChecked;
    }

    const handleSubmit = async () => {
        if(departureAirport==="" || arrivalAirport==="" || seatClass==="" || departureDate===null || (flightStyle==="Round Trip" && returnDate===null) || numberOfSeats==="")
        {
            alert("Please fill all the fields");
        }
        else
        {
            const filter = {
                departureAirport,
                arrivalAirport,
                seatClass,
                flightStyle
            };

            let response = await fetch(`http://localhost:3000/flight/filtered-flights`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(filter),
            });
            
            let result = await response.json();
            result = result.map((flight)=>({
                ...flight,
                DEPARTURE_AIRPORT: departureAirport,
                ARRIVAL_AIRPORT: arrivalAirport,
                SEAT_CLASS: seatClass
            }));

            setFilteredFlights(result);
        }
    }

    const openBooking = (item) => {
        setShowBooking(true);
        setFlight(item);
    }

    const bookingDetails = {
        departureDate,
        returnDate: flightStyle==="Round Trip" ? returnDate : undefined,
        numberOfSeats,
        seatClass
    }

    return (
        <>
            {showBooking && <FlightBooking header={'Book Flight -'} flight={flight} setShowConfirmationMessage={setShowBooking} bookingDetails={bookingDetails}/>}
            <FlightFliter airportSet={airportSet} setSeatClass={setSeatClass} dateSet={dateSet} flightStyleSet={flightStyleSet} seatNumberSet={seatNumberSet} airportOptions={airportOptions} seatClassOptions={seatClassOptions} handleSubmit={handleSubmit}/>

            {filteredFlights.length!==0 &&
                <div className='destination-search' style={{marginTop: "20px"}}>
                    <div className="filter">
                        <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>

                        <h3>Price Range</h3>
                        <RangeSlider marks={marks} minValue={4000} maxValue={20000} values={prices} setValues={setPrices} setIsFilterApplied={setIsFilterApplied}/>

                        <h3>Departure Time:</h3>
                        <div className='all-times-container'>
                            {times.map((time,index)=>
                                <div key={index} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div className='time-container' onClick={()=>selectDepartureTime(index)} style={{backgroundColor: departureTime===index ? 'gray' : 'black'}}>
                                        {time.icon}
                                    </div>
                                    <label className='time-label'>{time.label}</label>
                                </div>
                            )}
                        </div>

                        <h3>Arrival Time:</h3>
                        <div className='all-times-container'>
                            {times.map((time,index)=>
                                <div key={index} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                    <div className='time-container' onClick={()=>selectArrivalTime(index)} style={{backgroundColor: arrivalTime===index ? 'gray' : 'black'}}>
                                        {time.icon}
                                    </div>
                                    <label className='time-label'>{time.label}</label>
                                </div>
                            )}
                        </div>

                        {flightStyle==="Round Trip" &&
                        <>
                            <h3>Return Departure Time:</h3>
                            <div className='all-times-container'>
                                {times.map((time,index)=>
                                    <div key={index} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                        <div className='time-container' onClick={()=>selectReturnDepartureTime(index)} style={{backgroundColor: departureTime===index ? 'gray' : 'black'}}>
                                            {time.icon}
                                        </div>
                                        <label className='time-label'>{time.label}</label>
                                    </div>
                                )}
                            </div>
    
                            <h3>Return Arrival Time:</h3>
                            <div className='all-times-container'>
                                {times.map((time,index)=>
                                    <div key={index} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                        <div className='time-container' onClick={()=>selectReturnArrivalTime(index)} style={{backgroundColor: arrivalTime===index ? 'gray' : 'black'}}>
                                            {time.icon}
                                        </div>
                                        <label className='time-label'>{time.label}</label>
                                    </div>
                                )}
                            </div>
                        </>}

                        <div style={{margin: '40px 0px 40px 0px'}}>
                            <h3>Choose Your Preferred Airline:</h3>
                            <label><input type="checkbox" checked={airlinesChecked[0]} onChange={()=>checkAirline(0)}/>Air Astra</label><br/>
                            <label><input type="checkbox" checked={airlinesChecked[1]} onChange={()=>checkAirline(1)}/>Novo Air</label><br/>
                            <label><input type="checkbox" checked={airlinesChecked[2]} onChange={()=>checkAirline(2)}/>US-Bangla</label><br/>
                            <label><input type="checkbox" checked={airlinesChecked[3]} onChange={()=>checkAirline(3)}/>Biman Bangladesh</label><br/>
                        </div>
                        
                    </div>
                    <div className='recommendation-container'>
                        <h1>Searched Flights -</h1>
                        <div className='card-container'>
                            {filteredFlights.map((flight,index)=>
                                (isFilterApplied ? filterCheck(flight) : compareWithSystemTime(new Date(flight.DEPARTURE_TIME), new Date())) && <ItemBar key={index} itemType='flight' item={flight} index={`${index}`} showBooking={openBooking}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default Flights;