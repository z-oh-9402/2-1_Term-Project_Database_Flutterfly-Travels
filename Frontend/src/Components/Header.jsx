import "../Styles/button.css"
import "../Styles/navbar.css"

import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";

import { IoMdNotifications } from "react-icons/io";
import { IoAirplaneSharp, IoGlobeSharp, IoBedSharp, IoRestaurant } from "react-icons/io5";
import { BsChatDots, BsPeopleFill } from "react-icons/bs";
import { FaRegHeart, FaTripadvisor } from "react-icons/fa";

import Notification from "./Notification";

const Header = (props)=>{
    const {handleIsInLoginOrSignUpFromNavbar, setShowTrips, setShowWishlist, notifications} = props;
    const {userInfo, showDetailedNotification, setShowDetailedNotification} = useContext(UserInfoContext);
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
            <nav className={`main-navbar${isBottomStyles ? ' bottom-styles' : ''}`} id='main-nav'>
                <div className="main-section"><Link to='/' className="basicInfo"><img className="title-img" src='/title.png'/></Link></div>
                <div className="button-container" >
                    {(userInfo!==null && userInfo.user_type === 'customer') && <button className="btn-primary nav-button" onClick={()=>setShowTrips(true)}>My Trips<FaTripadvisor className="icon"/></button>}
                    <button className="btn-primary nav-button" onClick={()=>{navigate('/destinations')}}>Destinations<IoGlobeSharp className="icon"/></button> 
                    <button className="btn-primary nav-button" onClick={()=>{navigate('/accommodations');}}>Accommodations<IoBedSharp className="icon"/></button>
                    <button className="btn-primary nav-button" onClick={()=>{navigate('/restaurants');}}>Restaurants<IoRestaurant className="icon"/></button>
                    <button className="btn-primary nav-button" onClick={()=>{navigate('/flights');}}> Flights<IoAirplaneSharp className="icon"/></button>
                    {(userInfo!==null && userInfo.user_type !== 'admin') && <button className="btn-primary nav-button">People<BsPeopleFill className="icon"/></button>}
                </div>
                {userInfo!==null ? 
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <IoMdNotifications className="header-icons notification-icon" onClick={()=>setShowDetailedNotification(!showDetailedNotification)}/>
                        {(userInfo.user_type==='customer' || userInfo.user_type==='agent') &&
                            <>
                                <BsChatDots className="header-icons chat-icon" onClick={()=>navigate('/chats')}/>
                                {userInfo.user_type==='customer' && <FaRegHeart className="header-icons wishlist" onClick={()=>setShowWishlist(true)}/>}
                            </>}
                        <Link to='user'>
                                <div className="profile-pic">
                                    <img src={userInfo.photo.length ? 'http://localhost:3000/uploads/'+userInfo.photo : "default_profile_pic.jpeg"}/>
                                </div>
                        </Link>
                        {/* <Notification notifications={notifications}/> */}
                    </div> 
                    : 
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <button className="custom-btn" onClick={()=>handleIsInLoginOrSignUpFromNavbar(true)}>Login</button>
                        <button className="custom-btn" onClick={()=>handleIsInLoginOrSignUpFromNavbar(false)}>Sign Up</button>
                    </div>}
            </nav>
            {isBottomStyles && <div style={{height: `${placeholderHeight}px`}}></div>}
        </>)
}

Header.propTypes = {
    handleIsInLoginOrSignUpFromNavbar: PropTypes.func,
    setShowTrips: PropTypes.func,
    setShowWishlist: PropTypes.func,
    notifications: PropTypes.array
}

export default Header;