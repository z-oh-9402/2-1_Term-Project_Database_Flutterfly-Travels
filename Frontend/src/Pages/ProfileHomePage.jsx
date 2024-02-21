import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../Components/PasswordInput';
import UserInfoContext from '../Context/UserInfoContext';
import CategorizedDestination from '../Components/CategorizedDestination';
import "../Styles/button.css"

const ProfileHomePage = (props) => {
    const { userInfo, setInfo } = useContext(UserInfoContext);
    const user = userInfo;
    const pref = user.USER_TYPE === 'customer' ? user.PREFERENCES : null;
    const [recommendedDestinations, setRecommendedDestinations] = useState([]);
    const [pendingAgents, setPendingAgents] = useState([]);
    const list = ["Mountains", "Lakes", "Beaches", "Forests", "Hill Tracks", "Tea Gardens", "Historical Places"];

    const [isPref1Checked, setIsPref1Checked] = useState(pref !== null ? pref.includes(list[0]) : pref);
    const [isPref2Checked, setIsPref2Checked] = useState(pref !== null ? pref.includes(list[1]) : pref);
    const [isPref3Checked, setIsPref3Checked] = useState(pref !== null ? pref.includes(list[2]) : pref);
    const [isPref4Checked, setIsPref4Checked] = useState(pref !== null ? pref.includes(list[3]) : pref);
    const [isPref5Checked, setIsPref5Checked] = useState(pref !== null ? pref.includes(list[4]) : pref);
    const [isPref6Checked, setIsPref6Checked] = useState(pref !== null ? pref.includes(list[5]) : pref);
    const [isPref7Checked, setIsPref7Checked] = useState(pref !== null ? pref.includes(list[6]) : pref);

    const navigate = useNavigate();
    const [isBeingUpdated, setIsBeingUpdated] = useState(false);
    const [username, setUsername] = useState(user.USERNAME);
    const [password, setPassword] = useState(user.PASSWORD);
    const [rePassword, setRePassword] = useState(user.PASSWORD);
    const [firstName, setFirstName] = useState(user.FIRST_NAME);
    const [lastName, setLastName] = useState(user.LAST_NAME);
    const [email, setEmail] = useState(user.EMAIL);
    const [passportNumber, setPassportNumber] = useState(user.USER_TYPE === 'customer' ? user.PASSPORT_NUMBER : null);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isStarting, setIsStarting] = useState(true);

    useEffect(()=>{
        const fetchData = async () => {
            if(user.USER_TYPE === 'customer')
            {
                const response = await fetch(`http://localhost:3000/destination/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user.PREFERENCES)
                });

                const data = await response.json();
                setRecommendedDestinations(data);
            }
            if(user.USER_TYPE === 'admin')
            {
                const response = await fetch(`http://localhost:3000/agent/pending-agents/`, {
                    method: "GET"
                });

                const data = await response.json();
                setPendingAgents(data);
            }
        };
        fetchData()}
    ,[]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    }

    const handlePasswordChange = (text) => {
        setPassword(text);
        setIsStarting(false);
        text.length >= 8 ? setIsValidPassword(true) : setIsValidPassword(false);
    }

    const handleRePasswordChange = (text) => {
        setRePassword(text);
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

    const goToUpdate = () => {
        setIsBeingUpdated(true);
        if(user.USER_TYPE === 'customer')
        {
            setIsPref1Checked(pref.includes(list[0]));
            setIsPref2Checked(pref.includes(list[1]));
            setIsPref3Checked(pref.includes(list[2]));
            setIsPref4Checked(pref.includes(list[3]));
            setIsPref5Checked(pref.includes(list[4]));
            setIsPref6Checked(pref.includes(list[5]));
            setIsPref7Checked(pref.includes(list[6]));

            setPassportNumber(user.PASSPORT_NUMBER);
        }

        setUsername(user.USERNAME);
        setFirstName(user.FIRST_NAME);
        setLastName(user.LAST_NAME);
        setEmail(user.EMAIL);
        setPassword("");
        setRePassword("");
    }
    const updateInfo2 = async () =>{
        if (username === user.USERNAME && firstName === user.FIRST_NAME && lastName === user.LAST_NAME && email === user.EMAIL  && (password.length === 0 || password === user.PASSWORD)) {
            alert("No data change was detected.");
        }
        else if (password.length < 8 && password.length !== 0) {
            alert("Invalid password");
        }
        else if (password !== rePassword) {
            alert("Password and Confirmed Password don't match.");
        }
        else {
            let info = {
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "email": email
            }
            password.length === 0 ? info.password = user.PASSWORD : info.password = password;

            const response = await fetch(`http://localhost:3000/agent/${user.USER_ID}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            const result = await response.json();

            if (!result.status) {
                setUsername("");
                alert("This username is already taken. Use another one.");
            }
            else {
                setInfo(result.data);
                setIsBeingUpdated(false);
                navigate("/user");
            }
        }
    }
    const updateInfo = async () => {
        let isPrefSame = true
        let pref1 = []
        for (let i = 0; i < list.length; i++) {
            let check = document.getElementById("pref" + i);
            if (check.checked) {
                pref1.push(check.value);
                if (!pref.includes(check.value)) {
                    isPrefSame = false;
                }
            }
        }
        if (isPrefSame && pref1.length !== pref.length) {
            isPrefSame = false;
        }


        if (username === user.USERNAME && firstName === user.FIRST_NAME && lastName === user.LAST_NAME && email === user.EMAIL && passportNumber === user.PASSPORT_NUMBER && isPrefSame && (password.length === 0 || password === user.PASSWORD)) {
            alert("No data change was detected.");
        }
        else if (password.length < 8 && password.length !== 0) {
            alert("Invalid password");
        }
        else if (password !== rePassword) {
            alert("Password and Confirmed Password don't match.");
        }
        else {
            let info = {
                "username": username,
                "firstName": firstName,
                "lastName": lastName,
                "email": email,
                "passportNumber": passportNumber,
                "preferences": pref1
            }
            password.length === 0 ? info.password = user.PASSWORD : info.password = password;

            const response = await fetch(`http://localhost:3000/customer/${user.USER_ID}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(info)
            });
            const result = await response.json();

            if (!result.status) {
                setUsername("");
                alert("This username is already taken. Use another one.");
            }
            else {
                const response = await fetch(`http://localhost:3000/destination/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(result.data.PREFERENCES)
                });

                result.data.RECOMMENDED_DESTINATIONS = await response.json();

                setInfo(result.data);
                setIsBeingUpdated(false);
                navigate("/user");
            }
        }
    }

    const handleLogOutOrDeleteAccount = async (isDeletingAccount) => {
        isDeletingAccount && (user.USER_TYPE==='customer' ?
        await fetch(`http://localhost:3000/customer/${user.USER_ID}`, {
            method: "DELETE"
        }) : (user.USER_TYPE === 'agent' &&
        await fetch(`http://localhost:3000/agent/${user.USER_ID}`, {
            method: "DELETE"
        })))

        setInfo(null);
        props.setLogOut(true);
        navigate("/");
    }

    return (
        <div className='profile-page'>
            <div className='profile-container'>
                {!isBeingUpdated ? <div>
                    <h1>User Details: </h1>
                    <p>
                        Username: {user.USERNAME}<br />
                        First Name: {user.FIRST_NAME}<br />
                        Last Name: {user.LAST_NAME}<br />
                        Email: {user.EMAIL}<br /><br />
                        {user.USER_TYPE === 'customer' && (
                            <>
                                Passport Number: {user.PASSPORT_NUMBER}<br /><br />
                                Trip Booked: {user.TRIP_BOOKED}<br /><br />
                                {pref.length !== 0 && "Preferences:"}
                            </>
                        )}
                        {
                            user.USER_TYPE === 'agent' && (
                                <>
                                    Experience: {user.EXPERIENCE_YEARS}<br />
                                    Fee: {user.FEE}<br /><br />
                                </>
                            )
                        }
                    </p>
                    {user.USER_TYPE === 'customer' && pref.length !== 0 && (
                        <ul>
                            {pref.map((data, index) => (
                                <li key={index}>{data}</li>
                            ))}
                        </ul>
                    )}

                    <button className="btn-primary" onClick={() => { handleLogOutOrDeleteAccount(false) }}>Log Out</button><br /><br />
                    {(user.USER_TYPE==='customer' || (user.USER_TYPE==='agent' && user.ACC_STATUS==='OK')) && <><button className="btn-primary" onClick={goToUpdate}>Update Account</button><br /><br />
                    <button className="btn-primary" onClick={() => { handleLogOutOrDeleteAccount(true) }}>Delete Account</button></>}
                </div> :
                    <div>
                        <h2>Update Profile:</h2>
                        <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                        <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                        <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                        <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                        {
                            user.USER_TYPE === 'customer' && (
                                <>
                                    <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} /><span style={{ color: "red" }}> *</span></label><br /><br />

                                    <h4>Edit Your Destination Preferences: (Optional)</h4>
                                    <label><input type="checkbox" id="pref0" checked={isPref1Checked} onChange={() => { setIsPref1Checked(!isPref1Checked) }} value={list[0]} />{list[0]}</label><br />
                                    <label><input type="checkbox" id="pref1" checked={isPref2Checked} onChange={() => { setIsPref2Checked(!isPref2Checked) }} value={list[1]} />{list[1]}</label><br />
                                    <label><input type="checkbox" id="pref2" checked={isPref3Checked} onChange={() => { setIsPref3Checked(!isPref3Checked) }} value={list[2]} />{list[2]}</label><br />
                                    <label><input type="checkbox" id="pref3" checked={isPref4Checked} onChange={() => { setIsPref4Checked(!isPref4Checked) }} value={list[3]} />{list[3]}</label><br />
                                    <label><input type="checkbox" id="pref4" checked={isPref5Checked} onChange={() => { setIsPref5Checked(!isPref5Checked) }} value={list[4]} />{list[4]}</label><br />
                                    <label><input type="checkbox" id="pref5" checked={isPref6Checked} onChange={() => { setIsPref6Checked(!isPref6Checked) }} value={list[5]} />{list[5]}</label><br />
                                    <label><input type="checkbox" id="pref6" checked={isPref7Checked} onChange={() => { setIsPref7Checked(!isPref7Checked) }} value={list[6]} />{list[6]}</label><br />
                                    <br />
                                </>
                            )
                        }

                        <PasswordInput Label="Enter Password: " setPass={handlePasswordChange} /><span style={{ color: "red" }}> *</span>
                        {!isValidPassword && !isStarting ? <h5 style={{ color: "red" }}>password must be at least 8 characters long</h5> : <><br /><br /></>}
                        <PasswordInput Label="Confirm Password: " setPass={handleRePasswordChange} /><span style={{ color: "red" }}> *</span><br /><br />

                        <div>
                            <button className="custom-btn" onClick={user.USER_TYPE === 'customer' ? updateInfo : updateInfo2}>Update Profile</button>
                            <button className="custom-btn" onClick={() => { setIsBeingUpdated(false) }}>Cancel</button></div>
                    </div>}
            </div>
            {
                user.USER_TYPE === 'customer' && recommendedDestinations.length!==0 &&
                <div className='recommendation-container'>
                    <h1>Recommended Destinations -</h1>
                    <CategorizedDestination destinationObj={recommendedDestinations} />
                </div>
            }
            {
                user.USER_TYPE === 'admin' &&
                <div className='recommendation-container'>
                    <h1>Pending Tasks -</h1>
                    <div style={{display: 'flex', flexDirection:'column'}}>
                        <div style={{display: 'flex', flexDirection:'column'}}>
                            <h2>Agent accounts to be reviewed - </h2>
                            {pendingAgents.map((agent,index) => {
                                <div key={index}>
                                    
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

ProfileHomePage.propTypes = {
    setLogOut: PropTypes.func,
}

export default ProfileHomePage;