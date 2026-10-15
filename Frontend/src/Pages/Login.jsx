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
                setPassword("");
                alert("Username does not exist");
            }
            else {
                let response = await fetch(`http://localhost:3000/user/${username}/${password}`, {
                    method: "GET"
                });
                result = await response.json();

                if (result.status === 1) {
                    if (result.data.user_type === 'customer') {
                        response = await fetch(`http://localhost:3000/customer/fetch?customerId=${result.data.user_id}`, {
                            method: "GET"
                        });
                        const result1 = await response.json();

                        response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${result.data.user_id}`, {
                            method: "GET"
                        });
                        const result2 = await response.json();

                        result.data.passport_number = result1.passport_number;
                        result.data.trip_booked = result1.trip_booked;
                        result.data.preferences = result1.preferences;
                        result.data.trips = result2;
                    }

                    if (result.data.user_type === 'agent') {
                        response = await fetch(`http://localhost:3000/agent/${result.data.user_id}`, {
                            method: "GET"
                        });

                        const result1 = await response.json();

                        result.data.experience_years = result1.experience_years;
                        result.data.fee = result1.fee;
                        result.data.acc_status = result1.acc_status;
                        result.data.rating = result1.rating;

                        if (result1.acc_status === 'PENDING') {
                            alert("Your request is still being processed!!!");
                        }
                        
                        if(result1.acc_status === 'OK') {
                            response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${result.data.user_id}`, {
                                method: "GET"
                            });

                            const result2 = await response.json();
                            result.data.trips = result2;
                        }
                    }
                    
                    props.setNotifications([]);
                    setShowDetailedNotification(true);
                    setInfo(result.data);
                    props.setUserInfo(false);
                    setUsername("");
                    setPassword("");
                }
                else {
                    alert("Wrong password");
                    setPassword("");
                }
            }
        }
        else alert("Important field(s) empty!");
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
                <button className="custom-btn" style={{color: "black"}} onClick={handleDataSubmit}>Login</button><br /><br />
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