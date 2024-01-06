import { useState } from 'react';
import {Routes, Route} from 'react-router-dom';
import './App.css';
import Button from "./Button.jsx";
import MyComponent from './MyComponent.jsx';
import NoMatch from './NoMatch.jsx';
import UserList from './UserList.jsx';
import UserDetails from './UserDetails.jsx';

function App() {
  const [info,setInfo] = useState([]);

  const handleFunction = (param)=>
  {
    setInfo(param);
  }

  return (
    <>
      <Button/>
      <Routes>
        <Route path='' element={<MyComponent setParentData={handleFunction}/>}>
          <Route path='user' element={<UserList data={info}/>}>
            {console.log(info[3])}
            <Route path=':userId' element={<UserDetails data={info}/>}/>
          </Route>
        </Route>
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App
