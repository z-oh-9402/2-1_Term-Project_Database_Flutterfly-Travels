import "../Styles/button.css"

import { useContext, useState } from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";
import { ImCross } from "react-icons/im";
import LoginContext from "../Context/LoginContext";
import UserInfoContext from "../Context/UserInfoContext";

const SignUp = (props) =>{
    const {setIsLoggingIn} = useContext(LoginContext);
    const {setInfo} = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [rePassword,setRePassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [passportNumber,setPassportNumber] = useState("");
    const [isValidPassword,setIsValidPassword] = useState(false);
    const [isStarting,setIsStarting] = useState(true);
    const [isFormFilledUp, setIsFormFilledUp] = useState(false);

    const handleUsernameChange = (e)=>
    {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (text)=>{
        setPassword(text);
        setIsStarting(false);
        text.length>=8 ? setIsValidPassword(true) : setIsValidPassword(false);
    }

    const handleRePasswordChange = (text)=>{
        setRePassword(text);
    }

    const handleFirstNameChange = (e)=>{
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e)=>{
        setLastName(e.target.value);
    }

    const handleEmailChange = (e)=>{
        setEmail(e.target.value);
    }

    const handlePassportNumberChange = (e)=>{
        setPassportNumber(e.target.value);
    }

    const handleChangeToLogin = () =>{
        props.goToLogin();
    }

    const togglePage = () =>{
        if(isFormFilledUp)
        {
            setPassword("");
            setRePassword("");
            setIsValidPassword(false);
            setIsStarting(true);
        }
        setIsFormFilledUp(!isFormFilledUp)
    }

    const handleForm = ()=>{
        if(username==="" || firstName==="" || lastName==="" || email==="" || passportNumber==="")
        {
            alert("Important field(s) empty!");
        }
        else if(!isValidPassword)
        {
            alert("Invalid Password");
        }
        else if(password!==rePassword)
        {
            alert("Password and Confirmed Password don't match.");
        }
        else
        {
            togglePage();
        }
    }

    const handleDataSubmit = async () =>
    {
        let pref = []
        for(let i=1;i<=7;i++)
        {
            let check = document.getElementById("preference"+i);
            if(check.checked)
            {
                pref.push(check.value);
            }
        }

        const info = {
            "username": username,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "passportNumber": passportNumber,
            "tripBooked": 0,
            "password": password,
            "userType": 'customer',
            "preferences": pref
        }

        const response = await fetch(`http://localhost:3000/customer`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        });

        const result = await response.json();

        if(!result.status)
        {
            setUsername("");
            alert("This username is already taken. Use another one.");
        }
        else
        {
            const response = await fetch(`http://localhost:3000/destination/`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(result.data.PREFERENCES)
            });

            result.data.RECOMMENDED_DESTINATIONS = await response.json();
            
            setIsLoggingIn(true);
            setInfo(result.data);
            props.setUserInfo(false);
            navigate("/");
        }
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
                <h1>Sign Up Page</h1>
                {!isFormFilledUp?
                    <>
                        <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>  
                        <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                        <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                        <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                        <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange}/><span style={{color: "red"}}> *</span></label><br/><br/><br/>

                        <PasswordInput Label="Enter Password: " setPass={handlePasswordChange}/><span style={{color: "red"}}> *</span>
                        {!isValidPassword && !isStarting ? <h5 style={{color: "red"}}>password must be at least 8 characters long</h5> : <><br/><br/></>}
                        <PasswordInput Label="Confirm Password: " setPass={handleRePasswordChange}/><span style={{color: "red"}}> *</span><br/><br/>
                        <button className="custom-btn" onClick={handleForm}>Next</button><br/><br/>
                        <p style={{textAlign: "center"}}>Already have an account? <span className='go-to' onClick={handleChangeToLogin} style={{color: "red"}}>Login now!</span></p>
                    </> :
                    <>
                        <h3>Choose Your Destination Preferences: (Optional)</h3>
                        <label><input type="checkbox" id="preference1" value="Mountains"/>Mountains</label><br/>
                        <label><input type="checkbox" id="preference2" value="Lakes"/>Lakes</label><br/>
                        <label><input type="checkbox" id="preference3" value="Beaches"/>Beaches</label><br/>
                        <label><input type="checkbox" id="preference4" value="Forests"/>Forests</label><br/>
                        <label><input type="checkbox" id="preference5" value="Hill Tracks"/>Hill Tracks</label><br/>
                        <label><input type="checkbox" id="preference6" value="Tea Gardens"/>Tea Gardens</label><br/>
                        <label><input type="checkbox" id="preference7" value="Historical Places"/>Historical Places</label><br/><br/>
                        
                        <div><button className="custom-btn" onClick={togglePage}>Prev</button>
                        <button className="custom-btn" onClick={handleDataSubmit}>Sign Up</button><br/><br/></div>
                    </>
                }
            </div>
        </div>
    )
}

SignUp.propTypes = {
    goToLogin: PropTypes.func,
    setUserInfo: PropTypes.func,
    goToHome: PropTypes.func
}

export default SignUp;