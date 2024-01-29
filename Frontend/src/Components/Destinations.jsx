import {useState } from "react";
import DestinationCard from "./DestinationCard";
import "../Styles/search.css"
import "../Styles/card.css"

const Destinations = ()=>{
    const [search,setSearch] = useState("");
    const [destinations,setDestinations] = useState([]);

    const handleSearch = async (e) =>{
        setSearch(e.target.value);
        if(e.target.value.length===0)
        {
            setDestinations([]);
        }
        else
        {
            let encodedSearch = encodeURIComponent(e.target.value);
            const response = await fetch(`http://localhost:3000/destination/search?keyword=${encodedSearch}`,{
                method: "GET",
            });

            const result = await response.json();
            if(result.status)
            {
                setDestinations(result.data);
            }
            else
            {
                setDestinations([]);
            }
        }
    }

    const handleSubmit = async () =>{
        
    }

    return(
        <div className="homepage">
            <h1>Flutterfly Travels</h1>
            <div>
                <div className="search-container">
                    <input type="text" className="search-input" value={search} placeholder="Search destination name or area..." onChange={handleSearch}/>
                    <button className="search-button custom-btn" onClick={handleSubmit}>&#128269;</button>
                </div>
            </div>
            {destinations.length!==0 && <div className='recommendation-container'>
                <h1>Searched Destinations -</h1>
                <div className='card-container'>
                    {destinations.map((destination,index)=>
                        <DestinationCard key={index} destination={destination} index={`${index}`}/>
                    )}
                </div>
            </div>}
        </div>)
}

export default Destinations;