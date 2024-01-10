import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types'

const PasswordInput = (props) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(true);

    setTimeout(() => {
        setShowPassword(false);
    }, 1500);
  };

  return (
    <>
        <div style={{ position: 'relative', display:'inline-block'}}>
            <label>{props.Label}</label>
            <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {setPassword(e.target.value); props.setPass(e.target.value)}}
            />
            <div
                style={{
                position: 'absolute',
                right: '5px',
                top: '12px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                }}
                onClick={handleTogglePassword}
            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
        </div>
    </>
  );
};

PasswordInput.propTypes = {
    setPass: PropTypes.func,
    Label: PropTypes.string
}

export default PasswordInput;