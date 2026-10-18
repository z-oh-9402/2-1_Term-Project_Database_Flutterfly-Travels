import { useRef, useState } from 'react';
import PropTypes from "prop-types"
import UserInfoContext from './UserInfoContext';
import { apiFetch, getToken, setToken } from '../api';

const UserInfoContextProvider = ({ children }) => {
  // A saved user without a login token (e.g. from before JWT was added, when it also held the plaintext password) counts as logged out
  if (!getToken()) {
    localStorage.removeItem('userInfo');
  }
  const storedInfo = localStorage.getItem('userInfo');
  const [userInfo, setUserInfo] = useState(storedInfo===null ? null : JSON.parse(storedInfo));
  // const [userInfo, setUserInfo] = useState(null);
  const [showDetailedNotification, setShowDetailedNotification] = useState(false);
  const userInfoRef = useRef(userInfo);
  userInfoRef.current = userInfo;

  const setInfo = (info) => {
    setUserInfo(info);
    userInfoRef.current = info;

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

  // Reloads the logged-in customer's or agent's trips (with their bookings) after something changed them
  const reloadTrips = async () => {
    const user = userInfoRef.current;
    if (!user || (user.user_type !== 'customer' && user.user_type !== 'agent')) {
      return;
    }

    const url = user.user_type === 'customer' ?
      `http://localhost:3000/trip/for-customer?customerId=${user.user_id}` :
      `http://localhost:3000/trip/for-agent?agentId=${user.user_id}`;
    const response = await apiFetch(url, { method: "GET" });
    if (!response.ok) {
      return;
    }
    const trips = await response.json();

    // a new object, so everything showing trips redraws (unless the user logged out meanwhile)
    if (userInfoRef.current && userInfoRef.current.user_id === user.user_id) {
      setInfo({ ...userInfoRef.current, trips });
    }
  };

  return (
    <UserInfoContext.Provider value={{userInfo, setInfo, reloadTrips, showDetailedNotification, setShowDetailedNotification}}>
      {children}
    </UserInfoContext.Provider>
  );
};

UserInfoContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default UserInfoContextProvider;
