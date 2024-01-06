import {useState} from "react";
import { useNavigate } from "react-router-dom";

const ColorPicker = ()=>
{
    const navigate = useNavigate();
    const [color,setColor] = useState("#FFFFFF");

    const handleColorChange = (e)=>
    {
        setColor(e.target.value);
    }

    return(
        <>
            <div className="color-pickercontainer">
                <h1>Color Picker</h1>
                <div className="color-display" style={{backgroundColor: color}}>
                    <p>Selected Color: {color}</p>
                </div>
                <label>Select a Color: </label>
                <input type="color" value={color} onChange={handleColorChange}/>
            </div>
            <button onClick={()=>navigate("/")}>Go Back</button>
        </>
    );
};

export default ColorPicker;