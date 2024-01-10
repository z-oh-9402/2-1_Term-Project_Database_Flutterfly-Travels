import './App.css';
import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import NoMatch from './Components/NoMatch.jsx';
import ProfileHomePage from './Components/ProfileHomePage.jsx';
import Home from './Components/Home.jsx';
import TitleAndHome from './Components/TitleAndHome.jsx';
import Login from './Components/Login.jsx';
import SignUp from './Components/SignUp.jsx';

function App() {
  const [userInfo,setUserInfo] = useState(undefined);
  const [isLoginOrSignUpPageLoaded, setIsLoginOrSignUpPageLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInLoginPage, setIsInLoginPage] = useState(true);

  const handleIsInLoginOrSignUpFromNavbar = (isInLogin) => {
    setIsLoginOrSignUpPageLoaded(true);
    setIsInLoginPage(isInLogin);
  }

  const handleChangeBetweenLoginAndAignUp = () =>
  {
    setIsInLoginPage(!isInLoginPage);
  }

  const handleBackFromLoginOrSignUp = () => {
    setIsLoginOrSignUpPageLoaded(false);
  }

  const handleUserInfo = (Info,isLoggingOut)=>
  {
    setIsLoginOrSignUpPageLoaded(isLoggingOut);
    if(isLoggingOut) isInLoginPage(isLoggingOut);
    setIsLoggedIn(!isLoggedIn);
    setUserInfo(Info);
  }

  return (
    <>
      <Routes>
        <Route path='/' element={isLoginOrSignUpPageLoaded ? (isInLoginPage ? <Login setUserInfo={handleUserInfo} goToHome={handleBackFromLoginOrSignUp} goToSignUp={handleChangeBetweenLoginAndAignUp}/> 
                                                                            : <SignUp setUserInfo={handleUserInfo} goToHome={handleBackFromLoginOrSignUp} goToLogin={handleChangeBetweenLoginAndAignUp}/>)
                                                          : <Home handleIsInLoginOrSignUpFromNavbar={handleIsInLoginOrSignUpFromNavbar} isLoggedIn={isLoggedIn}/>}>
          {!isLoginOrSignUpPageLoaded && <Route index element={<TitleAndHome/>}/>}
          <Route path='user' element={<ProfileHomePage setLogOut={handleUserInfo} loginInfo={userInfo}/>}/>
        </Route>
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App;