import {useState} from "react";
import {useNavigate} from "react-router-dom";

const MyComponent = ()=>{
    const [id,setId] = useState("");
    const [minSalary,setMinSalary] = useState("");
    const [shipment,setShipment] = useState("");
    const [info,setInfo] = useState([]);
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

    const handleSubmit = async ()=>{
        setId("");
        setMinSalary("");
        setInfo([]);
        const response = await fetch(`http://localhost:3000/employee/id&minsalary/${id}/${minSalary}`,{
            method: "GET"
        });

        const result = await response.json();
        setInfo(result);
    }

    return(
        <>
            <p><input onChange={handleChangeId} value={id} placeholder="ID"/></p>
            <p>{id}</p>
            <p><input onChange={handleChangeMinSalary} value={minSalary} placeholder="Minimum Salary"/></p>
            <p>{minSalary}</p>
            <p><button onClick={handleSubmit}>Submit</button></p>
            <ul>
                {info.map((data,index)=>
                        <li key={index}>{data.FIRST_NAME} {data.LAST_NAME} - {data.SALARY}</li>
                    )}
            </ul>
            <p><label><input type="radio" value="Pick up" checked={shipment === "Pick up"} onChange={handleShipmentChange}/>Pick up</label></p>
            <p><label><input type="radio" value="Delivery" checked={shipment === "Delivery"} onChange={handleShipmentChange}/>Delivery</label></p>
            <p>Shipment: {shipment}</p>
            <p><button onClick={()=>navigate("/colorpicker")}>See Color Picker</button></p>
        </>
    );
}

export default MyComponent;