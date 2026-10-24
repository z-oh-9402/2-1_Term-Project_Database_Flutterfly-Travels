import "../Styles/button.css"
import "../Styles/profile.css"

import PropTypes from 'prop-types'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../Components/PasswordInput';
import UserInfoContext from '../Context/UserInfoContext';
import CategorizedDestination from '../Components/CategorizedDestination';
import AgentTrip from '../Components/AgentTrip';
import AdminTasks from '../Components/AdminTasks';
import OwnAgentReviews from '../Components/OwnAgentReviews';
import useFillWindow from '../Components/useFillWindow';
import { FaSuitcase, FaUser, FaUserShield } from 'react-icons/fa';
import PhotoUploader from "../Components/PhotoUploader";
import DeleteConfirmation from "./DeleteConfirmation";
import Rating from "../Components/Rating";
import useFieldRules, { emailPattern } from "../Components/useFieldRules";
import { apiFetch, photoUrl } from '../api';

const list = ["Mountains", "Lakes", "Beaches", "Forests", "Hill Tracks", "Tea Gardens", "Historical Places"];

const ProfileHomePage = ({setLogOut}) => {
    const { userInfo, setInfo } = useContext(UserInfoContext);
    const user = userInfo;
    const pref = user.user_type === 'customer' ? user.preferences : null;
    const [recommendedDestinations, setRecommendedDestinations] = useState([]);
    // Preference chip the customer clicked to see only that category (null = all categories)
    const [selectedPreference, setSelectedPreference] = useState(null);

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
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [formNote, setFormNote] = useState(null); // a message about the whole form, e.g. nothing to save

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

        };
        fetchData()
    }, [user.preferences]);

    useEffect(() => {
        setIsFileChanged(true);
    }, [selectedFile]);

    const handleUsernameChange = async (e) => {
        setUsername(e.target.value);

        // the user's own username is of course taken (by them)
        if (e.target.value !== "" && e.target.value !== user.username) {
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

    // Fields marked with a red * in the edit form
    const isEmpty = (value) => String(value ?? '').trim() === '';

    // What is wrong with an edit-form field, or null when it meets its rule (the same rules as sign-up)
    const fieldError = (name) => {
        switch(name)
        {
            case 'username': return isEmpty(username) ? "username is required" : (!isValidUsername ? "username already exists" : null);
            case 'firstName': return isEmpty(firstName) ? "first name is required" : null;
            case 'lastName': return isEmpty(lastName) ? "last name is required" : null;
            case 'email': return isEmpty(email) ? "email is required" : (!emailPattern.test(email) ? "enter a valid email address" : null);
            case 'passportNumber': return String(passportNumber ?? '').length !== 12 ? "passport number must contain 12 characters" : null;
            // optional: left empty, the current password stays
            case 'password': return password.length !== 0 && password.length < 8 ? "password must be at least 8 characters long" : null;
            // only checked once the new password itself is fine
            case 'rePassword': return fieldError('password') === null && rePassword !== password ? "passwords don't match" : null;
            default: return null;
        }
    }

    const { containerProps, warning, invalid, showProblem, resetRules } = useFieldRules(fieldError, {rePassword: 'password'});

    // Before saving: goes to the first field that breaks its rule, or says when there is nothing to save
    const readyToSave = (nothingChanged) => {
        const fields = ['username', 'firstName', 'lastName', 'email', ...(user.user_type === 'customer' ? ['passportNumber'] : []), 'password', 'rePassword'];
        const wrong = fields.find(name => fieldError(name) !== null);
        if (wrong) {
            showProblem(wrong);
            return false;
        }
        if (nothingChanged) {
            setFormNote("Nothing has changed yet.");
            return false;
        }
        return true;
    }

    // The server found the username taken (someone took it after it was checked)
    const showUsernameTaken = () => {
        setIsValidUsername(false);
        showProblem('username');
    }

    // The page fills the window below the navbar (and the gap App.jsx leaves under it); the profile column and the
    // other side scroll on their own
    const [pageRef, fillStyle] = useFillWindow();
    const profileColumnRef = useRef(null);
    useLayoutEffect(() => { window.scrollTo(0, 0); }, []);

    // an agent's reviews take the profile column's place (with the photo above them) until they go back
    const [showReviews, setShowReviews] = useState(false);

    // opening or closing the edit form or the reviews starts the profile column from its top
    useEffect(() => {
        profileColumnRef.current?.scrollTo(0, 0);
    }, [isBeingUpdated, showReviews]);

    const goToUpdate = () => {
        resetRules();
        setFormNote(null);
        setIsValidUsername(true);
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
        if (readyToSave(!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && password.length === 0)) {
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
                showUsernameTaken();
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

        if (readyToSave(!isFileChanged && username === user.username && firstName === user.first_name && lastName === user.last_name && email === user.email && passportNumber === user.passport_number && isPrefSame && password.length === 0)) {
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

            if (response.status === 409) {
                showUsernameTaken();
                return;
            }
            if (!response.ok) {
                setFormNote(result.message || "Could not update your profile.");
                return;
            }

            // The response has the updated profile fields; keep the rest (trips, ...) from the current user
            setInfo({ ...user, ...result });
            setIsBeingUpdated(false);
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

    // Ignore a selection that's no longer one of the preferences (e.g. removed in Update Account)
    const activePreference = pref && pref.includes(selectedPreference) ? selectedPreference : null;
    const shownRecommendations = activePreference
        ? recommendedDestinations.filter(category => category.category === activePreference)
        : recommendedDestinations;

    const roleLabels = { customer: 'Customer', agent: 'Travel agent', admin: 'Admin' };
    const RoleIcon = { customer: FaUser, agent: FaSuitcase, admin: FaUserShield }[user?.user_type] ?? FaUser;
    const isCustomer = user?.user_type === 'customer';
    const isAgent = user?.user_type === 'agent';
    const isApprovedAgent = isAgent && user.acc_status === 'OK';
    const isDeclinedAgent = isAgent && user.acc_status !== 'OK' && user.acc_status !== 'PENDING';

    return (
        <div className='profile-page' ref={pageRef} style={fillStyle}>
            {showDeleteConfirmation && <DeleteConfirmation goBack={()=>setShowDeleteConfirmation(false)} shouldDelete={()=>handleLogOutOrDeleteAccount(true)}/>}
            <div className='profile-container' ref={profileColumnRef}>
                {showReviews && isApprovedAgent && !isBeingUpdated ?
                <OwnAgentReviews agentId={user.user_id} photo={user.photo} onBack={() => setShowReviews(false)}/>
                : !isBeingUpdated ?
                <div className="profile-card">
                    <div className="profile-pic larger-profile-pic profile-card-pic"><img src={photoUrl(user.photo)}/></div>
                    <h2 className="profile-name">{user.first_name} {user.last_name}</h2>
                    <p className="profile-username">@{user.username}</p>
                    <span className="profile-role"><RoleIcon/> {roleLabels[user.user_type]}</span>

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
                                <button type="button" className="profile-reviews-link" onClick={() => setShowReviews(true)}>Show reviews</button>
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

                // same fields and warning rules as the sign-up form; editing anything clears the form-wide note
                <div className="profile-form styled-form" {...containerProps}
                     onInput={(e) => { containerProps.onInput(e); setFormNote(null); }}>
                    <h2 className="profile-form-title">Edit Profile</h2>
                    <div data-field="photo">
                        <PhotoUploader height={180} selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
                    </div>

                    <div className="profile-form-field">
                        <label><span>Username <span className="required">*</span></span>
                            <input name="username" aria-invalid={invalid('username')} value={username} placeholder='Enter username' onChange={handleUsernameChange} />
                        </label>
                        {warning('username')}
                    </div>
                    <div className="profile-form-field">
                        <label><span>First Name <span className="required">*</span></span>
                            <input name="firstName" aria-invalid={invalid('firstName')} value={firstName} placeholder='Enter first name' onChange={handleFirstNameChange} />
                        </label>
                        {warning('firstName')}
                    </div>
                    <div className="profile-form-field">
                        <label><span>Last Name <span className="required">*</span></span>
                            <input name="lastName" aria-invalid={invalid('lastName')} value={lastName} placeholder='Enter last name' onChange={handleLastNameChange} />
                        </label>
                        {warning('lastName')}
                    </div>
                    <div className="profile-form-field">
                        <label><span>Email <span className="required">*</span></span>
                            <input name="email" aria-invalid={invalid('email')} value={email} placeholder='Enter email' onChange={handleEmailChange} />
                        </label>
                        {warning('email')}
                    </div>

                    {user.user_type === 'customer' &&
                    <>
                        <div className="profile-form-field">
                            <label><span>Passport Number <span className="required">*</span></span>
                                <input name="passportNumber" aria-invalid={invalid('passportNumber')} value={passportNumber} placeholder='Enter passport number' onChange={handlePassportNumberChange} />
                            </label>
                            {warning('passportNumber')}
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
                            <PasswordInput Label="New Password" name="password" invalid={invalid('password')} password={password} setPassword={handlePasswordChange} />
                            {warning('password')}
                        </div>
                        <div className="profile-form-field">
                            <PasswordInput Label="Confirm New Password" name="rePassword" invalid={invalid('rePassword')} password={rePassword} setPassword={handleRePasswordChange} />
                            {warning('rePassword')}
                        </div>
                    </div>

                    {formNote && <p className="profile-form-note">{formNote}</p>}
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

                {user.user_type === 'admin' && <AdminTasks/>}
            </div>
        </div>
    )
}

ProfileHomePage.propTypes = {
    setLogOut: PropTypes.func,
}

export default ProfileHomePage;