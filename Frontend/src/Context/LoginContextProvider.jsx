import {useState } from 'react';
import PropTypes from "prop-types"
import LoginContext from './LoginContext';

const LoginContextProvider = ({ children }) => {
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
  const [isLoggedIn, setIsLoggedIn] = useState(storedIsLoggedIn==='true');

  const setIsLoggingIn = (isLoggingIn) => {
    setIsLoggedIn(isLoggingIn);

    if(isLoggingIn)
    {
      localStorage.setItem('isLoggedIn','true')
    }
    else
    {
      localStorage.removeItem('isLoggedIn');
    }
  };

  return (
    <LoginContext.Provider value={{isLoggedIn, setIsLoggingIn}}>
      {children}
    </LoginContext.Provider>
  );
};

LoginContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default LoginContextProvider;
