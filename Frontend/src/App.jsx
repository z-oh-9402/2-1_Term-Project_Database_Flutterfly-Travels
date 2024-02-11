import {Routes, Route, Outlet} from 'react-router-dom';
import Header from './Components/Header.jsx';
import Login from './Components/Login.jsx';
import SignUp from './Components/SignUp.jsx';
import ProfileHomePage from './Components/ProfileHomePage.jsx';
import NoMatch from './Components/NoMatch.jsx';
import {useState} from 'react';
import Destinations from './Components/Destinations.jsx';
import Hotels from './Components/Hotels.jsx';
import Restaurants from './Components/Restaurants.jsx';
import DestinationProfile from './Components/DestinationProfile.jsx';
import Title from './Components/Title.jsx';
import Homepage from './Components/Homepage.jsx';

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
        <Route path='hotels' element={<Hotels/>}/>
        <Route path='restaurants' element={<Restaurants/>}/>
        <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo}/>}/>
        <Route path='*' element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;