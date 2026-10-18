import "../Styles/button.css"
import "../Styles/login-signup.css"
import "../Styles/form-fields.css"

import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import PasswordInput from '../Components/PasswordInput';
import { ImCross } from "react-icons/im";
import UserInfoContext from '../Context/UserInfoContext';
import { setToken, apiFetch } from '../api';

// A field's name above its input, with the required mark (as in the sign-up form)
const fieldLabel = (text) => <span className='field-label'>{text} <span className='required'>*</span></span>;

const Login = (props) => {
    const { setInfo } = useContext(UserInfoContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({}); // what is wrong with each field, shown under it
    const [attempts, setAttempts] = useState(0); // failed logins, to shake the warnings again

    const showErrors = (found) => {
        setErrors(found);
        setAttempts(n => n + 1);
    }

    // editing a field clears its warning
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        setErrors(errs => ({...errs, username: undefined}));
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
        setErrors(errs => ({...errs, password: undefined}));
    }

    // The warning slot under a field; it keeps its height when empty
    const warning = (name) => (
        <div className='field-warning-slot'>
            {errors[name] && <h5 key={`${name}-${attempts}`} className='field-warning'>{errors[name]}</h5>}
        </div>
    );

    const handleChangeToSignUp = () => {
        props.goToSignUp();
    }

    const handleDataSubmit = async () => {
        const empty = {};
        if (username === "") empty.username = "username is required";
        if (password === "") empty.password = "password is required";

        if (Object.keys(empty).length !== 0) {
            showErrors(empty);
        }
        else {
            let response = await apiFetch(`http://localhost:3000/user/${username}`, {
                method: "GET"
            });

            let result = await response.json();
            if (result.status === -1) {
                // the username stays, so a typo can be fixed
                showErrors({username: "no account has this username"});
            }
            else {
                let response = await apiFetch(`http://localhost:3000/user/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });
                result = await response.json();

                if (result.status === 1) {
                    setToken(result.token);

                    if (result.data.user_type === 'customer') {
                        response = await apiFetch(`http://localhost:3000/customer/fetch?customerId=${result.data.user_id}`, {
                            method: "GET"
                        });
                        const result1 = await response.json();

                        response = await apiFetch(`http://localhost:3000/trip/for-customer?customerId=${result.data.user_id}`, {
                            method: "GET"
                        });
                        const result2 = await response.json();

                        result.data.passport_number = result1.passport_number;
                        result.data.trip_booked = result1.trip_booked;
                        result.data.preferences = result1.preferences;
                        result.data.trips = result2;
                    }

                    if (result.data.user_type === 'agent') {
                        response = await apiFetch(`http://localhost:3000/agent/${result.data.user_id}`, {
                            method: "GET"
                        });

                        const result1 = await response.json();

                        result.data.experience_years = result1.experience_years;
                        result.data.fee = result1.fee;
                        result.data.acc_status = result1.acc_status;
                        result.data.rating = result1.rating;
                        result.data.rating_count = result1.rating_count;

                        if (result1.acc_status === 'PENDING') {
                            alert("Your request is still being processed!!!");
                        }
                        
                        if(result1.acc_status === 'OK') {
                            response = await apiFetch(`http://localhost:3000/trip/for-agent?agentId=${result.data.user_id}`, {
                                method: "GET"
                            });

                            const result2 = await response.json();
                            result.data.trips = result2;
                        }
                    }
                    
                    props.setNotifications([]);
                    setInfo(result.data);
                    props.setUserInfo(false);
                    setUsername("");
                    setPassword("");
                }
                else {
                    setPassword("");
                    showErrors({password: "wrong password"});
                }
            }
        }
    }

    const handleGoToHomePage = () => {
        const box = document.querySelector('.login-signup-container');
        box.classList.add('slide-away');

        box.addEventListener('animationend', () => {
            box.remove();
            props.goToHome();
        });
    }

    return (
        <div className='login-signup-popup'>
            <div className='login-signup-container styled-form login-container'>
                <ImCross className='close' onClick={handleGoToHomePage} />
                <h1>Login</h1>
                <br/>
                <div className='popup-fields'>
                    <label>{fieldLabel('Username')}<input name="username" aria-invalid={Boolean(errors.username)} value={username} placeholder='Enter username' onChange={handleUsernameChange} /></label>
                    {warning('username')}
                    <PasswordInput Label={fieldLabel('Password')} name="password" invalid={Boolean(errors.password)} password={password} setPassword={handlePasswordChange} />
                    {warning('password')}
                </div>
                <div className='popup-actions'>
                    <button className="custom-btn" style={{color: "black"}} onClick={handleDataSubmit}>Login</button>
                </div>
                <p style={{ textAlign: "center" }}>Don{"'"}t have an account? <span className='go-to' onClick={handleChangeToSignUp} style={{ color: "red" }}>Sign up now!</span></p>
            </div>
        </div>
    )

}

Login.propTypes = {
    setUserInfo: PropTypes.func,
    goToSignUp: PropTypes.func,
    goToHome: PropTypes.func,
    setNotifications: PropTypes.func
}

export default Login;