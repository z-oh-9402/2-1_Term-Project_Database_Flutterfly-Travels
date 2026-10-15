import {useState } from 'react';
import PropTypes from "prop-types"
import UserInfoContext from './UserInfoContext';

const UserInfoContextProvider = ({ children }) => {
  const storedInfo = localStorage.getItem('userInfo');
  const [userInfo, setUserInfo] = useState(storedInfo===null ? null : JSON.parse(storedInfo));
  // const [userInfo, setUserInfo] = useState(null);
  const [showDetailedNotification, setShowDetailedNotification] = useState(false);

  const setInfo = (info) => {
    setUserInfo(info);

    if(info)
    {
      setShowDetailedNotification(true);
      localStorage.setItem('userInfo',JSON.stringify(info))
      // localStorage.setItem('notification',JSON.stringify(notif))
    }
    else
    {
      setShowDetailedNotification(false);
      localStorage.removeItem('userInfo');
      // localStorage.removeItem('notification');
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
