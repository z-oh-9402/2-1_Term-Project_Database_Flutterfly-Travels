import {useState } from "react";
import DestinationCard from "./DestinationCard";
import "../Styles/card.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "./SearchAndSuggestions";

const Destinations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [destinations,setDestinations] = useState([]);
    const navigate = useNavigate();

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

    const placeSelected = async (category,text) =>{
        if(category===1)
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/location/?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setDestinations(result);
        }
        else if(category===2)
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/district?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setDestinations(result);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/destination/fetch/division?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setDestinations(result);
        }
        setSuggestions(undefined);
        setSearch("");
    }

    const showDestination = async (e) => {
        navigate(`${e.target.innerText}`);
    }

    const data = {
        search: search,
        suggestions: suggestions,
        category: 'destination'
    }

    const functions = {
        placeSelected: placeSelected,
        handleSearch: handleSearch,
        handleSubmit: handleSubmit,
        showDestination: showDestination
    }

    return(
        <div className="homepage">
            <SearchAndSuggestions data={data} functions={functions}/>
            
            {destinations.length!==0 &&
                <div className='destination-search'>
                    <div className="filter"></div>
                    <div className='recommendation-container'>
                        <h1>Searched Destinations -</h1>
                        <div className='card-container'>
                            {destinations.map((destination,index)=>
                                <DestinationCard key={index} itemType='destination' item={destination} index={`${index}`}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>)
}

export default Destinations;