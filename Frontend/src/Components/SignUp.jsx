import { useState } from "react";
import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";

const SignUp = (props) =>{
    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [rePassword,setRePassword] = useState("");
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [email,setEmail] = useState("");
    const [isValidPassword,setIsValidPassword] = useState(false);
    const [isStarting,setIsStarting] = useState(true);

    const handleUsernameChange = (e)=>
    {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (e)=>{
        setPassword(e.target.value);
        setIsStarting(false);
        e.target.value.length>=8 ? setIsValidPassword(true) : setIsValidPassword(false);
    }

    const handleRePasswordChange = (e)=>{
        setRePassword(e.target.value);
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
        else if(username==="" || firstName==="" || lastName==="" || email==="")
        {
            alert("Important field(s) empty!");
        }
        else
        {
            const response = await fetch(`http://localhost:3000/user/${username}`,{
                method: "GET"
            });

            const result = await response.json();
            if(result.length!==0)
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
                setPassword("");
                setRePassword("");

                let pref = ""
                let indices = []
                for(let i=1;i<=4;i++)
                {
                    let check = document.getElementById("preference"+i);
                    if(check.checked)
                    {
                        indices.push(i);
                    }
                }

                for(let i=0;i<indices.length;i++)
                {
                    let check = document.getElementById("preference"+indices[i]);
                    pref = pref+check.value;
                    if(i!=indices.length-1)
                    {
                        pref = pref + ',';
                    }
                }

                const info = {
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    userType: 'customer',
                    preferences: pref
                }

                const response1 = await fetch(`http://localhost:3000/user`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(info)
                });

                const result1 = await response1.json();
                props.setUserInfo(result1,false);
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

        <h3>Choose Your Destination Preferences:</h3>
        <label><input type="checkbox" id="preference1" value="Mountains"/>Mountains</label><br/>
        <label><input type="checkbox" id="preference2" value="Lakes"/>Lake</label><br/>
        <label><input type="checkbox" id="preference3" value="Beaches"/>Beaches</label><br/>
        <label><input type="checkbox" id="preference4" value="Deserts"/>Deserts</label><br/><br/>

        <label>Enter Password: <input type='password' value={password} onChange={handlePasswordChange}/><span style={{color: "red"}}> *</span></label>
        {!isValidPassword && !isStarting ? <h5 style={{color: "red"}}>password must be at least 8 characters long</h5> : <><br/><br/></>}
        <label>Confirm Password: <input type='password' value={rePassword} onChange={handleRePasswordChange}/><span style={{color: "red"}}> *</span></label><br/><br/>
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