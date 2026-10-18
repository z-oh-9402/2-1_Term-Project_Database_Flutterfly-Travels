import "../Styles/button.css"
import "../Styles/profile.css"

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
import { apiFetch, photoUrl } from '../api';

const list = ["Mountains", "Lakes", "Beaches", "Forests", "Hill Tracks", "Tea Gardens", "Historical Places"];

const ProfileHomePage = ({setLogOut}) => {
    const { userInfo, setInfo } = useContext(UserInfoContext);
    const user = userInfo;
    const pref = user.user_type === 'customer' ? user.preferences : null;
    const [recommendedDestinations, setRecommendedDestinations] = useState([]);
    // Preference chip the customer clicked to see only that category (null = all categories)
    const [selectedPreference, setSelectedPreference] = useState(null);
    const [pendingAgents, setPendingAgents] = useState([]);
    const [pendingTrips, setPendingTrips] = useState([]);

    const [isPref1Checked, setIsPref1Checked] = useState(pref ? pref.includes(list[0]) : pref);
    const [isPref2Checked, setIsPref2Checked] = useState(pref ? pref.includes(list[1]) : pref);
    const [isPref3Checked, setIsPref3Checked] = useState(pref ? pref.includes(list[2]) : pref);
    const [isPref4Checked, setIsPref4Checked] = useState(pref ? pref.includes(list[3]) : pref);
    const [isPref5Checked, setIsPref5Checked] = useState(pref ? pref.includes(list[4]) : pref);
    const [isPref6Checked, setIsPref6Checked] = useState(pref ? pref.includes(list[5]) : pref);
    const [isPref7Checked, setIsPref7Checked] = useState(pref ? pref.includes(list[6]) : pref);
    // [checked, setChecked] for each entry of list, in the same order
    const preferenceChecks = [
        [isPref1Checked, setIsPref1Checked], [isPref2Checked, setIsPref2Checked], [isPref3Checked, setIsPref3Checked],
        [isPref4Checked, setIsPref4Checked], [isPref5Checked, setIsPref5Checked], [isPref6Checked, setIsPref6Checked],
        [isPref7Checked, setIsPref7Checked],
    ];

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
            // Current photo, shown in the edit form (a plain fetch: Supabase must not get our login token)
            if(!selectedFile && photoUrl(user.photo) === user.photo)
            {
                const response = await fetch(user.photo);
                const blob = await response.blob();
                const file = new File([blob], "image", { type: blob.type });
                setSelectedFile(file);
            }

            if (user.user_type === 'customer') {
                const response = await apiFetch(`http://localhost:3000/destination/`, {
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
                let response = await apiFetch(`http://localhost:3000/agent/pending-agents/`, {
                    method: "GET"
                });

                const data = await response.json();
                setPendingAgents(data);

                response = await apiFetch(`http://localhost:3000/trip/fetch-pending-trips/`, {
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
            const response = await apiFetch(`http://localhost:3000/user/${e.target.value}`, {
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

    // Fields marked with a red * in the edit form
    const isEmpty = (value) => String(value ?? '').trim() === '';
    const hasEmptyRequiredField = (includePassport) =>
        [username, firstName, lastName, email, ...(includePassport ? [passportNumber] : [])].some(isEmpty);

    const updateInfo2 = async () => {
        if (hasEmptyRequiredField(false)) {
            alert("Please fill in all the required fields (marked with *).");
        }
        else if (!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && password.length === 0) {
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
            if (isFileChanged && selectedFile) formData.append('file', selectedFile); // no file = keep the current photo
            formData.append('username', username);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('password', password); // empty = keep the current password

            const response = await apiFetch(`http://localhost:3000/agent/${user.user_id}`, {
                method: "PUT",
                body: formData
            });
            const result = await response.json();

            if (!result.status) {
                setUsername("");
                alert("This username is already taken. Use another one.");
            }
            else {
                // The response has the updated profile fields; keep the rest (trips, acc_status, ...) from the current user
                setInfo({ ...user, ...result.data });
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

        if (hasEmptyRequiredField(true)) {
            alert("Please fill in all the required fields (marked with *).");
        }
        else if (!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && passportNumber === user.passport_number && isPrefSame && password.length === 0) {
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
            if (isFileChanged && selectedFile) formData.append('file', selectedFile); // no file = keep the current photo
            formData.append('username', username);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('email', email);
            formData.append('passportNumber', passportNumber);
            formData.append('password', password); // empty = keep the current password
            formData.append('preferences', JSON.stringify(pref1));

            const response = await apiFetch(`http://localhost:3000/customer/${user.user_id}`, {
                method: "PUT",
                body: formData
            });
            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Could not update your profile.");
                return;
            }

            // The response has the updated profile fields; keep the rest (trips, ...) from the current user
            setInfo({ ...user, ...result });
            setIsBeingUpdated(false);
        }
    }


    const acceptRequest = async (agent) => {

        const response = await apiFetch(`http://localhost:3000/agent/acceptRequest/${agent.user_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "acc_status": "OK" })
        });
        const result = await response.json();
        if (result.status === 1) {
            const response = await apiFetch(`http://localhost:3000/agent/pending-agents/`, {
                method: "GET"
            });

            const data = await response.json();
            setPendingAgents(data);
        }
    }
    const declineRequest = async (agent) => {
        const response = await apiFetch(`http://localhost:3000/agent/declineRequest/${agent.user_id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "status": "" })
        });
        const result = await response.json();
        if (result.status === 1) {
            const response = await apiFetch(`http://localhost:3000/agent/pending-agents/`, {
                method: "GET"
            });

            const data = await response.json();
            setPendingAgents(data);
        }
    }
    const handleLogOutOrDeleteAccount = async (isDeletingAccount) => {
        if(isDeletingAccount)
        {
            await apiFetch(`http://localhost:3000/user/${user.user_id}`, {
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
            response = await apiFetch(`http://localhost:3000/trip/admin-decision/`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tripId: trip.trip_id })
            });
        }
        else
        {
            response = await apiFetch(`http://localhost:3000/trip/admin-decision/`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ tripId: trip.trip_id })
            });
        }
        await response.json();

        response = await apiFetch(`http://localhost:3000/trip/fetch-pending-trips/`, {
            method: "GET"
        });

        const data = await response.json();
        setPendingTrips(data);
    }

    // Ignore a selection that's no longer one of the preferences (e.g. removed in Update Account)
    const activePreference = pref && pref.includes(selectedPreference) ? selectedPreference : null;
    const shownRecommendations = activePreference
        ? recommendedDestinations.filter(category => category.category === activePreference)
        : recommendedDestinations;

    const roleLabels = { customer: 'Customer', agent: 'Travel Agent', admin: 'Admin' };
    const isCustomer = user?.user_type === 'customer';
    const isAgent = user?.user_type === 'agent';
    const isApprovedAgent = isAgent && user.acc_status === 'OK';
    const isDeclinedAgent = isAgent && user.acc_status !== 'OK' && user.acc_status !== 'PENDING';

    return (
        <div className='profile-page'>
            {showDeleteConfirmation && <DeleteConfirmation goBack={()=>setShowDeleteConfirmation(false)} shouldDelete={()=>handleLogOutOrDeleteAccount(true)}/>}
            <div className='profile-container'>
                {!isBeingUpdated ?
                <div className="profile-card">
                    <div className="profile-pic larger-profile-pic profile-card-pic"><img src={photoUrl(user.photo)}/></div>
                    <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                    <p className="profile-username">@{user.username}</p>
                    <span className="profile-role">{roleLabels[user.user_type]}</span>

                    <dl className="profile-details">
                        <div className="profile-detail">
                            <dt>Email</dt>
                            <dd>{user.email}</dd>
                        </div>

                        {isCustomer && <>
                            <div className="profile-detail">
                                <dt>Passport Number</dt>
                                <dd>{user.passport_number}</dd>
                            </div>
                            <div className="profile-detail">
                                <dt>Trips Booked</dt>
                                <dd>{user.trip_booked}</dd>
                            </div>
                        </>}

                        {isAgent && <>
                            <div className="profile-detail">
                                <dt>Experience</dt>
                                <dd>{user.experience_years} {Number(user.experience_years) === 1 ? 'year' : 'years'}</dd>
                            </div>
                            <div className="profile-detail">
                                <dt>Fee</dt>
                                <dd>৳ {Number(user.fee).toLocaleString('en-US')}</dd>
                            </div>
                            {user.acc_status === 'OK' &&
                            <div className="profile-detail">
                                <dt>Rating</dt>
                                <dd><Rating rating={parseFloat(user.rating)} isChanging={false} setRating={null} count={Number(user.rating_count)}/></dd>
                            </div>}
                        </>}
                    </dl>

                    {isCustomer && pref.length !== 0 &&
                        <div className="profile-section">
                            <h4 className="profile-section-title">Preferences</h4>
                            <div className="profile-chips">
                                {pref.map((data, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={"profile-chip" + (activePreference === data ? " selected" : "")}
                                        aria-pressed={activePreference === data}
                                        onClick={() => setSelectedPreference(activePreference === data ? null : data)}
                                    >
                                        {data}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }

                    {isAgent && user.acc_status === 'PENDING' &&
                        <p className="profile-notice">Your registration is waiting for an admin to approve it.</p>}
                    {isDeclinedAgent &&
                        <p className="profile-notice profile-notice-declined">Your registration was declined.</p>}

                    <div className="profile-actions">
                        {(isCustomer || isApprovedAgent) && <button className="btn-primary" onClick={goToUpdate}>Update Account</button>}
                        <button className="btn-primary" onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button>
                        {(isCustomer || isApprovedAgent || isDeclinedAgent) &&
                            <button className="btn-primary btn-danger" onClick={()=>setShowDeleteConfirmation(true)}>{isDeclinedAgent ? 'Delete Request' : 'Delete Account'}</button>}
                    </div>
                </div> :

                <div className="profile-form">
                    <h2 className="profile-form-title">Edit Profile</h2>
                    <PhotoUploader height={120}  selectedFile={selectedFile} setSelectedFile={setSelectedFile} />

                    <div className="profile-form-field">
                        <label><span>Username <span className="required">*</span></span>
                            <input value={username} placeholder='Enter username' onChange={handleUsernameChange} />
                        </label>
                        {isEmpty(username) && <p className="field-error">Username is required</p>}
                        {!isValidUsername && <p className="field-error">This username is already taken</p>}
                    </div>
                    <div className="profile-form-field">
                        <label><span>First Name <span className="required">*</span></span>
                            <input value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} />
                        </label>
                        {isEmpty(firstName) && <p className="field-error">First name is required</p>}
                    </div>
                    <div className="profile-form-field">
                        <label><span>Last Name <span className="required">*</span></span>
                            <input value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} />
                        </label>
                        {isEmpty(lastName) && <p className="field-error">Last name is required</p>}
                    </div>
                    <div className="profile-form-field">
                        <label><span>Email <span className="required">*</span></span>
                            <input type="email" value={email} placeholder='Enter email' onChange={handleEmailChange} />
                        </label>
                        {isEmpty(email) && <p className="field-error">Email is required</p>}
                    </div>

                    {user.user_type === 'customer' &&
                    <>
                        <div className="profile-form-field">
                            <label><span>Passport Number <span className="required">*</span></span>
                                <input value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} />
                            </label>
                            {isEmpty(passportNumber) ?
                                <p className="field-error">Passport number is required</p>
                                : (!isValidPassport && !isPassportStarting && <p className="field-error">Passport number must be 12 characters</p>)}
                        </div>

                        <div className="profile-form-section">
                            <h4 className="profile-form-heading">Destination Preferences <span className="optional">(optional)</span></h4>
                            {/* Still real checkboxes with ids pref0..pref6: updateInfo reads them when saving */}
                            <div className="profile-chips">
                                {list.map((name, index) => {
                                    const [isChecked, setIsChecked] = preferenceChecks[index];
                                    return (
                                        <label key={name} className={"profile-chip pref-chip" + (isChecked ? " selected" : "")}>
                                            <input type="checkbox" id={"pref" + index} checked={isChecked} onChange={() => setIsChecked(!isChecked)} value={name} />
                                            {name}
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </>}

                    <div className="profile-form-section">
                        <h4 className="profile-form-heading">Change Password <span className="optional">(optional)</span></h4>
                        <p className="profile-form-hint">Leave both fields empty to keep your current password.</p>
                        <div className="profile-form-field">
                            <PasswordInput Label="New Password" password={password} setPassword={handlePasswordChange} />
                            {/* Empty is allowed here (keeps the current password), so only warn about a non-empty short one */}
                            {password.length !== 0 && !isValidPassword && !isPasswordStarting && <p className="field-error">Password must be at least 8 characters</p>}
                        </div>
                        <div className="profile-form-field">
                            <PasswordInput Label="Confirm New Password" password={rePassword} setPassword={handleRePasswordChange} />
                            {rePassword.length !== 0 && rePassword !== password && <p className="field-error">Passwords don&apos;t match</p>}
                        </div>
                    </div>

                    <div className="profile-form-actions">
                        <button className="btn-primary" onClick={user.user_type === 'customer' ? updateInfo : updateInfo2}>Save Changes</button>
                        <button className="btn-primary" onClick={() => { setIsBeingUpdated(false) }}>Cancel</button>
                    </div>
                </div>}
            </div>
            
            <div className='recommendation-container'>
                {user.user_type === 'customer' && recommendedDestinations.length !== 0 &&
                <>
                    <h1>Recommended Destinations -</h1>
                    <CategorizedDestination destinationObj={shownRecommendations} />
                    {activePreference && !shownRecommendations.some(category => category.destinations.length !== 0) &&
                        <p>No destinations in {activePreference} yet.</p>}
                </>}

                {(user.user_type === 'agent' && user.acc_status === 'OK') && <AgentTrip/>}

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