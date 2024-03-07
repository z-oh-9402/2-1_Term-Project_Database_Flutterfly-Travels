import "../Styles/button.css"
import "../Styles/navbar.css"

import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import { IoMdNotifications } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { IoCafe } from "react-icons/io5";
import { IoAirplaneSharp } from "react-icons/io5";
import { IoBedSharp } from "react-icons/io5";
import { IoGlobeSharp } from "react-icons/io5";

const Header = (props)=>{
    const {handleIsInLoginOrSignUpFromNavbar, setShowTrips} = props;
    const {userInfo} = useContext(UserInfoContext);
    const navigate = useNavigate();
    const [isBottomStyles, setIsBottomStyles] = useState(false);
    const [placeholderHeight, setPlaceholderHeight] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            var scrollPosition = window.scrollY;
            var scrollThreshold = document.getElementById('main-nav').offsetHeight;

            document.getElementById('main-nav').style.zIndex = 1;
    
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
                <div className="button-container" >
                    {(userInfo!==null && userInfo.USER_TYPE === 'customer') && <button className="btn-primary" onClick={()=>setShowTrips(true)}>My Trips</button>}
                    <button className="btn-primary" onClick={()=>{navigate('/destinations')}}>Destinations <IoGlobeSharp className="icon"/></button> 
                    <button className="btn-primary" onClick={()=>{navigate('/accommodations');}}>Accommodations<IoBedSharp className="icon" /></button>
                    <button className="btn-primary" onClick={()=>{navigate('/restaurants');}}>Restaurants<IoCafe className="icon"/></button>
                    <button className="btn-primary" onClick={()=>{navigate('/flights');}}> Flights<IoAirplaneSharp className="icon"/></button>
                    {/* <button className="btn-primary" onClick={()=>{navigate('/transports');}}>Transports</button> */}
                </div>
                {userInfo!==null ? 
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <IoMdNotifications className="notification-icon"/>
                        <img src="/wishlist.png" className="wishlist"/>
                        <h4 className="username">Hello <Link to='user'>{userInfo.USERNAME}</Link><VscAccount className="icon"/></h4>
                    </div> 
                    : 
                    <div>
                        <button className="custom-btn" onClick={()=>handleIsInLoginOrSignUpFromNavbar(true)}>Login</button>
                        <button className="custom-btn" onClick={()=>handleIsInLoginOrSignUpFromNavbar(false)}>Sign Up</button>
                    </div>}
            </nav>
            {isBottomStyles && <div style={{height: `${placeholderHeight}px`}}></div>}
        </>)
}

Header.propTypes = {
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
    setShowTrips: PropTypes.func
}

export default Header;