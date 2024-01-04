 import {useState} from "react";
 
 const Button = ()=>{
    const [toggle, setToggle] = useState(true);

    const handleClick = ()=>{
        setToggle(!toggle)
    }

    return(<button onClick={handleClick}>{toggle ? "Click Me 😊" : "Stop" }</button>)
 }

 export default Button;