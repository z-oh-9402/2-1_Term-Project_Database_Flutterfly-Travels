import "../Styles/button.css"
import "../Styles/login-signup.css"

import { useContext, useState } from "react";
import PropTypes from 'prop-types'
import PasswordInput from "../Components/PasswordInput";
import { ImCross } from "react-icons/im";
import UserInfoContext from "../Context/UserInfoContext";
import PhotoUploader from "../Components/PhotoUploader";
import useFieldRules, { emailPattern, wholeNumber } from "../Components/useFieldRules";
import { setToken, apiFetch } from "../api";

// Destination preferences on the last page; place type i+1 in the database
const placeTypes = ["Mountains", "Lakes", "Beaches", "Forests", "Hill Tracks", "Tea Gardens", "Historical Places"];

const SignUp = (props) => {
    const { setInfo } = useContext(UserInfoContext);
    const [userType, setUserType] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [passportNumber, setPassportNumber] = useState("");
    const [experience, setExperience] = useState("");
    const [fee, setFee] = useState("");
    const [preferences, setPreferences] = useState(placeTypes.map(() => false));
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [page, setPage] = useState(1);

    // What is wrong with a field, or null when it meets its criteria
    const fieldError = (name) => {
        switch(name)
        {
            case 'userType': return userType === "" ? "choose customer or travel agent" : null;
            case 'username': return username === "" ? "username is required" : (!isValidUsername ? "username already exists" : null);
            case 'password': return password.length < 8 ? "password must be at least 8 characters long" : null;
            // only checked once the password itself is fine
            case 'rePassword': return fieldError('password') === null && rePassword !== password ? "passwords don't match" : null;
            case 'firstName': return firstName === "" ? "first name is required" : null;
            case 'lastName': return lastName === "" ? "last name is required" : null;
            case 'email': return email === "" ? "email is required" : (!emailPattern.test(email) ? "enter a valid email address" : null);
            case 'passportNumber': return passportNumber.length !== 12 ? "passport number must contain 12 characters" : null;
            case 'experience': return !wholeNumber.test(experience) ? "years of experience must be a whole number" : null;
            case 'fee': return !wholeNumber.test(fee) ? "fee must be a whole number" : null;
            default: return null;
        }
    }

    const { containerProps, warning, invalid, showProblem, releaseField } = useFieldRules(fieldError, {rePassword: 'password'});

    // A field's name above its input, with the required mark
    const fieldLabel = (text) => <span className='field-label'>{text} <span className='required'>*</span></span>;

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
    }

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value);

        if (e.target.value !== "") {
            const response = await apiFetch(`http://localhost:3000/user/${e.target.value}`, {
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

    // Everything typed is kept when moving between pages
    const togglePage = (page) => {
        // the fields of the page being left are gone, so none of them holds the user any more
        releaseField();
        setPage(page);
    }

    // The fields that must be right before going on to each page
    const fieldsBefore = {
        2: ['userType', 'username', 'password', 'rePassword'],
        3: ['firstName', 'lastName', 'email', ...(userType === 'customer' ? ['passportNumber'] : ['experience', 'fee'])]
    };

    const handleForm = (page) => {
        const wrong = fieldsBefore[page].find(name => fieldError(name) !== null);
        if (wrong) {
            showProblem(wrong);
        }
        else if (page === 3 && userType === 'agent') {
            // agents have no preferences page
            handleDataSubmit();
        }
        else {
            togglePage(page);
        }
    }

    const handleDataSubmit = async () => {
        let result;

        let formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('username', username);
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);

        if (userType === 'customer') {
            
            const pref = placeTypes.map((name, index) => ({id: index + 1, name})).filter((type, index) => preferences[index]);
            
            formData.append('passportNumber', passportNumber);
            formData.append('userType', 'customer');
            formData.append('preferences', JSON.stringify(pref));

            let response = await apiFetch(`http://localhost:3000/customer`, {
                method: "POST",
                body: formData
            });

            result = await response.json();
            result.trips = [];
        }
        
        else {
            formData.append('userType', 'agent');
            formData.append('experience', experience);
            formData.append('fee', fee);

            let response = await apiFetch(`http://localhost:3000/agent`, {
                method: "POST",
                body: formData
            });
            result = await response.json();

            alert("Your request is being processed");
        }
        
        setToken(result.token);
        delete result.token;

        props.setNotifications([]);
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
            <div className='login-signup-container styled-form signup-container' {...containerProps}>
                <ImCross className='close' onClick={handleGoToHomePage} />
                <h1>Sign up</h1>

                {page === 1 ?
                    <div className='signup-page'>
                        {/* who they are on the left, their photo on the right */}
                        <div className='signup-intro'>
                            <div className="radio-group">
                                <h3>Are you -</h3>
                                <label className="radio-option">
                                    <input type="radio" name="userType" value="customer" checked={userType === 'customer'} onChange={handleUserTypeChange} />A Customer
                                </label>

                                <label className="radio-option">
                                    <input type="radio" name="userType" value="agent" checked={userType === 'agent'} onChange={handleUserTypeChange} />A Travel Agent
                                </label>
                                {warning('userType')}
                            </div>
                            <div data-field="photo" className='signup-intro-photo'>
                                <PhotoUploader height={110} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
                            </div>
                        </div>
                        <div className='popup-fields'>
                            <label>{fieldLabel('Username')}<input name="username" aria-invalid={invalid('username')} value={username} placeholder='Enter username' onChange={handleUsernameChange} /></label>
                            {warning('username')}

                            <PasswordInput Label={fieldLabel('Password')} name="password" invalid={invalid('password')} password={password} setPassword={handlePasswordChange} />
                            {warning('password')}

                            <PasswordInput Label={fieldLabel('Confirm Password')} name="rePassword" invalid={invalid('rePassword')} password={rePassword} setPassword={setRePassword} />
                            {warning('rePassword')}
                        </div>
                        <div className='popup-actions'>
                            <button className="custom-btn" style={{color: "black"}} onClick={() => { handleForm(2) }}>Next</button>
                        </div>
                    </div> :
                    (page === 2 ?
                        <div className='signup-page signup-page-details'>
                            <div className='popup-fields'>
                                <label>{fieldLabel('First Name')}<input name="firstName" aria-invalid={invalid('firstName')} value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} /></label>
                                {warning('firstName')}

                                <label>{fieldLabel('Last Name')}<input name="lastName" aria-invalid={invalid('lastName')} value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} /></label>
                                {warning('lastName')}

                                <label>{fieldLabel('Email')}<input name="email" aria-invalid={invalid('email')} value={email} placeholder='Enter email' onChange={handleEmailChange} /></label>
                                {warning('email')}

                                {userType === 'customer' ?
                                    <><label>{fieldLabel('Passport Number')}<input name="passportNumber" aria-invalid={invalid('passportNumber')} value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} /></label>
                                        {warning('passportNumber')}</>
                                    // experience and fee share a row, so the agent's page has as many rows as the customer's
                                    : <><div className='signup-pair'>
                                            <label>{fieldLabel('Experience (years)')}<input name="experience" aria-invalid={invalid('experience')} value={experience} placeholder='e.g. 3' onChange={handleExperienceChange} /></label>
                                            <label>{fieldLabel('Fee (৳)')}<input name="fee" aria-invalid={invalid('fee')} value={fee} placeholder='e.g. 5000' onChange={handleFee} /></label>
                                        </div>
                                        {warning('experience', 'fee')}</>}
                            </div>

                            <div className='popup-actions'>
                                <button className="custom-btn" style={{color: "black"}} onClick={() => { togglePage(1) }}>Prev</button>
                                <button className="custom-btn" style={{color: "black"}} onClick={() => { handleForm(3) }}>{userType === "customer" ? 'Next' : 'Sign Up'}</button>
                            </div>
                        </div>
                        :
                        userType === "customer" &&
                        <div className='signup-page'>
                            <h3>Choose Your Destination Preferences: (Optional)</h3>
                            <div className='signup-preferences'>
                                {placeTypes.map((type, index) =>
                                    <label key={type}><input type="checkbox" checked={preferences[index]}
                                        onChange={() => setPreferences(prefs => prefs.map((isChecked, i) => i === index ? !isChecked : isChecked))} />{type}</label>
                                )}
                            </div>

                            <div className='popup-actions'>
                                <button className="custom-btn" style={{color: "black"}} onClick={() => { togglePage(2) }}>Prev</button>
                                <button className="custom-btn" style={{color: "black"}} onClick={handleDataSubmit}>Sign Up</button>
                            </div>
                        </div>)
                }

                <p style={{ textAlign: "center" }}>Already have an account? <span className='go-to' onClick={handleChangeToLogin} style={{ color: "red" }}>Login now!</span></p>
            </div>
        </div>
    )
}

SignUp.propTypes = {
    goToLogin: PropTypes.func,
    setUserInfo: PropTypes.func,
    goToHome: PropTypes.func,
    setNotifications: PropTypes.func
}

export default SignUp;