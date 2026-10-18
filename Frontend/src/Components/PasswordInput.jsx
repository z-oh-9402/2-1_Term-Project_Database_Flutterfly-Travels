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
        <div className='password-input' style={{ position: 'relative', display:'inline-block'}}>
            <label>{Label}
            {/* The eye icon is positioned on the input itself, wherever the label puts it */}
            <span className='password-field' style={{ position: 'relative', display: 'inline-block' }}>
                <input style={{position: 'relative'}}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                />
                <span
                    style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: 'black',
                    display: 'flex',
                    }}
                    onClick={handleTogglePassword}
                >
                    {password.length!==0 && (showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />)}
                </span>
            </span></label>
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