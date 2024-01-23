import {useState } from 'react';
import PropTypes from "prop-types"
import UserInfoContext from './UserInfoContext';

const UserInfoContextProvider = ({ children }) => {
  const storedInfo = localStorage.getItem('userInfo');
  const [userInfo, setUserInfo] = useState(storedInfo===null ? null : JSON.parse(storedInfo));

  const setInfo = (info) => {
    setUserInfo(info);

    if(info)
    {
      localStorage.setItem('userInfo',JSON.stringify(info))
    }
    else
    {
      localStorage.removeItem('userInfo');
    }
  };

  return (
    <UserInfoContext.Provider value={{ userInfo, setInfo}}>
      {children}
    </UserInfoContext.Provider>
  );
};

UserInfoContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default UserInfoContextProvider;
