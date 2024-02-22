import {Routes, Route, Outlet} from 'react-router-dom';
import Header from './Components/Header.jsx';
import Login from './Pages/Login.jsx';
import SignUp from './Pages/SignUp.jsx';
import ProfileHomePage from './Pages/ProfileHomePage.jsx';
import NoMatch from './Pages/NoMatch.jsx';
import {useState} from 'react';
import Destinations from './Pages/Destinations.jsx';
import Restaurants from './Pages/Restaurants.jsx';
import DestinationProfile from './Pages/DestinationProfile.jsx';
import Title from './Components/Title.jsx';
import Homepage from './Pages/Homepage.jsx';
import Accommodations from './Pages/Accommodations.jsx';
import AccommodationProfile from './Pages/AccommodationProfile.jsx';
import Transports from './Pages/Transports.jsx';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);

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
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar}/>
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
        <Route path='restaurants' element={<Restaurants/>}/>
        <Route path='transports' element={<Transports/>}/>
        <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo}/>}/>
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;