import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaRegCalendarAlt } from 'react-icons/fa';

// The field itself: it shows the date and opens the calendar, but can't be typed into, so it is never left empty
const DateInput = forwardRef(function DateInput({ value, onClick, onFocus, onBlur, onKeyDown, className }, ref) {
    return (
        <input ref={ref} className={`${className ?? ''} date-field`} value={value} readOnly
               onClick={onClick} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown}/>
    );
});

DateInput.propTypes = {
    value: PropTypes.string,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onKeyDown: PropTypes.func,
    className: PropTypes.string,
};

// Every date in the app is picked with this: it always holds a date (callers start it at today), days outside
// minDate/maxDate can't be picked, and inPopup draws the calendar above the popup instead of inside it
const DateField = ({ selected, onChange, minDate, maxDate, inPopup = false, style }) => (
    <div className='datepicker-container' style={style}>
        <DatePicker
            selected={selected}
            onChange={(date) => { if(date) onChange(date); }}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat="dd/MM/yyyy"
            customInput={<DateInput/>}
            portalId={inPopup ? 'datepicker-portal' : undefined}
        />
        <FaRegCalendarAlt className='calendar-img'/>
    </div>
);

DateField.propTypes = {
    selected: PropTypes.instanceOf(Date).isRequired,
    onChange: PropTypes.func.isRequired,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
    inPopup: PropTypes.bool,
    style: PropTypes.object,
};

export default DateField;
