import "../Styles/button.css"
import "../Styles/login-signup.css"

import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PasswordInput from './PasswordInput';
import { ImCross } from "react-icons/im";
import LoginContext from '../Context/LoginContext';
import UserInfoContext from '../Context/UserInfoContext';

const Login = (props)=>{
    const {setInfo} = useContext(UserInfoContext);
    const {setIsLoggingIn} = useContext(LoginContext);
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (e)=>
    {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (text)=>{
        setPassword(text);
    }

    const handleChangeToSignUp = ()=>
    {
        props.goToSignUp();
    }

    const handleDataSubmit = async ()=>{
        if(username!=="" && password!=="")
        {
            let response = await fetch(`http://localhost:3000/user/${username}/${password}`,{
                method: "GET"
            });

            let result = await response.json();
            if(result.status === -1)
            {
                setUsername("");
                alert("Username does not exist");
            }
            else
            {
                if(result.status === 1)
                {
                    setUsername("");
                    setPassword("");
                    
                    if(result.data.USER_TYPE === 'customer')
                    {
                        response = await fetch(`http://localhost:3000/customer/fetch?customerId=${result.data.USER_ID}`,{
                            method: "GET"
                        });

                        const result1 = await response.json();
                        result.data.PASSPORT_NUMBER = result1.PASSPORT_NUMBER;
                        result.data.TRIP_BOOKED = result1.TRIP_BOOKED;
                        result.data.PREFERENCES = result1.PREFERENCES;

                        response = await fetch(`http://localhost:3000/destination/`,{
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(result.data.PREFERENCES)
                        });

                        result.data.RECOMMENDED_DESTINATIONS = await response.json();
                    }

                    if(result.data.USER_TYPE === 'agent')
                    {
                        response = await fetch(`http://localhost:3000/agent/${result.data.USER_ID}`,{
                            method: "GET"
                        });
                    }

                    setIsLoggingIn(true);
                    setInfo(result.data);
                    props.setUserInfo(false);
                    navigate("/");
                }
                else
                {
                    alert("Wrong password");
                }
            }
        }
        else alert("Important field(s) empty!");
    }

    const handleGoToHomePage = () =>
    {
        const box = document.querySelector('.login-signup-container');
        box.classList.add('slide-away');

        box.addEventListener('animationend', () => {
            box.remove();
            props.goToHome();
        });
    }

    return(
        <div className='login-signup-popup'>
            <div className='login-signup-container'>
                <ImCross className='close' onClick={handleGoToHomePage}/>
                <h1>Login Page</h1>
                <div style={{display: 'flex', flexDirection: "column", alignItems: 'flex-end'}}>
                    <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange}/></label><br/>
                    <PasswordInput Label="Password: " setPass={handlePasswordChange}/><br/>
                </div>
                <button className="custom-btn" onClick={handleDataSubmit}>Login</button><br/><br/>
                <p style={{textAlign: "center"}}>Don{"'"}t have an account? <span className='go-to' onClick={handleChangeToSignUp} style={{color: "red"}}>Sign up now!</span></p>
            </div>
        </div>
    )

}

Login.propTypes = {
    setUserInfo: PropTypes.func,
    goToSignUp: PropTypes.func,
    goToHome: PropTypes.func
}

export default Login;