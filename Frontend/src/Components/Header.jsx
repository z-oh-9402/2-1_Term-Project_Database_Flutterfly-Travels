import "../Styles/button.css"

import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext } from "react";
import LoginContext from "../Context/LoginContext";
import UserInfoContext from "../Context/UserInfoContext";
 
const Header = (props)=>{
    const {isLoggedIn} = useContext(LoginContext);
    const {userInfo} = useContext(UserInfoContext);
    const navigate = useNavigate();

    return(<nav className="main-navbar">
        <div className="main-section"><Link to='/' className="basicInfo">Home</Link> <Link to='/about' className="basicInfo">About</Link></div>
        <div className="button-container">
            <button className="btn-primary">Make Trip</button>
            <button className="btn-primary" onClick={()=>{navigate('/destinations')}}>Destinations</button>
            <button className="btn-primary" onClick={()=>{navigate('/hotels');}}>Hotels</button>
            <button className="btn-primary" onClick={()=>{navigate('/restaurants');}}>Restaurants</button>
        </div>
        {isLoggedIn ? <div><h4 className="username">Hello <Link to='user' className="underlinedLink">{userInfo.USERNAME}</Link></h4></div> : <div>
                                    <button className="custom-btn" onClick={()=>props.handleIsInLoginOrSignUpFromNavbar(true)}>Login</button>
                                    <button className="custom-btn" onClick={()=>props.handleIsInLoginOrSignUpFromNavbar(false)}>Sign Up</button>
                                </div>}
    </nav>)
}

Header.propTypes = {
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
}

export default Header;