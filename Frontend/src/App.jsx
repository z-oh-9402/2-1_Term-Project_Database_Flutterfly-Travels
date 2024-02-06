import './App.css';
import {Routes, Route} from 'react-router-dom';
import Header from './Components/Header.jsx';
import Login from './Components/Login.jsx';
import SignUp from './Components/SignUp.jsx';
import TitleAndHome from './Components/TitleAndHome.jsx';
import ProfileHomePage from './Components/ProfileHomePage.jsx';
import NoMatch from './Components/NoMatch.jsx';
import { useState } from 'react';
import Destinations from './Components/Destinations.jsx';
import Hotels from './Components/Hotels.jsx';
import Restaurants from './Components/Restaurants.jsx';

function App() {
  const [isLoginOrSignUpPageLoaded,setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);

  const handleIsInLoginOrSignUpFromNavbar = (isInLogin) =>{
    setIsLoginOrSignUpPageLoaded(true);
    setIsInLoginPage(isInLogin)
  }

  const handleChangeBetweenLoginAndAignUp = () =>
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
      {isLoginOrSignUpPageLoaded && (isInLoginPage ? <Login goToHome={goToHome} setUserInfo={handleUserInfo} goToSignUp={handleChangeBetweenLoginAndAignUp}/> : <SignUp goToHome={goToHome} setUserInfo={handleUserInfo} goToLogin={handleChangeBetweenLoginAndAignUp}/>)}
      <Header handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar}/>
      <Routes>
        <Route index element={<TitleAndHome/>}/>
        <Route path='destinations' element={<Destinations/>}/>
        <Route path='hotels' element={<Hotels/>}/>
        <Route path='restaurants' element={<Restaurants/>}/>
        <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo}/>}/>
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;