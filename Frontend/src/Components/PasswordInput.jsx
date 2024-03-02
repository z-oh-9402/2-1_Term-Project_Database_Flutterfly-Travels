import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import PropTypes from 'prop-types'

const PasswordInput = (props) => {
  const {Label, password, setPassword} = props;
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
            <label>{Label}
            <input style={{position: 'relative'}}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
            /></label>
            <div
                style={{
                position: 'absolute',
                right: '7px',
                top: '53%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                }}
                onClick={handleTogglePassword}
            >
                {password.length!==0 && (showPassword ? <FaEyeSlash /> : <FaEye />)}
            </div>
        </div>
    </>
  );
};

PasswordInput.propTypes = {
    password: PropTypes.string,
    setPassword: PropTypes.func,
    Label: PropTypes.string
}

export default PasswordInput;