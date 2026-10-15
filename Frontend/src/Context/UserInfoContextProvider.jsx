import {useState } from 'react';
import PropTypes from "prop-types"
import UserInfoContext from './UserInfoContext';
import { getToken, setToken } from '../api';

const UserInfoContextProvider = ({ children }) => {
  // A saved user without a login token (e.g. from before JWT was added, when it also held the plaintext password) counts as logged out
  if (!getToken()) {
    localStorage.removeItem('userInfo');
  }
  const storedInfo = localStorage.getItem('userInfo');
  const [userInfo, setUserInfo] = useState(storedInfo===null ? null : JSON.parse(storedInfo));
  // const [userInfo, setUserInfo] = useState(null);
  const [showDetailedNotification, setShowDetailedNotification] = useState(false);

  const setInfo = (info) => {
    setUserInfo(info);

    if(info)
    {
      localStorage.setItem('userInfo',JSON.stringify(info))
    }
    else
    {
      setShowDetailedNotification(false);
      localStorage.removeItem('userInfo');
      setToken(null);
    }
  };

  return (
    <UserInfoContext.Provider value={{userInfo, setInfo, showDetailedNotification, setShowDetailedNotification}}>
      {children}
    </UserInfoContext.Provider>
  );
};

UserInfoContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default UserInfoContextProvider;
