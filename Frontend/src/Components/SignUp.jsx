import { useState } from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import PasswordInput from "./PasswordInput";

const SignUp = (props) =>{
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

    const handleDataSubmit = async () =>
    {
        if(!isValidPassword)
        {
            alert("Invalid Password");
        }
        else if(password!==rePassword)
        {
            alert("Password and Confirmed Password don't match.");
        }
        else if(username==="" || firstName==="" || lastName==="" || email==="" || passportNumber==="")
        {
            alert("Important field(s) empty!");
        }
        else
        {
            let pref = []
            let indices = []
            for(let i=1;i<=4;i++)
            {
                let check = document.getElementById("preference"+i);
                if(check.checked)
                {
                    pref.push(check.value);
                }
            }

            // for(let i=0;i<indices.length;i++)
            // {
            //     let check = document.getElementById("preference"+indices[i]);
            //     pref.push(check.value);
            // }

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
                setUsername("");
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassportNumber("");
                setPassword("");
                setRePassword("");
                
                props.setUserInfo(result.data,false);
                navigate("/user");
            }
        }
    }

    const handleGoToHomePage = () =>
    {
        props.goToHome();
        navigate("");
    }

    return(<>
        <h1>Sign Up Page</h1>
        <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>  
        <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
        <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
        <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
        <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange}/><span style={{color: "red"}}> *</span></label><br/><br/>

        <h3>Choose Your Destination Preferences:</h3>
        <label><input type="checkbox" id="preference1" value="Mountains"/>Mountains</label><br/>
        <label><input type="checkbox" id="preference2" value="Lakes"/>Lakes</label><br/>
        <label><input type="checkbox" id="preference3" value="Beaches"/>Beaches</label><br/>
        <label><input type="checkbox" id="preference4" value="Deserts"/>Deserts</label><br/><br/>

        <PasswordInput Label="Enter Password: " setPass={handlePasswordChange}/><span style={{color: "red"}}> *</span>
        {!isValidPassword && !isStarting ? <h5 style={{color: "red"}}>password must be at least 8 characters long</h5> : <><br/><br/></>}
        <PasswordInput Label="Confirm Password: " setPass={handleRePasswordChange}/><span style={{color: "red"}}> *</span><br/><br/>
        <button onClick={handleDataSubmit}>Submit</button><br/><br/>
        <button onClick={handleChangeToLogin}>Go to Login</button><br/><br/>
        <button onClick={handleGoToHomePage}>Go to Homepage</button>
    </>)
}

SignUp.propTypes = {
    goToLogin: PropTypes.func,
    setUserInfo: PropTypes.func,
    goToHome: PropTypes.func
}

export default SignUp;