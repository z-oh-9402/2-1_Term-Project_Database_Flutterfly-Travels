import {Routes, Route} from 'react-router-dom';
import './App.css';
import Button from "./Button";
import ColorPicker from './ColorPicker.jsx';
import MyComponent from './MyComponent.jsx';
import NoMatch from './NoMatch.jsx';

function App() {
  return (
    <>
      <Button/>
      <Routes>
        <Route path='/' element={<MyComponent/>}/>
        <Route path='/colorpicker' element={<ColorPicker/>}/>
        <Route path="*" element={<NoMatch/>}/>
      </Routes>
    </>
  )
}

export default App
