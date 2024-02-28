import "../Styles/button.css"
import "../Styles/navbar.css"

import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
 
const Header = (props)=>{
    const {userInfo} = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [isBottomStyles, setIsBottomStyles] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            var scrollPosition = window.scrollY;
            var scrollThreshold = document.getElementById('main-nav').offsetHeight;
    
            setIsBottomStyles(scrollPosition >= scrollThreshold);
            setPlaceholderHeight(scrollThreshold);
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    

    return(
        <>
            <nav className={`main-navbar ${isBottomStyles && 'bottom-styles'}`} id='main-nav'>
                <div className="main-section"><Link to='/' className="basicInfo">Home</Link> <Link to='/about' className="basicInfo">About</Link></div>
                <div className="button-container">
                    {(userInfo!==null && userInfo.USER_TYPE === 'customer') && <button className="btn-primary">My Trip</button>}
                    <button className="btn-primary" onClick={()=>{navigate('/destinations')}}>Destinations</button>
                    <button className="btn-primary" onClick={()=>{navigate('/accommodations');}}>Accommodations</button>
                    <button className="btn-primary" onClick={()=>{navigate('/restaurants');}}>Restaurants</button>
                    <button className="btn-primary" onClick={()=>{navigate('/flights');}}>Flights</button>
                    <button className="btn-primary" onClick={()=>{navigate('/transports');}}>Transports</button>
                </div>
                {userInfo!==null ? 
                    <div><h4 className="username">Hello <Link to='user'>{userInfo.USERNAME}</Link></h4></div> : 
                    <div>
                        <button className="custom-btn" onClick={()=>props.handleIsInLoginOrSignUpFromNavbar(true)}>Login</button>
                        <button className="custom-btn" onClick={()=>props.handleIsInLoginOrSignUpFromNavbar(false)}>Sign Up</button>
                    </div>}
            </nav>
            {isBottomStyles && <div style={{height: `${placeholderHeight}px`}}></div>}
        </>)
}

Header.propTypes = {
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
}

export default Header;