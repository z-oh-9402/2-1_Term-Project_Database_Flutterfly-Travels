import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import { FaMinus, FaPlus } from 'react-icons/fa';
import '../Styles/confirmation-message.css';
import '../Styles/login-signup.css';
import '../Styles/button.css';
import '../Styles/form-fields.css';
import '../Styles/my-trips.css';

// The dimmed, blurred overlay and card every booking popup is shown in
export const BookingPopup = ({ onClose, children }) => (
    <div className='login-signup-popup booking-overlay'>
        <div className="close-container" style={{position: 'relative'}}>
            <div className='login-signup-container confirmation-message-container booking-popup'>
                <ImCross className='close2' onClick={onClose}/>
                {children}
            </div>
        </div>
    </div>
);

BookingPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node,
};

// A count of rooms or seats: typed or stepped with − and +, never below 1.
// While the box is being retyped the value can be '', which counts as 1 when the box loses focus.
export const CountStepper = ({ value, setValue }) => {
    const count = Number(value) || 1;

    const handleChange = (e) => {
        if(/^[1-9]\d*$/.test(e.target.value) || e.target.value === '')
        {
            setValue(e.target.value === '' ? '' : Number(e.target.value));
        }
    }

    return (
        <div className='count-stepper'>
            <input className='seat-number' type="text" value={value} onChange={handleChange} onBlur={() => value === '' && setValue(1)}/>
            <FaMinus className='seat-number-buttons minus' onClick={() => setValue(Math.max(1, count - 1))}/>
            <FaPlus className='seat-number-buttons plus' onClick={() => setValue(count + 1)}/>
        </div>
    );
}

CountStepper.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    setValue: PropTypes.func.isRequired,
};
