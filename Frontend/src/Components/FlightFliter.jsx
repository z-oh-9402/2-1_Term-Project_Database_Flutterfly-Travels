import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/flight-filter.css';
import '../Styles/button.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";

import PropTypes from 'prop-types';

const FlightFliter = (props) => {
    const { airportSet, seatClass, setSeatClass, flightStyleSet, dateSet, seatNumberSet, airportOptions, arrivalOptions, seatClassOptions } = props;
    const { departureAirport, arrivalAirport, setDepartureAirport, setArrivalAirport } = airportSet;
    // the option a select shows for a value (null shows the placeholder, e.g. while the airports load)
    const selected = (options, value) => options.find(option => option.value === value) ?? null;
    const { departureDate, returnDate, setDepartureDate, setReturnDate } = dateSet;
    const { flightStyle, setFlightStyle } = flightStyleSet;
    const { numberOfSeats, setNumberOfSeats } = seatNumberSet;

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: '220px',
            boxShadow: 'none',
        }),

        menuList: (provided) => ({
            ...provided,
            maxHeight: '180px',
            overflowY: 'auto',
        })
    };

    const customStyles2 = {
        control: (provided) => ({
            ...provided,
            width: '150px',
            boxShadow: 'none',
        }),

        menuList: (provided) => ({
            ...provided,
            maxHeight: '180px',
            overflowY: 'auto',
        })
    };

    const handleDepartureDateChange = (date) => {
        const sysdate = new Date();

        if (departureDate < sysdate + 1) {
            alert("Departure Date cannot be in the past");
        }
        else {
            setDepartureDate(date);

            if (flightStyle === "Round Trip" && returnDate < date) {
                setReturnDate(date);
            }
        }
    }

    const handleReturnDateChange = (date) => {
        if (flightStyle === "Round Trip" && date < departureDate) {
            setReturnDate(departureDate);
        }
        else {
            setReturnDate(date);
        }
    }

    const changeSeatNumber = (increase) => {

        if (increase) {
            setNumberOfSeats(parseInt(numberOfSeats) + 1);
        }
        else {
            if (numberOfSeats > 1) {
                setNumberOfSeats(parseInt(numberOfSeats) - 1);
            }
        }
    }

    const handleSeatNumberChange = (e) => {
        const isValid = /^[1-9]\d*$/.test(e.target.value);
        if (isValid || e.target.value.length === 0) {
            setNumberOfSeats(e.target.value);
        }
    }

    const fixValue = () => {
        if (numberOfSeats.length === 0) {
            setNumberOfSeats(1);
        }
    }

    return (
        <div className='flight-filter-container'>
            <div className='top-filter'>
                <div style={{marginBottom:"10px"}}>
                    <label style={{ marginRight: "10px" }}>
                        <input checked={flightStyle === 'One Way'} type="radio" name="flight-style" value="One Way" onChange={(e) => setFlightStyle(e.target.value)} />
                        One Way
                    </label>
                    <label>
                        <input checked={flightStyle === 'Round Trip'} type="radio" name="flight-style" value="Round Trip" onChange={(e) => setFlightStyle(e.target.value)} />
                        Round Trip
                    </label>
                </div>
            </div>
            <div className="flight-details-container">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <Select className="select"
                            styles={customStyles}
                            options={airportOptions}
                            value={selected(airportOptions, departureAirport)}
                            onChange={(e) => setDepartureAirport(e.value)}
                            isSearchable
                            placeholder="Flying From"
                        />
                    </div>

                    <Select className="select"
                        styles={customStyles}
                        options={arrivalOptions}
                        value={selected(arrivalOptions, arrivalAirport)}
                        onChange={(e) => setArrivalAirport(e.value)}
                        isSearchable
                        placeholder="Flying To"
                    />
                </div>

                <div >
                    <div className='datepicker-container' style={{ marginBottom: '10px' }}>
                        <DatePicker
                            selected={departureDate}
                            onChange={(e) => handleDepartureDateChange(e)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Departure Date"
                        />
                        <FaRegCalendarAlt className='calendar-img' />
                    </div>

                    {flightStyle === "Round Trip" &&
                        <div className='datepicker-container'>
                            <DatePicker
                                selected={returnDate}
                                onChange={(e) => handleReturnDateChange(e)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Return Date"
                            />
                            <FaRegCalendarAlt className='calendar-img' />
                        </div>}
                </div>

                <Select className="select"
                    styles={{
                        ...customStyles2,
                        menuPortal: base => ({ ...base, zIndex: 9999 }), // Ensure dropdown is on top
                        menu: base => ({ ...base, marginTop: '10px' }) // Adjust the margin to position the dropdown closer to the select input
                    }}
                    options={seatClassOptions}
                    value={selected(seatClassOptions, seatClass)}
                    onChange={(e) => setSeatClass(e.value)}
                    isSearchable
                    placeholder="Seat Class"
                    menuPortalTarget={document.body} // Render dropdown options at the body level
                />

                <div style={{ position: "relative" }}>
                    <input className='seat-number' type="text" value={numberOfSeats} onChange={handleSeatNumberChange} onBlur={fixValue} />
                    {numberOfSeats.length !== 0 &&
                        <FaMinus className='seat-number-buttons minus' onClick={() => changeSeatNumber(false)} />}
                    {numberOfSeats.length !== 0 &&
                        <FaPlus className='seat-number-buttons plus' onClick={() => changeSeatNumber(true)} />}
                </div>

            </div>
        </div>
    );
}

FlightFliter.propTypes = {
    airportSet: PropTypes.object,
    seatClass: PropTypes.string,
    setSeatClass: PropTypes.func,
    flightStyleSet: PropTypes.object,
    dateSet: PropTypes.object,
    seatNumberSet: PropTypes.object,
    airportOptions: PropTypes.array,
    arrivalOptions: PropTypes.array,
    seatClassOptions: PropTypes.array,
};

export default FlightFliter;