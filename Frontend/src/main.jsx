import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import UserInfoContextProvider from './Context/UserInfoContextProvider.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserInfoContextProvider>
        <App/>
      </UserInfoContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
