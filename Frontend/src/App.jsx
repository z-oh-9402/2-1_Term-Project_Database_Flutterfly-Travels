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
import Notification from './Components/Notification.jsx';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);
  const {userInfo, setInfo, setShowDetailedNotification} = useContext(UserInfoContext);
  const [showTrips, setShowTrips] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [instantNotifications, setInstantNotifications] = useState([]);

  useEffect(() => {
    const fetchNotification = async () => {
      if(userInfo!==null)
      {
        const response = await fetch(`http://localhost:3000/user/fetch-notification/${userInfo.USER_ID}`, {
          method: "GET"
        });

        const result = await response.json();
        
        if(result.length>0)
        {
          setNotifications(prevNotifications => [...prevNotifications, ...result]);
          setShowDetailedNotification(true);
        }
        setInstantNotifications(result);
      }
    };

    const intervalId = setInterval(() => {
      fetchNotification();
    }, 800);

    return () => clearInterval(intervalId);
  }, [userInfo, notifications]);

  useEffect(() => {
    const updateTripStatus = async () => {
      const response = await fetch('http://localhost:3000/trip/update-trip-status', {
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
      
      if(userInfo && userInfo.USER_TYPE!=='admin')
      {
        let result;
        if(userInfo.USER_TYPE === 'customer')
        {
            const response = await fetch(`http://localhost:3000/trip/for-customer?customerId=${userInfo.USER_ID}`, {
                method: "GET"
            });

            result = await response.json();
        }
        if(userInfo.USER_TYPE === 'agent')
        {
            const response = await fetch(`http://localhost:3000/trip/for-agent?agentId=${userInfo.USER_ID}`, {
                method: "GET"
            });

            result = await response.json();
        }
        userInfo.TRIPS = result;
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

  const handleUserInfo = (isLoggingOut)=>
  {
    setIsLoginOrSignUpPageLoaded(isLoggingOut);
    setIsInLoginPage(isLoggingOut);
  }

  return (
    <>
      {isLoginOrSignUpPageLoaded && 
        (isInLoginPage ? <Login goToHome={goToHome} setUserInfo={handleUserInfo} goToSignUp={handleChangeBetweenLoginAndSignUp} setNotifications={setNotifications}/> 
                       : <SignUp goToHome={goToHome} setUserInfo={handleUserInfo} goToLogin={handleChangeBetweenLoginAndSignUp} setNotifications={setNotifications}/>)}
      {userInfo!==null && showTrips && <Trips setShowTrips={setShowTrips}/>}
      {userInfo!==null && <Notification notifications={notifications}  instantNotifications={instantNotifications}/>}
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar} setShowTrips={setShowTrips}/>
      <br/><br/><br/><br/><br/><br/>
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
        {userInfo!==null && <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo}/>}/>}
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;