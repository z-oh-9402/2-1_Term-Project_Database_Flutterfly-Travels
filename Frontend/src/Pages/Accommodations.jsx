import {useState } from "react";
import "../Styles/card.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import ItemCard from "../Components/ItemCard";

const Accommodations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [accommodations,setAccommodations] = useState([]);
    const [ratingValue, setRatingValue] = useState(0);
    const [roomCapacity, setRoomCapacity] = useState(0);
    const [accommodationClass, setAccommodationClass] = useState(0);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const navigate = useNavigate();

    const removeFilter = () => {
        setIsFilterApplied(false);
    }

    const updateRatingValue = (e) => {
        setRatingValue(e.target.value);
        setIsFilterApplied(true);
    }

    const updateCapacityValue = (e) => {
        setRoomCapacity(e.target.value);
        setIsFilterApplied(true);
    }

    const updateClassValue = (e) => {
        setAccommodationClass(e.target.value);
        setIsFilterApplied(true);
    }

    const handleSearch = async (e) =>{
        setSearch(e.target.value);

        if(e.target.value.length===0)
        {
            setSuggestions(undefined);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/accommodation/search?keyword=${e.target.value}`,{
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
            setAccommodations([]);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/accommodation/fetch?keyword=${search}`,{
                method: "GET",
            });

            const result = await response.json();
            if(result.status)
            {
                setAccommodations(result.data);
            }
            else
            {
                setAccommodations([]);
            }
        }
    }

    const placeSelected = async (category,text) =>{
        if(category===1)
        {
            const response = await fetch(`http://localhost:3000/accommodation/fetch/location/?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setAccommodations(result);
        }
        else if(category===2)
        {
            const response = await fetch(`http://localhost:3000/accommodation/fetch/district?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setAccommodations(result);
        }
        else
        {
            const response = await fetch(`http://localhost:3000/accommodation/fetch/division?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setAccommodations(result);
        }
        setSuggestions(undefined);
        setSearch("");
    }

    const showDestination = async (e) => {
        navigate(`${e.target.innerText}`);
    }

    const filterToggle = () => {
        setIsFilterApplied(!isFilterApplied);
    }

    const filterCheck = (accommodation) => {
        let isChecked = true;
        
        if(accommodation.RATING < ratingValue)
        {
            isChecked = false;
        }

        if(isChecked && accommodation.ROOM_CAPACITY<roomCapacity)
        {
            isChecked = false;
        }

        if(isChecked && accommodation.ACCOMMODATION_CLASS<accommodationClass)
        {
            isChecked = false;
        }

        if(isChecked && document.getElementById('preference1').checked && accommodation.FREE_WIFI==="N")
        {
            isChecked = false;
        }

        if(isChecked && document.getElementById('preference2').checked && accommodation.PARKING==="N")
        {
            isChecked = false;
        }

        if(isChecked && document.getElementById('preference3').checked && accommodation.BREAKFAST==="N")
        {
            isChecked = false;
        }

        if(isChecked && document.getElementById('preference4').checked && accommodation.POOL==="N")
        {
            isChecked = false;
        }

        return isChecked;
    }

    const data = {
        search: search,
        suggestions: suggestions,
        category: 'accommodation'
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
            
            {accommodations.length!==0 &&
                <div className='destination-search'>
                    <div className="filter">
                        <button className="btn-primary" style={{marginBottom:'10px'}} onClick={filterToggle}>{isFilterApplied ? 'Remove Filter' : 'Apply Filter'}</button>
                        <h3>Minimum Rating:</h3>
                        <div className="slider"><span className="rating">{ratingValue}</span> <input type="range" id="slider" min="0" max="5" value={ratingValue} step="0.5" onInput={updateRatingValue}/></div>

                        <h3>Minimum Room Capacity:</h3>
                        <div className="slider"><span className="rating">{roomCapacity}</span> <input type="range" id="slider" min="0" max="4" value={roomCapacity} step="1" onInput={updateCapacityValue}/></div>

                        <h3>Minimum Accommodation Class:</h3>
                        <div className="slider"><span className="rating">{accommodationClass}</span> <input type="range" id="slider" min="1" max="5" value={accommodationClass} step="1" onInput={updateClassValue}/></div>

                        <div style={{margin: '40px 0px 40px 0px'}}>
                            <h3>Choose Your Accommodation Preferences:</h3>
                            <label><input type="checkbox" id="preference1" value="Free WIFI" onChange={removeFilter}/>Free WIFI</label><br/>
                            <label><input type="checkbox" id="preference2" value="Parking" onChange={removeFilter}/>Parking</label><br/>
                            <label><input type="checkbox" id="preference3" value="Breakfast" onChange={removeFilter}/>Breakfast</label><br/>
                            <label><input type="checkbox" id="preference4" value="Pool" onChange={removeFilter}/>Pool</label><br/>
                        </div>
                    </div>
                    <div className='recommendation-container'>
                        <h1>Searched Accommodations -</h1>
                        <div className='card-container'>
                            {accommodations.map((accommodation,index)=>
                                (isFilterApplied ? filterCheck(accommodation) : true) && <ItemCard key={index} itemType='accommodation' item={accommodation} index={`${index}`}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>)
}

export default Accommodations;