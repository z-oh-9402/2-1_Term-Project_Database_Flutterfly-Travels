import {Routes, Route, Outlet} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
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
import { apiFetch } from './api';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);
  const {userInfo, setInfo, setShowDetailedNotification} = useContext(UserInfoContext);
  const [showTrips, setShowTrips] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [instantNotifications, setInstantNotifications] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  // useEffect(() => {
  //   const fetchNotification = async () => {
  //     if(userInfo!==null)
  //     {
  //       const response = await apiFetch(`http://localhost:3000/user/fetch-notification/${userInfo.user_id}`, {
  //         method: "GET"
  //       });

  //       const result = await response.json();
        
  //       if(result.length>0)
  //       {
  //         setNotifications(prevNotifications => [...prevNotifications, ...result]);
  //         setShowDetailedNotification(true);
  //       }
  //       setInstantNotifications(result);
  //     }
  //   };

  //   const intervalId = setInterval(() => {
  //     fetchNotification();
  //   }, 1500);

  //   return () => clearInterval(intervalId);
  // }, [userInfo, notifications]);

  useEffect(() => {
    const updateTripStatus = async () => {
      // Marking finished trips as COMPLETED needs a logged-in user
      if(!userInfo)
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
      
      if(userInfo && userInfo.user_type!=='admin')
      {
        let result;
        if(userInfo.user_type === 'customer')
        {
            const response = await apiFetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.user_id}`, {
                method: "GET"
            });

            result = await response.json();
        }
        if(userInfo.user_type === 'agent')
        {
            const response = await apiFetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.user_id}`, {
                method: "GET"
            });

            result = await response.json();
        }
        userInfo.trips = result;
        setInfo(userInfo);
      }
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
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar} setShowTrips={setShowTrips} setShowWishlist={setShowWishlist} notifications={instantNotifications}/>

      <br/><br/><br/>

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