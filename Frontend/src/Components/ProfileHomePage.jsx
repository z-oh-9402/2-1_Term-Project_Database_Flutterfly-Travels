import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom';

const ProfileHomePage = (props) =>{
    const user = props.loginInfo;
    const pref = user.PREFERENCES;
    const navigate = useNavigate();

    const handleLogOutOrDeleteAccount = async (isDeletingAccount) =>{
        {isDeletingAccount && 
            await fetch(`http://localhost:3000/customer/${user.USER_ID}`,{
                method: "DELETE"
            })}

        props.setLogOut(undefined,true);
        navigate("/");
    }

    return(<>
        <div>
            <h1>User Details: </h1>
            <p>
                Username: {user.USERNAME}<br/>
                First Name: {user.FIRST_NAME}<br/>
                Last Name: {user.LAST_NAME}<br/>
                Email: {user.EMAIL}<br/><br/>
                Passport Number: {user.PASSPORT_NUMBER}<br/><br/>
                Trip Booked: {user.TRIP_BOOKED}<br/><br/>
                {pref.length!==0 && "Preferences:"}
            </p>
            {pref.length!==0 && <ul>
                {pref.map((data,index)=>
                    <li key={index}>{data}</li>
                )}
            </ul>}

            <button onClick={() => {handleLogOutOrDeleteAccount(false)}}>Log Out</button><br/><br/>
            <button onClick={() => {handleLogOutOrDeleteAccount(true)}}>Delete Account</button>
        </div>
        <div></div>
    </>)
}

ProfileHomePage.propTypes = {
    setLogOut: PropTypes.func,
    loginInfo: PropTypes.object
}

export default ProfileHomePage;