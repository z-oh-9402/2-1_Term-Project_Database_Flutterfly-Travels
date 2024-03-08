import "../Styles/button.css"
import "../Styles/login-signup.css"

import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import PasswordInput from '../Components/PasswordInput';
import { ImCross } from "react-icons/im";
import UserInfoContext from '../Context/UserInfoContext';

const Login = (props) => {
    const { setInfo, setShowDetailedNotification } = useContext(UserInfoContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handleChangeToSignUp = () => {
        props.goToSignUp();
    }

    const handleDataSubmit = async () => {
        if (username !== "" && password !== "") {
            let response = await fetch(`http://localhost:3000/user/${username}`, {
                method: "GET"
            });

            let result = await response.json();
            if (result.status === -1) {
                setUsername("");
                alert("Username does not exist");
            }
            else {
                let response = await fetch(`http://localhost:3000/user/${username}/${password}`, {
                    method: "GET"
                });
                result = await response.json();
                if (result.status === 1) {
                    if (result.data.USER_TYPE === 'customer') {
                        response = await fetch(`http://localhost:3000/customer/fetch?customerId=${result.data.USER_ID}`, {
                            method: "GET"
                        });

                        const result1 = await response.json();

                        response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${result.data.USER_ID}`, {
                            method: "GET"
                        });

                        const result2 = await response.json();
                        result.data.PASSPORT_NUMBER = result1.PASSPORT_NUMBER;
                        result.data.TRIP_BOOKED = result1.TRIP_BOOKED;
                        result.data.PREFERENCES = result1.PREFERENCES;
                        result.data.TRIPS = result2;
                    }

                    if (result.data.USER_TYPE === 'agent') {
                        response = await fetch(`http://localhost:3000/agent/${result.data.USER_ID}`, {
                            method: "GET"
                        });

                        const result1 = await response.json();

                        result.data.EXPERIENCE_YEARS = result1.EXPERIENCE_YEARS;
                        result.data.FEE = result1.FEE;
                        result.data.ACC_STATUS = result1.ACC_STATUS;

                        if (result1.ACC_STATUS === 'PENDING') {
                            alert("Your request is still being processed!!!");
                        }
                        
                        if(result1.ACC_STATUS === 'OK') {
                            response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${result.data.USER_ID}`, {
                                method: "GET"
                            });

                            const result2 = await response.json();
                            result.data.TRIPS = result2;
                        }
                    }
                    
                    props.setNotifications([]);
                    setShowDetailedNotification(true);
                    setInfo(result.data);
                    props.setUserInfo(false);
                }
                else {
                    alert("Wrong password");
                }
            }
        }
        else alert("Important field(s) empty!");

        setUsername("");
        setPassword("");
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
            <div className='login-signup-container'>
                <ImCross className='close' onClick={handleGoToHomePage} />
                <h1>Login Page</h1>
                <div style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-end' }}>
                    <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange} /></label><br />
                    <PasswordInput Label="Password: " password={password} setPassword={setPassword} /><br />
                </div>
                <button className="custom-btn" onClick={handleDataSubmit}>Login</button><br /><br />
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