import {useState } from "react";
import "../Styles/card.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import ItemCard from "../Components/ItemCard";

const Destinations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [destinations,setDestinations] = useState([]);
    const [ratingValue, setRatingValue] = useState(0);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [prefArray, setPrefArray] = useState([false,false,false,false,false,false,false]);
    const navigate = useNavigate();

    const resetFilter = () => {
        setRatingValue(0);
        setPrefArray([false,false,false,false,false,false,false]);
        isFilterApplied(false);
    }

    const updateValue = (e) => {
        setRatingValue(e.target.value);
        setIsFilterApplied(true);
    }

    const checkPref = (index) => {
        let temp = [...prefArray];
        temp[index] = !temp[index];
        setPrefArray(temp);
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

    const filterCheck = (destination) => {
        let  isChecked = true;
        
        if(destination.RATING < ratingValue)
        {
            
            isChecked = false;
        }

        if(isChecked)
        {
            let flag = false;
            let anySelected = false;
            for(let i=0;i<7;i++)
            {
                if(prefArray[i])
                {
                    const item = document.getElementById('preference'+(i+1));
                    anySelected = true;
                    for(let i=0;i<destination.TYPE.length;i++)
                    {
                        if(destination.TYPE[i].TYPE_NAME === item.value)
                        {
                            flag = true;
                            break;
                        }
                    }
                }

                if(flag)
                {
                    break;
                }
            }

            isChecked = anySelected ? flag : !anySelected;
        }

        return isChecked;
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
                    <div className="filter">
                        <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>
                        <h3>Minimum Rating:</h3>
                        <div className="slider"><span className="filter-value">{ratingValue}</span> <input type="range" className="normal-slider" min="0" max="5" value={ratingValue} step="0.5" onInput={updateValue}/></div>

                        <div style={{marginTop: '40px'}}>
                            <h3>Choose Your Destination Preferences:</h3>
                            <label><input type="checkbox" id="preference1" value="Mountains" checked={prefArray[0]} onChange={()=>checkPref(0)}/>Mountains</label><br/>
                            <label><input type="checkbox" id="preference2" value="Lakes" checked={prefArray[1]} onChange={()=>checkPref(1)}/>Lakes</label><br/>
                            <label><input type="checkbox" id="preference3" value="Beaches" checked={prefArray[2]} onChange={()=>checkPref(2)}/>Beaches</label><br/>
                            <label><input type="checkbox" id="preference4" value="Forests" checked={prefArray[3]} onChange={()=>checkPref(3)}/>Forests</label><br/>
                            <label><input type="checkbox" id="preference5" value="Hill Tracks" checked={prefArray[4]} onChange={()=>checkPref(4)}/>Hill Tracks</label><br/>
                            <label><input type="checkbox" id="preference6" value="Tea Gardens" checked={prefArray[5]} onChange={()=>checkPref(5)}/>Tea Gardens</label><br/>
                            <label><input type="checkbox" id="preference7" value="Historical Places" checked={prefArray[6]} onChange={()=>checkPref(6)}/>Historical Places</label><br/>
                        </div>
                    </div>
                    <div className='recommendation-container'>
                        <h1>Searched Destinations -</h1>
                        <div className='card-container'>
                            {destinations.map((destination,index)=>
                                (isFilterApplied ? filterCheck(destination) : true) && <ItemCard key={index} itemType='destination' item={destination} index={`${index}`}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>)
}

export default Destinations;