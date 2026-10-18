import {Routes, Route, Outlet} from 'react-router-dom';
import {useCallback, useContext, useEffect, useRef, useState} from 'react';
import UserInfoContext from './Context/UserInfoContext.jsx';

import Header from './Components/Header.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import ProfileHomePage from './Pages/ProfileHomePage.jsx';
import NoMatch from './Pages/NoMatch.jsx';
import Destinations from './Pages/Destinations.jsx';
import Restaurants from './Pages/Restaurants.jsx';
import DestinationProfile from './Pages/DestinationProfile.jsx';
import Homepage from './Pages/Homepage.jsx';
import Accommodations from './Pages/Accommodations.jsx';
import AccommodationProfile from './Pages/AccommodationProfile.jsx';
import Flights from './Pages/Flights.jsx';
import RestaurantProfile from './Pages/RestaurantProfile.jsx';
import Trips from './Pages/Trips.jsx';
import Wishlist from './Components/Wishlist.jsx';
import { apiFetch, getToken } from './api';
import { io } from 'socket.io-client';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);
  const {userInfo, setInfo} = useContext(UserInfoContext);
  const [showTrips, setShowTrips] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const loggedInUserId = userInfo ? userInfo.user_id : null;

  // The account saved in the browser at login goes stale (an agent approved by an admin, trips whose status changed),
  // so its details and trips are reloaded when the app opens and whenever a notification arrives
  const userInfoRef = useRef(userInfo);
  userInfoRef.current = userInfo;
  const refreshAccount = async () => {
    const user = userInfoRef.current;
    if(!user || user.user_type === 'admin')
    {
      return;
    }

    const fresh = {};
    if(user.user_type === 'agent')
    {
      const response = await apiFetch(`http://localhost:3000/agent/${user.user_id}`, {
        method: "GET"
      });
      if(response.ok)
      {
        const agent = await response.json();
        Object.assign(fresh, {
          experience_years: agent.experience_years,
          fee: agent.fee,
          acc_status: agent.acc_status,
          rating: agent.rating,
          rating_count: agent.rating_count
        });
      }
    }

    // agents only have trips once an admin has approved them
    if(user.user_type === 'customer' || (fresh.acc_status ?? user.acc_status) === 'OK')
    {
      const url = user.user_type === 'customer' ?
        `http://localhost:3000/trip/for-customer?customerId=${user.user_id}` :
        `http://localhost:3000/trip/for-agent?agentId=${user.user_id}`;
      const response = await apiFetch(url, {
        method: "GET"
      });
      if(response.ok)
      {
        fresh.trips = await response.json();
      }
    }

    // a new object, so everything showing the account redraws (unless the user logged out meanwhile)
    if(userInfoRef.current && userInfoRef.current.user_id === user.user_id)
    {
      setInfo({...userInfoRef.current, ...fresh});
    }
  };
  const refreshAccountRef = useRef(refreshAccount);
  refreshAccountRef.current = refreshAccount;

  // Keeps the logged-in user's notifications up to date. The server pushes each new one over socket.io
  // the moment the database creates it (see Backend/realtime.js), so there's no polling.
  useEffect(() => {
    if(loggedInUserId===null)
    {
      setNotifications([]);
      return;
    }

    let isActive = true;
    const fetchNotifications = async () => {
      const response = await apiFetch(`http://localhost:3000/user/notifications`, {
        method: "GET"
      });

      if(isActive && response.ok)
      {
        setNotifications(await response.json());
      }
    };

    const socket = io('http://localhost:3000', { auth: { token: getToken() } });

    // On every (re)connect load the full list, which also picks up anything created while disconnected
    socket.on('connect', fetchNotifications);
    socket.on('notifications-resync', fetchNotifications);
    socket.on('notification', (notification) => {
      setNotifications(prevNotifications => [
        notification,
        ...prevNotifications.filter(previous => previous.notification_id !== notification.notification_id)
      ].slice(0, 30));
      // whatever the notification is about (an approval, a trip update) may have changed the account
      refreshAccountRef.current();
    });
    // Marked as seen in another tab
    socket.on('notifications-seen', () => {
      setNotifications(prevNotifications => prevNotifications.map(notification => ({...notification, notification_status: 'SHOWED'})));
    });
    // The server rejected the token (e.g. it expired): this request gets a 401, and apiFetch logs the user out
    socket.on('connect_error', (error) => {
      if(error.message==='Unauthorized')
      {
        fetchNotifications();
      }
    });

    return () => {
      isActive = false;
      socket.disconnect();
    };
  }, [loggedInUserId]);

  // Called when the user opens the notification list
  const markNotificationsSeen = useCallback(async () => {
    await apiFetch(`http://localhost:3000/user/notifications/seen`, {
      method: "PUT"
    });

    setNotifications(prevNotifications => prevNotifications.map(notification => ({...notification, notification_status: 'SHOWED'})));
  }, []);

  useEffect(() => {
    const updateTripStatus = async () => {
      // Marking finished trips as COMPLETED needs a logged-in user
      if(!userInfoRef.current)
      {
        return;
      }

      const response = await apiFetch('http://localhost:3000/trip/update-trip-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          {
            tripStatus: "COMPLETED",
            tripId: 0
          })
      });

      await response.json();

      await refreshAccountRef.current();
    }

    updateTripStatus();
  }, []);

  const handleIsInLoginOrSignUpFromNavbar = (isInLogin) =>{
    setIsLoginOrSignUpPageLoaded(true);
    setIsInLoginPage(isInLogin)
  }

  const handleChangeBetweenLoginAndSignUp = () =>
  {
    setIsInLoginPage(!isInLoginPage);
  }

  const goToHome = () =>
  {
    setIsLoginOrSignUpPageLoaded(false);
  }

  const handleLogOut = (isLoggingOut)=>
  {
    setIsLoginOrSignUpPageLoaded(isLoggingOut);
    setIsInLoginPage(isLoggingOut);
  }

  return (
    <>
      {isLoginOrSignUpPageLoaded && 
        (isInLoginPage ? <Login goToHome={goToHome} setUserInfo={handleLogOut} goToSignUp={handleChangeBetweenLoginAndSignUp} setNotifications={setNotifications}/> 
                       : <SignUp goToHome={goToHome} setUserInfo={handleLogOut} goToLogin={handleChangeBetweenLoginAndSignUp} setNotifications={setNotifications}/>)}
      {userInfo!==null && showTrips && <Trips setShowTrips={setShowTrips}/>}
      {userInfo!==null && showWishlist && <Wishlist setShowWishlist={setShowWishlist} isWishlist={true}/>}
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar} setShowTrips={setShowTrips} setShowWishlist={setShowWishlist} notifications={notifications} onNotificationsSeen={markNotificationsSeen}/>

      <br/><br/>

      <Routes>
        <Route path='' element={<Homepage/>}/>
        <Route path='destinations' element={<><Outlet/></>}>
          <Route index element={<Destinations/>}/>
          <Route path=':name' element={<DestinationProfile/>}/> 
        </Route>
        <Route path='accommodations' element={<><Outlet/></>}>
          <Route index element={<Accommodations/>}/>
          <Route path=':name' element={<AccommodationProfile/>}/> 
        </Route>
        <Route path='restaurants' element={<><Outlet/></>}>
          <Route index element={<Restaurants/>}/>
          <Route path=':name' element={<RestaurantProfile/>}/> 
        </Route>
        <Route path='flights' element={<Flights/>}/>
        {userInfo!==null && <Route path='user' element={<ProfileHomePage setLogOut={handleLogOut}/>} />}
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;