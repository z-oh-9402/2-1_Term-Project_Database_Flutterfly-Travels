import "../Styles/button.css"
import "../Styles/login-signup.css"

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
    const [userType, setUserType] = useState("");
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [rePassword,setRePassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [passportNumber,setPassportNumber] = useState("");
    const [isValidPassword,setIsValidPassword] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassport, setIsValidPassport] = useState(true);
    const [isPasswordStarting,setIsPasswordStarting] = useState(true);
    const [isPassportStarting,setIsPassportStarting] = useState(true);
    const [page, setPage] = useState(1);

    const handleUserTypeChange = (e) =>{
        setUserType(e.target.value);
    }

    const handleUsernameChange = async (e)=>
    {
        setUsername(e.target.value);

        if(e.target.value !== "")
        {
            const response = await fetch(`http://localhost:3000/customer/${e.target.value}`,{
                method: "GET"
            });
            const result = await response.json();
            setIsValidUsername(result.status);
        }
        else
        {
            setIsValidUsername(true);
        }
    }

    const handlePasswordChange = (text)=>{
        setPassword(text);
        setIsPasswordStarting(false);
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
        setIsPassportStarting(false);
        e.target.value.length===12 ? setIsValidPassport(true) : setIsValidPassport(false);
    }

    const handleChangeToLogin = () =>{
        props.goToLogin();
    }

    const togglePage = (page) =>{
        if(page === 1)
        {
            setPassword("");
            setRePassword("");
            setIsValidPassword(false);
            setIsPasswordStarting(true);
        }
        setPage(page);
    }

    const handleForm = (page)=>{
        let correct = false;

        if(page === 2 && !isValidPassword)
        {
            alert("Invalid Password");
        }
        else if(page === 2 && password!==rePassword)
        {
            alert("Password and Confirmed Password don't match.");
        }
        else if(page === 2 && (username==="" || userType===""))
        {
            alert("Important field(s) empty!");
        }
        else if(page === 2 && !isValidUsername)
        {
            alert("Username already exists.");
        }
        else if(page === 3 && (username==="" || firstName==="" || lastName==="" || email==="" || passportNumber===""))
        {
            alert("Important field(s) empty!");
        }
        else if(page === 3 & !isValidPassport)
        {
            alert("Invalid passport number.");
        }
        else
        {
            correct = true;
        }
        
        if(correct)
        {
            togglePage(page);
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
            "userType": userType,
            "preferences": pref
        }

        let result;
        if(userType === 'customer')
        {
            let response = await fetch(`http://localhost:3000/customer`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            result = await response.json();
            console.log(result);

            response = await fetch(`http://localhost:3000/destination/`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pref)
            });

            result.RECOMMENDED_DESTINATIONS = await response.json();
        }
        else
        {
            let response = await fetch(`http://localhost:3000/customer`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            result = await response.json();
            console.log(result);

            response = await fetch(`http://localhost:3000/destination/`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pref)
            });

            result.RECOMMENDED_DESTINATIONS = await response.json();
        }
        
        setIsLoggingIn(true);
        setInfo(result);
        props.setUserInfo(false);
        navigate("/");
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

                {page === 1 ?
                    <>
                        <div className="radio-group">
                            <h3>Are you -</h3>
                            <label className="radio-option">
                                <input type="radio" name="userType" value="customer" onClick={handleUserTypeChange}/>A Customer
                            </label>

                            <label className="radio-option">
                                <input type="radio" name="userType" value="agent" onClick={handleUserTypeChange}/>A Travel Agent
                            </label>
                        </div>
                        <div style={{display: 'flex', flexDirection: "column", alignItems: 'flex-end', marginBottom: '40px'}}>
                            <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange}/><span style={{color: "red"}}> *</span></label> 
                            {!isValidUsername ? <h5 style={{color: "red"}}>username already exists</h5> : <><br/></>}

                            <div><PasswordInput Label="Enter Password: " setPass={handlePasswordChange}/><span style={{color: "red"}}> *</span></div>
                            {!isValidPassword && !isPasswordStarting ? <h5 style={{color: "red"}}>password must be at least 8 characters long</h5> 
                                                            : <><br/></>}
                            <div><PasswordInput Label="Confirm Password: " setPass={handleRePasswordChange}/><span style={{color: "red"}}> *</span></div>
                        </div>
                        <button className="custom-btn" onClick={()=>{handleForm(2)}}>Next</button>
                        <br/><br/>
                    </> :
                    (page === 2 ? 
                        <>
                            <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                            <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                            <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
                            <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange}/><span style={{color: "red"}}> *</span></label>
                            {!isValidPassport && !isPassportStarting ? <h5 style={{color: "red"}}>passport number must contain 12 characters</h5> 
                                                         : <><br/><br/></>}
                            <div><button className="custom-btn" onClick={()=>{togglePage(1)}}>Prev</button>
                                <button className="custom-btn" onClick={()=>{handleForm(3)}}>Next</button>
                            </div><br/><br/>
                        </>:
                        <>
                            <h3>Choose Your Destination Preferences: (Optional)</h3>
                            <label><input type="checkbox" id="preference1" value="Mountains"/>Mountains</label><br/>
                            <label><input type="checkbox" id="preference2" value="Lakes"/>Lakes</label><br/>
                            <label><input type="checkbox" id="preference3" value="Beaches"/>Beaches</label><br/>
                            <label><input type="checkbox" id="preference4" value="Forests"/>Forests</label><br/>
                            <label><input type="checkbox" id="preference5" value="Hill Tracks"/>Hill Tracks</label><br/>
                            <label><input type="checkbox" id="preference6" value="Tea Gardens"/>Tea Gardens</label><br/>
                            <label><input type="checkbox" id="preference7" value="Historical Places"/>Historical Places</label><br/><br/>
                            
                            <div><button className="custom-btn" onClick={()=>{togglePage(2)}}>Prev</button>
                            <button className="custom-btn" onClick={handleDataSubmit}>Sign Up</button></div><br/><br/>
                        </>)
                }
                
                <p style={{textAlign: "center"}}>Already have an account? <span className='go-to' onClick={handleChangeToLogin} style={{color: "red"}}>Login now!</span></p>
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