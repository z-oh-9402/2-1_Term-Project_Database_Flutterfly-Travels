import "../Styles/button.css"

import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../Components/PasswordInput';
import UserInfoContext from '../Context/UserInfoContext';
import CategorizedDestination from '../Components/CategorizedDestination';
import AgentTrip from '../Components/AgentTrip';
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import PhotoUploader from "../Components/PhotoUploader";
import DeleteConfirmation from "./DeleteConfirmation";
import Rating from "../Components/Rating";

const list = ["Mountains", "Lakes", "Beaches", "Forests", "Hill Tracks", "Tea Gardens", "Historical Places"];

const ProfileHomePage = ({setLogOut}) => {
    const { userInfo, setInfo } = useContext(UserInfoContext);
    const user = userInfo;
    const pref = user.user_type === 'customer' ? user.preferences : null;
    const [recommendedDestinations, setRecommendedDestinations] = useState([]);
    const [pendingAgents, setPendingAgents] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);

    const [isPref1Checked, setIsPref1Checked] = useState(pref ? pref.includes(list[0]) : pref);
    const [isPref2Checked, setIsPref2Checked] = useState(pref ? pref.includes(list[1]) : pref);
    const [isPref3Checked, setIsPref3Checked] = useState(pref ? pref.includes(list[2]) : pref);
    const [isPref4Checked, setIsPref4Checked] = useState(pref ? pref.includes(list[3]) : pref);
    const [isPref5Checked, setIsPref5Checked] = useState(pref ? pref.includes(list[4]) : pref);
    const [isPref6Checked, setIsPref6Checked] = useState(pref ? pref.includes(list[5]) : pref);
    const [isPref7Checked, setIsPref7Checked] = useState(pref ? pref.includes(list[6]) : pref);

    const navigate = useNavigate();
    const [isBeingUpdated, setIsBeingUpdated] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isFileChanged, setIsFileChanged] = useState(false);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [firstName, setFirstName] = useState(user.first_name);
    const [lastName, setLastName] = useState(user.last_name);
    const [email, setEmail] = useState(user.email);
    const [passportNumber, setPassportNumber] = useState(user.user_type === 'customer' ? user.passport_number : null);
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [isValidPassport, setIsValidPassport] = useState(true);
    const [isPasswordStarting, setIsPasswordStarting] = useState(true);
    const [isPassportStarting, setIsPassportStarting] = useState(true);

    const [currentCategory, setCurrentCategory] = useState(0);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if(!selectedFile && user.photo)
            {
                const response = await fetch('http://localhost:3000/uploads/'+user.photo);
                const blob = await response.blob();
                const file = new File([blob], "image.jpg", { type: 'image/jpeg' });
                setSelectedFile(file);
            }

            if (user.user_type === 'customer') {
                const response = await fetch(`http://localhost:3000/destination/`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user.preferences)
                });

                const data = await response.json();
                setRecommendedDestinations(data);
            }

            if (user.user_type === 'admin') {
                let response = await fetch(`http://localhost:3000/agent/pending-agents/`, {
                    method: "GET"
                });

                const data = await response.json();
                setPendingAgents(data);

                response = await fetch(`http://localhost:3000/trip/fetch-pending-trips/`, {
                    method: "GET"
                });

                const data2 = await response.json();
                setPendingTrips(data2);
            }
        };
        fetchData()
    }, [user.preferences]);

    useEffect(() => {
        setIsFileChanged(true);
    }, [selectedFile]);

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value);

        if (e.target.value !== "") {
            const response = await fetch(`http://localhost:3000/user/${e.target.value}`, {
                method: "GET"
            });
            const result = await response.json();

            if (result.status === 1) {
                setIsValidUsername(false);
            }
            else {
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
        setIsPassportStarting(false);
        e.target.value.length === 12 ? setIsValidPassport(true) : setIsValidPassport(false);
    }

    const goToUpdate = () => {
        setIsBeingUpdated(true);
        setIsFileChanged(false);
        setUsername(user.username);
        setFirstName(user.first_name);
        setLastName(user.last_name);
        setEmail(user.email);

        if(user.user_type === 'customer')
        {
            setPassportNumber(user.passport_number);
            setIsPref1Checked(pref.includes(list[0]));
            setIsPref2Checked(pref.includes(list[1]));
            setIsPref3Checked(pref.includes(list[2]));
            setIsPref4Checked(pref.includes(list[3]));
            setIsPref5Checked(pref.includes(list[4]));
            setIsPref6Checked(pref.includes(list[5]));
            setIsPref7Checked(pref.includes(list[6]));
        }

        setPassword("");
        setRePassword("");
    }

    const updateInfo2 = async () => {
        if (!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && (password.length === 0 || password === user.password)) {
            alert("No data change was detected.");
        }
        else if (password.length < 8 && password.length !== 0) {
            alert("Invalid password");
        }
        else if (password !== rePassword) {
            alert("Password and Confirmed Password don't match.");
        }
        else {
            let formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('username', username);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password.length === 0 ? user.password : password);

            const response = await fetch(`http://localhost:3000/agent/${user.user_id}`, {
                method: "PUT",
                body: formData
            });
            const result = await response.json();

            if (!result.status) {
                setUsername("");
                alert("This username is already taken. Use another one.");
            }
            else {
                setInfo(result.data);
                setIsBeingUpdated(false);
            }
        }
    }

    const updateInfo = async () => {
        let isPrefSame = true;
        let pref1 = []
        for (let i = 0; i < list.length; i++) {
            let check = document.getElementById("pref" + i);
            if (check.checked) {
                pref1.push({id: i+1, name: check.value});
                if (!pref.includes(check.value)) {
                    isPrefSame = false;
                }
            }
        }
        if (isPrefSame && pref1.length !== pref.length) {
            isPrefSame = false;
        }

        if (!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && passportNumber === user.passport_number && isPrefSame && (password.length === 0 || password === user.password)) {
            alert("No data change was detected.");
        }
        else if (password.length < 8 && password.length !== 0) {
            alert("Invalid password");
        }
        else if (password !== rePassword) {
            alert("Password and Confirmed Password don't match.");
        }
        else {
            let formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('username', username);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('passportNumber', passportNumber);
            formData.append('password', password.length === 0 ? user.password : password);
            formData.append('preferences', JSON.stringify(pref1));

            const response = await fetch(`http://localhost:3000/customer/${user.user_id}`, {
                method: "PUT",
                body: formData
            });
            const result = await response.json();

            setInfo(result);
            setIsBeingUpdated(false);
        }
    }


    const acceptRequest = async (agent) => {

        const response = await fetch(`http://localhost:3000/agent/acceptRequest/${agent.user_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "acc_status": "OK" })
        });
        const result = await response.json();
        if (result.status === 1) {
            const response = await fetch(`http://localhost:3000/agent/pending-agents/`, {
                method: "GET"
            });

            const data = await response.json();
            setPendingAgents(data);
        }
    }
    const declineRequest = async (agent) => {
        const response = await fetch(`http://localhost:3000/agent/declineRequest/${agent.user_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "status": "" })
        });
        const result = await response.json();
        if (result.status === 1) {
            const response = await fetch(`http://localhost:3000/agent/pending-agents/`, {
                method: "GET"
            });

            const data = await response.json();
            setPendingAgents(data);
        }
    }
    const handleLogOutOrDeleteAccount = async (isDeletingAccount) => {
        if(isDeletingAccount)
        {
            await fetch(`http://localhost:3000/user/${user.user_id}`, {
                method: "DELETE"
            })
        }     

        setShowDeleteConfirmation(false);
        setInfo(null);
        setLogOut(true);
        navigate("/");
    }

    const adminDecision = async (index, isAccepted) => {
        const trip = pendingTrips[index];

        let response;
        if(isAccepted)
        {
            response = await fetch(`http://localhost:3000/trip/admin-decision/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tripId: trip.trip_id })
            });
        }
        else
        {
            response = await fetch(`http://localhost:3000/trip/admin-decision/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tripId: trip.trip_id })
            });
        }
        await response.json();

        response = await fetch(`http://localhost:3000/trip/fetch-pending-trips/`, {
            method: "GET"
        });

        const data = await response.json();
        setPendingTrips(data);
    }

    return (
        <div className='profile-page'>
            {showDeleteConfirmation && <DeleteConfirmation goBack={()=>setShowDeleteConfirmation(false)} shouldDelete={()=>handleLogOutOrDeleteAccount(true)}/>}
            <div className='profile-container'>
                {!isBeingUpdated ? 
                <div>
                    <div className="profile-pic larger-profile-pic"><img src={user.photo.length ? 'http://localhost:3000/uploads/'+user.photo : "default_profile_pic.jpeg"}/></div><br/>
                    <p>
                        Username: {user.username}<br />
                        First Name: {user.first_name}<br />
                        Last Name: {user.last_name}<br />
                        Email: {user.email}<br /><br />

                        {user.user_type === 'customer' && (
                            <>
                                Passport Number: {user.passport_number}<br /><br />
                                Trip Booked: {user.trip_booked}<br /><br />
                                {pref.length !== 0 && "Preferences:"}
                            </>
                        )}

                        {user.user_type === 'agent' && (
                            <>
                                Experience: {user.experience_years}<br />
                                Fee: {user.fee}<br />
                                {user.acc_status === 'OK' && <>Rating: <Rating rating={parseFloat(user.rating)} isChanging={false} setRating={null}/><br /><br /></>}
                            </>
                        )}
                    </p>

                    {user.user_type === 'customer' && pref.length !== 0 &&
                        <>
                            <ul>
                                {pref.map((data, index) => (
                                    <li key={index}>{data}</li>
                                ))}
                            </ul>

                            <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br /><br />
                            <button className="btn-primary" onClick={goToUpdate}>Update Account</button><br /><br />
                            <button className="btn-primary" onClick={()=>setShowDeleteConfirmation(true)}>Delete Account</button>
                        </>
                    }
                    
                    {user.user_type === 'agent' && 
                        (user.acc_status === 'OK' ?
                        <>
                            <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br /><br />
                            <button className="btn-primary" onClick={goToUpdate}>Update Account</button><br/><br/>
                            <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(true)}}>Delete Account</button>
                        </> :
                        (user.acc_status === 'PENDING' ?
                            <>
                                <h3>Your request is still being processed!!!</h3>
                                <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br /><br />
                            </> :
                            <>
                                <h3>Your request has been declined!!!</h3>
                                <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br /><br />
                                <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(true)}}>Delete request</button>
                            </>
                        ))
                    }

                    {user.user_type === 'admin' && 
                        <>
                            <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br /><br />
                        </>
                    }
                </div> :

                <div>
                    <h2>Update Profile:</h2>
                    <PhotoUploader height={120}  selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                    <label>Username: <input value={username} placeholder='Enter username' onChange={handleUsernameChange} /><span style={{ color: "red" }}> *</span></label><br/>
                    {!isValidUsername ? <h5 style={{ color: "red" }}>username already exists</h5> : <br />}
                    <label>First Name: <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                    <label>Last Name: <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                    <label>Email: <input value={email} placeholder='Enter email' onChange={handleEmailChange} /><span style={{ color: "red" }}> *</span></label><br /><br />
                    
                    {user.user_type === 'customer' && 
                    <>
                        <label>Passport Number: <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} /><span style={{ color: "red" }}> *</span></label>
                        {!isValidPassport && !isPassportStarting ? <h5 style={{ color: "red" }}>passport number must contain 12 characters</h5> : <><br /><br /></>}

                        <h4>Edit Your Destination Preferences: (Optional)</h4>
                        <label><input type="checkbox" id="pref0" checked={isPref1Checked} onChange={() => { setIsPref1Checked(!isPref1Checked) }} value={list[0]} />{list[0]}</label><br />
                        <label><input type="checkbox" id="pref1" checked={isPref2Checked} onChange={() => { setIsPref2Checked(!isPref2Checked) }} value={list[1]} />{list[1]}</label><br />
                        <label><input type="checkbox" id="pref2" checked={isPref3Checked} onChange={() => { setIsPref3Checked(!isPref3Checked) }} value={list[2]} />{list[2]}</label><br />
                        <label><input type="checkbox" id="pref3" checked={isPref4Checked} onChange={() => { setIsPref4Checked(!isPref4Checked) }} value={list[3]} />{list[3]}</label><br />
                        <label><input type="checkbox" id="pref4" checked={isPref5Checked} onChange={() => { setIsPref5Checked(!isPref5Checked) }} value={list[4]} />{list[4]}</label><br />
                        <label><input type="checkbox" id="pref5" checked={isPref6Checked} onChange={() => { setIsPref6Checked(!isPref6Checked) }} value={list[5]} />{list[5]}</label><br />
                        <label><input type="checkbox" id="pref6" checked={isPref7Checked} onChange={() => { setIsPref7Checked(!isPref7Checked) }} value={list[6]} />{list[6]}</label><br />
                        <br />
                    </>}

                    <PasswordInput Label="Enter Password: " password={password} setPassword={handlePasswordChange} /><span style={{ color: "red" }}> *</span>
                    {!isValidPassword && !isPasswordStarting ? <h5 style={{ color: "red" }}>password must be at least 8 characters long</h5> : <><br /><br /></>}
                    <PasswordInput Label="Confirm Password: " password={rePassword} setPassword={handleRePasswordChange} /><span style={{ color: "red" }}> *</span><br /><br />

                    <div>
                        <button className="btn-primary" style={{marginRight: '10px'}} onClick={user.user_type === 'customer' ? updateInfo : updateInfo2}>Update Profile</button>
                        <button className="btn-primary" onClick={() => { setIsBeingUpdated(false) }}>Cancel</button></div>
                </div>}
            </div>
            
            <div className='recommendation-container'>
                {user.user_type === 'customer' && recommendedDestinations.length !== 0 &&
                <>
                    <h1>Recommended Destinations -</h1>
                    <CategorizedDestination destinationObj={recommendedDestinations} />
                </>}

                {(user.user_type === 'agent' && user.acc_status === 'OK') ?
                <AgentTrip/> :
                <h1>Nothing to show here...</h1>}

                {user.user_type === 'admin' &&
                <>
                    <h1>Pending Tasks -</h1>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className='agent-side' style={{ display: 'flex', flexDirection: 'column', marginRight: '80px'}}>
                            <div className="category-bar" id="categoryBar">
                                <div className={"category" + (currentCategory===0 ? " selected-category" : "")} id="category0" onClick={()=>setCurrentCategory(0)}>Agent accounts to be reviewed</div>
                                <div className={"category" + (currentCategory===1 ? " selected-category" : "")} id="category1" onClick={()=>setCurrentCategory(1)}>Trip packages to be reviewed</div>
                            </div>

                            <div style={{marginTop: "20px"}}>
                                {currentCategory===0 && 
                                (pendingAgents.length===0 ? <>Nothing to be reviewed</>
                                :
                                pendingAgents.map((agent, index) =>
                                    <div key={index} className="agent-box">
                                        <h3>{agent.username}</h3>
                                        <p>Experience: {agent.experience_years} years</p>
                                        <p>Fee: {agent.fee}</p>
                                        <div className="button-container2">
                                            <button className="btn-primary" onClick={() => acceptRequest(agent)}>Accept</button>
                                            <span style={{ margin: '0 10px' }}></span>
                                            <button className="btn-primary" onClick={() => declineRequest(agent)}>Decline</button>
                                        </div>
                                    </div>
                                ))}

                                {currentCategory===1 &&
                                (pendingTrips.length===0 ? <div>Nothing to be reviewed</div>
                                :
                                pendingTrips.map((trip, index) =>
                                <div key={index} className="agent-box">
                                    <TiTick className='tick-button' onClick={()=>adminDecision(index, true)}/>
                                    <RxCross2 className='delete-button' onClick={()=>adminDecision(index, false)}/>
                                    <h3>{trip.name}</h3>
                                    <p>Cost: {trip.total_cost}</p>
                                    <p>Start Date:&nbsp;
                                        {new Date(trip.departure_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>End Date:&nbsp;
                                        {new Date(trip.return_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p>Agent: {trip.agent_name}</p>
                                    <p>Customer: {trip.customer_name}</p>
                                </div>))}
                            </div>
                        </div>
                    </div>
                </>}
            </div>
        </div>
    )
}

ProfileHomePage.propTypes = {
    setLogOut: PropTypes.func,
}

export default ProfileHomePage;