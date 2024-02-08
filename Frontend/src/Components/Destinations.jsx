import {useState } from "react";
import DestinationCard from "./DestinationCard";
import { MdLocationPin } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";
import "../Styles/search.css"
import "../Styles/card.css"

const Destinations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [destinations,setDestinations] = useState([]);

    const handleSearch = async (e) =>{
        setSearch(e.target.value);

        if(e.target.value.length===0)
        {
            setSuggestions(undefined);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/destination/search?keyword=${e.target.value}`,{
                method: "GET",
            });

            const result = await response.json();
            if(result.status)
            {
                setSuggestions(result.data);
            }
            else
            {
                setSuggestions(undefined);
            }
        }
    }

    const handleSubmit = async () =>{
        if(search.length===0)
        {
            setDestinations([]);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/destination/fetch?keyword=${search}`,{
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

    const setOnFocus = () =>{
        if(suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            suggestionsBlock.style.display = "flex";
        }

        const searchBackground = document.getElementById("dim-background");
        searchBackground.style.display = "block";
    }

    const setOnBlur = () =>{
        if(suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");

            setTimeout(()=>{suggestionsBlock.style.display = "none"}, 250);
        }
        
        const searchBackground = document.getElementById("dim-background");
        setTimeout(()=>{searchBackground.style.display = "none"},250);
    }

    const placeSelected = async (category,e) =>{
        console.log("Hello");
        if(category===1)
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/location/?name=${e.target.innerText}`,{
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
        else if(category===2)
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/district?name=${e.target.innerText}`,{
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
        else
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/division?name=${e.target.innerText}`,{
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
        setSuggestions(undefined);
        setSearch("");
    }

    return(
        <div className="homepage">
            <h1>Flutterfly Travels</h1>
            <span id="dim-background"></span>
            <div className="search-div-container" style={{position: "relative"}}>
                <div className="search-container">
                    <input type="text" onFocus={setOnFocus} onBlur={setOnBlur} className="search-input" value={search} placeholder="Search destination name or area..." onChange={handleSearch}/>
                    <button className="search-button custom-btn" onClick={handleSubmit}>
                        <img src="search-icon.png"/>
                    </button>
                </div>
                {suggestions!==undefined && 
                    <div id="suggestions-container">
                        {suggestions.destination.map((item,index)=>
                            <div key={index} className="suggested-items" id={"destination-suggestion"+index}>
                                <FaLocationArrow size={30} style={{paddingRight: "8px"}}/>
                                <div><h3>{item.NAME}</h3>
                                {item.LOCATION_NAME}, {item.DISTRICT_NAME}</div>
                            </div>
                        )}
                        {suggestions.location.subDistrict.map((item,index)=>
                            <div key={index} className="suggested-items" id={"location-suggestion"+index}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>{placeSelected(1,e)}}>{item.LOCATION_NAME}</h3>
                                {item.DISTRICT_NAME}, {item.DIVISION_NAME}</div>
                            </div>
                        )}
                        {suggestions.location.district.map((item,index)=>
                            <div key={index} className="suggested-items" id={"district-suggestion"+index}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>placeSelected(2,e)}>{item.DISTRICT_NAME}</h3>
                                {item.DIVISION_NAME} Division</div>
                            </div>
                        )}
                        {suggestions.location.division.map((item,index)=>
                            <div key={index} className="suggested-items" id={"division-suggestion"+index}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>placeSelected(3,e)}>{item.DIVISION_NAME}</h3>
                                Bangladesh</div>
                            </div>
                        )}
                    </div>
                }
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