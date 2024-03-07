import "../Styles/button.css"
import "../Styles/login-signup.css"

import { useContext, useState } from "react";
import PropTypes from 'prop-types'
import PasswordInput from "../Components/PasswordInput";
import { ImCross } from "react-icons/im";
import UserInfoContext from "../Context/UserInfoContext";

const SignUp = (props) => {
    const { setInfo } = useContext(UserInfoContext);
    const [userType, setUserType] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [passportNumber, setPassportNumber] = useState("");
    const [experience, setExperience] = useState("");
    const [fee, setFee] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassport, setIsValidPassport] = useState(true);
    const [isPasswordStarting, setIsPasswordStarting] = useState(true);
    const [isPassportStarting, setIsPassportStarting] = useState(true);
    const [page, setPage] = useState(1);

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    }

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value);

        if (e.target.value !== "") {
            const response = await fetch(`http://localhost:3000/user/${e.target.value}`, {
                method: "GET"
            });
            const result = await response.json();

            if(result.status === 1)
            {
                setIsValidUsername(false);
            }
            else
            {
                setIsValidUsername(true);
            }
        }
        else {
            setIsValidUsername(true);
        }
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
        setIsPasswordStarting(false);
        text.length >= 8 ? setIsValidPassword(true) : setIsValidPassword(false);
    }

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    }

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePassportNumberChange = (e) => {
        setPassportNumber(e.target.value);
        setIsPassportStarting(false);
        e.target.value.length === 12 ? setIsValidPassport(true) : setIsValidPassport(false);
    }

    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
    }

    const handleFee = (e) => {
        setFee(e.target.value);
    }

    const handleChangeToLogin = () => {
        props.goToLogin();
    }

    const togglePage = (page) => {
        if (page === 1) {
            setPassword("");
            setRePassword("");
            setIsValidPassword(false);
            setIsPasswordStarting(true);
        }
        setPage(page);
    }

    const handleForm = (page) => {
        let correct = false;

        if (page === 2 && (username === "" || userType === "" || password ==="" || rePassword === "")) {
            alert("Important field(s) empty!");
        }
        else if (page === 2 && !isValidPassword) {
            alert("Invalid Password");
        }
        else if (page === 2 && !isValidUsername) {
            alert("Username already exists.");
        }
        else if (page === 2 && password !== rePassword) {
            alert("Password and Confirmed Password don't match.");
        }
        else if (page === 3 && (username === "" || firstName === "" || lastName === "" || email === "" || (userType === "customer" && passportNumber === "") || (userType === "agent" && (experience === "" || fee === "")))) {
            alert("Important field(s) empty!");
        }
        else if (page === 3 & !isValidPassport) {
            alert("Invalid passport number.");
        }
        else {
            correct = true;
        }

        if (correct) {
            togglePage(page);
        }
    }

    const handleDataSubmit = async () => {
        let result;
        if (userType === 'customer') {
            
            let pref = []
            for (let i = 1; i <= 7; i++) {
                let check = document.getElementById("preference" + i);
                if (check.checked) {
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
                "userType": "customer",
                "preferences": pref
            }
            let response = await fetch(`http://localhost:3000/customer`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });

            result = await response.json();

            response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${result.USER_ID}`, {
                method: "GET"
            });

            const result2 = await response.json();
            result.TRIPS = result2;
        }
        else {
            const info = {
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "experience": experience,
                "fee": fee,
                "password": password,
                "userType": "agent"
            }
            let response = await fetch(`http://localhost:3000/agent`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            result = await response.json();

            alert("Your request is being processed");
        }
        
        setInfo(result);
        props.setUserInfo(false);
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
                <h1>Sign Up Page</h1>

                {page === 1 ?
                    <>
                        <div className="radio-group">
                            <h3>Are you -</h3>
                            <label className="radio-option">
                                <input type="radio" name="userType" value="customer" onClick={handleUserTypeChange} />A Customer
                            </label>

                            <label className="radio-option">
                                <input type="radio" name="userType" value="agent" onClick={handleUserTypeChange} />A Travel Agent
                            </label>
                        </div>
                        <div style={{ display: 'flex', flexDirection: "column", alignItems: 'flex-end', marginBottom: '40px' }}>
                            <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange} /><span style={{ color: "red" }}> *</span></label>
                            {!isValidUsername ? <h5 style={{ color: "red" }}>username already exists</h5> : <br/>}

                            <div><PasswordInput Label="Enter Password: " password={password} setPassword={handlePasswordChange} /><span style={{ color: "red" }}> *</span></div>
                            {!isValidPassword && !isPasswordStarting ? <h5 style={{ color: "red" }}>password must be at least 8 characters long</h5>
                                : <br/>}
                            <div><PasswordInput Label="Confirm Password: " password={rePassword} setPassword={setRePassword} /><span style={{ color: "red" }}> *</span></div>
                        </div>
                        <button className="custom-btn" style={{color: "black"}} onClick={() => { handleForm(2) }}>Next</button>
                        <br /><br />
                    </> :
                    (page === 2 ?
                        <>
                            <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />

                            <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />

                            <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange} /><span style={{ color: "red" }}> *</span></label><br /><br />

                            {userType === 'customer' ? <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} /><span style={{ color: "red" }}> *</span></label>
                                : <><label>Years of Experience: <input value={experience} placeholder='Enter years of experience' onChange={handleExperienceChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                                    <label>Fee: <input value={fee} placeholder='Enter expected fee' onChange={handleFee} /><span style={{ color: "red" }}> *</span></label></>}

                            {userType === "customer" && !isValidPassport && !isPassportStarting ? <h5 style={{ color: "red" }}>passport number must contain 12 characters</h5>
                                : <><br /><br /></>}

                            <div><button className="custom-btn" style={{color: "black"}} onClick={() => { togglePage(1) }}>Prev</button>

                            {userType === "customer" ? <button className="custom-btn" style={{color: "black"}} onClick={() => { handleForm(3) }}>Next</button> :
                                <><button className="custom-btn" onClick={handleDataSubmit}>Sign Up</button><br /><br /></>}
                            </div><br /><br />
                        </> :
                        userType === "customer" &&
                        <>
                            <h3>Choose Your Destination Preferences: (Optional)</h3>
                            <label><input type="checkbox" id="preference1" value="Mountains" />Mountains</label><br />
                            <label><input type="checkbox" id="preference2" value="Lakes" />Lakes</label><br />
                            <label><input type="checkbox" id="preference3" value="Beaches" />Beaches</label><br />
                            <label><input type="checkbox" id="preference4" value="Forests" />Forests</label><br />
                            <label><input type="checkbox" id="preference5" value="Hill Tracks" />Hill Tracks</label><br />
                            <label><input type="checkbox" id="preference6" value="Tea Gardens" />Tea Gardens</label><br />
                            <label><input type="checkbox" id="preference7" value="Historical Places" />Historical Places</label><br /><br />

                            <div><button className="custom-btn" onClick={() => { togglePage(2) }}>Prev</button>
                                <button className="custom-btn" onClick={handleDataSubmit}>Sign Up</button></div><br /><br />
                        </>)
                }

                <p style={{ textAlign: "center" }}>Already have an account? <span className='go-to' onClick={handleChangeToLogin} style={{ color: "red" }}>Login now!</span></p>
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