import {Routes, Route, Outlet} from 'react-router-dom';
import {useContext, useState} from 'react';
import UserInfoContext from './Context/UserInfoContext.jsx';

import Header from './Components/Header.jsx';
import Title from './Components/Title.jsx';

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
import Transports from './Pages/Transports.jsx';
import Flights from './Pages/Flights.jsx';
import RestaurantProfile from './Pages/RestaurantProfile.jsx';
import Trips from './Pages/Trips.jsx';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);
  const {userInfo} = useContext(UserInfoContext);
  const [showTrips, setShowTrips] = useState(false);

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
        (isInLoginPage ? <Login goToHome={goToHome} setUserInfo={handleUserInfo} goToSignUp={handleChangeBetweenLoginAndSignUp}/> 
                       : <SignUp goToHome={goToHome} setUserInfo={handleUserInfo} goToLogin={handleChangeBetweenLoginAndSignUp}/>)}
      {userInfo!==null && userInfo.USER_TYPE==='customer' && showTrips && <Trips setShowTrips={setShowTrips}/>}
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar} setShowTrips={setShowTrips}/>
      <Title/>
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
        <Route path='transports' element={<Transports/>}/>
        {userInfo!==null && <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo}/>}/>}
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;