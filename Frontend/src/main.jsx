import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import LoginContextProvider from './Context/LoginContextProvider.jsx'
import UserInfoContextProvider from './Context/UserInfoContextProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LoginContextProvider>
        <UserInfoContextProvider>
          <App/>
        </UserInfoContextProvider>
      </LoginContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
