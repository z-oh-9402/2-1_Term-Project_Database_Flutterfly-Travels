import "../Styles/button.css"
import "../Styles/navbar.css"

import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";

import { IoMdNotifications } from "react-icons/io";
import { IoAirplaneSharp, IoGlobeSharp, IoBedSharp, IoRestaurant } from "react-icons/io5";
import { BsChatDots, BsPeopleFill } from "react-icons/bs";
import { FaRegHeart, FaTripadvisor } from "react-icons/fa";

import Notification from "./Notification";

const Header = (props)=>{
    const {handleIsInLoginOrSignUpFromNavbar, setShowTrips, setShowWishlist, notifications, onNotificationsSeen} = props;
    const {userInfo, showDetailedNotification, setShowDetailedNotification} = useContext(UserInfoContext);
    const unreadCount = notifications.filter(notification => notification.notification_status === 'NOT SHOWED').length;
    const navigate = useNavigate();
    const {pathname} = useLocation();
    // a section stays highlighted on its own detail pages too, e.g. /destinations/Sylhet
    const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);
    const sectionButton = (path, label, Icon) => (
        <button className={`btn-primary nav-button${isActive(path) ? ' active' : ''}`}
                aria-current={isActive(path) ? 'page' : undefined}
                onClick={()=>navigate(path)}>{label}<Icon className="icon"/></button>
    );
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
                    {sectionButton('/destinations', 'Destinations', IoGlobeSharp)}
                    {sectionButton('/accommodations', 'Accommodations', IoBedSharp)}
                    {sectionButton('/restaurants', 'Restaurants', IoRestaurant)}
                    {sectionButton('/flights', 'Flights', IoAirplaneSharp)}
                    {(userInfo!==null && userInfo.user_type !== 'admin') && <button className="btn-primary nav-button">People<BsPeopleFill className="icon"/></button>}
                </div>
                {userInfo!==null ? 
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className="notification-bell" onClick={()=>setShowDetailedNotification(!showDetailedNotification)}>
                            <IoMdNotifications className="header-icons notification-icon"/>
                            {unreadCount!==0 && <span className="notification-badge">{unreadCount}</span>}
                        </div>
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
                        <Notification notifications={notifications} onSeen={onNotificationsSeen}/>
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
    notifications: PropTypes.array,
    onNotificationsSeen: PropTypes.func
}

export default Header;