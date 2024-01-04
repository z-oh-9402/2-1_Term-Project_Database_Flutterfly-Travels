import {useState} from "react";

const MyComponent = ()=>{
    const [name,setName] = useState("");
    const [shipment,setShipment] = useState("");
    const [info,setInfo] = useState([]);

    const handleChange = (e)=>{
        setName(e.target.value);
    }

    const handleShipmentChange = (e) =>{
        setShipment(e.target.value);
    }

    const handleSubmit = async ()=>{
        let id = name;
        setName("");
        setInfo([]);
        const response = await fetch(`http://localhost:3000/employee/${id}`,{
            method: "GET"
        });

        const result = await response.json();
        setInfo(result);
    }

    return(
        <>
            <p><input onChange={handleChange} value={name} placeholder="Guest"/></p>
            <p>{name}</p>
            <p><button onClick={handleSubmit}>Submit</button></p>
            <ul>
                {info.map((data,index)=>
                        <li key={index}>{data.FIRST_NAME} {data.LAST_NAME} - {data.SALARY}</li>
                    )}
            </ul>
            <p><label><input type="radio" value="Pick up" checked={shipment === "Pick up"} onChange={handleShipmentChange}/>Pick up</label></p>
            <p><label><input type="radio" value="Delivery" checked={shipment === "Delivery"} onChange={handleShipmentChange}/>Delivery</label></p>
            <p>Shipment: {shipment}</p>
        </>
    );
}

export default MyComponent;