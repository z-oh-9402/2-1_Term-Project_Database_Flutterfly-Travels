import {useState} from "react";
import {useNavigate,Outlet} from "react-router-dom";
import PropTypes from 'prop-types';
import ColorPicker from './ColorPicker.jsx';

const MyComponent = (props)=>{
    const [id,setId] = useState("");
    const [minSalary,setMinSalary] = useState("");
    const [shipment,setShipment] = useState("");
    const [cpStatus,setCpStatus] = useState(false);
    const navigate = useNavigate();

    const handleChangeId = (e)=>{
        setId(e.target.value);
    }

    const handleChangeMinSalary = (e)=>{
        setMinSalary(e.target.value);
    }

    const handleShipmentChange = (e) =>{
        setShipment(e.target.value);
    }

    const handleCpStatusChange = () =>{
        setCpStatus(!cpStatus);
    }

    const handleSubmit = async ()=>{
        navigate(`/`);
        setId("");
        setMinSalary("");
        
        const response = await fetch(`http://localhost:3000/employee/id&minsalary/${id}/${minSalary}`,{
            method: "GET"
        });
    
        const result = await response.json();
        if(result.length!==0)
        {
            props.setParentData(result);
            navigate(`user`);
        }
    }

    return(
        <>
            <p><input onChange={handleChangeId} value={id} placeholder="ID"/></p>
            <p>{id}</p>
            <p><input onChange={handleChangeMinSalary} value={minSalary} placeholder="Minimum Salary"/></p>
            <p>{minSalary}</p>
            <p><button onClick={handleSubmit}>Submit</button></p>
            <Outlet/>
            <p><label><input type="radio" value="Pick up" checked={shipment === "Pick up"} onChange={handleShipmentChange}/>Pick up</label></p>
            <p><label><input type="radio" value="Delivery" checked={shipment === "Delivery"} onChange={handleShipmentChange}/>Delivery</label></p>
            <p>Shipment: {shipment}</p>
            <p><button onClick={handleCpStatusChange}>{cpStatus ? "Hide Color Picker" : "Show Color Picker"}</button></p>
            {cpStatus && <ColorPicker/>}
        </>
    );
}

MyComponent.propTypes = {
    setParentData: PropTypes.func
}

export default MyComponent;