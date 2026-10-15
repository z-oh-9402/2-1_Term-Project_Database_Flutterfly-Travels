import { useState } from "react";
import "../Styles/search.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import ItemBar from "../Components/ItemBar";
import { apiFetch } from '../api';

const Restaurants = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [restaurants,setRestaurants] = useState([]);
    const [ratingValue, setRatingValue] = useState(0);
    const [restaurantClass, setRestaurantClass] = useState(0);
    const [priceRange, setPriceRange] = useState(3);
    const PRarray = ["$","$$","$$$", "$$$$"];
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [cuisineArray, setCuisineArray] = useState([false,false,false,false]);
    const cuisines = ["Seafood","Indian","Chinese","Cafe"];
    const [privArray, setPrivArray] = useState([false,false,false,false,false,false]);
    const navigate = useNavigate();

    const resetFilter = () => {
        setRatingValue(0);
        setRestaurantClass(0);
        setPriceRange(3);
        setCuisineArray([false,false,false,false]);
        setPrivArray([false,false,false,false,false,false]);
        setIsFilterApplied(false);
    }

    const updateRatingValue = (e) => {
        setRatingValue(e.target.value);
        setIsFilterApplied(true);
    }

    const updateClassValue = (e) => {
        setRestaurantClass(e.target.value);
        setIsFilterApplied(true);
    }

    const updatePriceRange = (e) => {
        setPriceRange(e.target.value);
        setIsFilterApplied(true);
    }

    const checkCuisine = (index) => {
        let temp = [...cuisineArray];
        temp[index] = !temp[index];
        setCuisineArray(temp);
        setIsFilterApplied(true);
    }

    const checkPriv = (index) => {
        let temp = [...privArray];
        temp[index] = !temp[index];
        setPrivArray(temp);
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
            const response = await apiFetch(`http://localhost:3000/restaurant/search?keyword=${e.target.value}`,{
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
            setRestaurants([]);
        }
        else
        {
            const response = await apiFetch(`http://localhost:3000/restaurant/fetch?keyword=${search}`,{
                method: "GET",
            });

            const result = await response.json();
            if(result.status)
            {
                setRestaurants(result.data);
            }
            else
            {
                setRestaurants([]);
            }
        }
        setSearch("");
    }

    const placeSelected = async (category,text) =>{
        if(category===1)
        {
            const response = await apiFetch(`http://localhost:3000/restaurant/fetch/location/?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setRestaurants(result);
        }
        else if(category===2)
        {
            const response = await apiFetch(`http://localhost:3000/restaurant/fetch/district?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setRestaurants(result);
        }
        else
        {
            const response = await apiFetch(`http://localhost:3000/restaurant/fetch/division?name=${text}`,{
                method: "GET",
            });

            const result = await response.json();
            setRestaurants(result);
        }
        setSuggestions(undefined);
        setSearch("");
    }

    const showRestaurant = async (e) => {
        navigate(`${e.target.innerText}`);
    }

    const filterCheck = (restaurant) => {
        let isChecked = true;
        
        if(restaurant.rating < ratingValue)
        {
            isChecked = false;
        }

        if(isChecked && restaurant.restaurant_class<restaurantClass)
        {
            isChecked = false;
        }

        if(isChecked)
        {
            for(let i=0;i<=priceRange;i++)
            {
                if(restaurant.price_range===PRarray[i])
                {
                    isChecked = true;
                    break;
                }
                else
                {
                    isChecked = false;
                }
            }
        }

        if(isChecked)
        {
            for(let i=0;i<4;i++)
            {
                if(cuisineArray[i])
                {
                    if(restaurant.cuisine_type===cuisines[i])
                    {
                        isChecked = true;
                        break;
                    }
                    else
                    {
                        isChecked = false;
                    }
                }
            }
        }

        if(isChecked && privArray[0] && restaurant.free_wifi==="N")
        {
            isChecked = false;
        }

        if(isChecked && privArray[1] && restaurant.parking==="N")
        {
            isChecked = false;
        }

        if(isChecked && privArray[2] && restaurant.delivery==="N")
        {
            isChecked = false;
        }

        if(isChecked && privArray[3] && restaurant.takeaway==="N")
        {
            isChecked = false;
        }

        if(isChecked && privArray[4] && restaurant.dine_in==="N")
        {
            isChecked = false;
        }

        if(isChecked && privArray[5] && restaurant.accessible==="N")
        {
            isChecked = false;
        }

        return isChecked;
    }

    const data = {
        search: search,
        suggestions: suggestions,
        category: 'restaurant'
    }

    const functions = {
        placeSelected: placeSelected,
        handleSearch: handleSearch,
        handleSubmit: handleSubmit,
        showItem: showRestaurant
    }

    return(
        <div className="homepage">
            <SearchAndSuggestions data={data} functions={functions}/>
            
            {restaurants.length!==0 &&
                <div className='destination-search'>
                    <div className="filter">
                        <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>
                        
                        <h3>Minimum Rating:</h3>
                        <div className="slider"><span className="filter-value">{ratingValue}</span> <input type="range" className="normal-slider" min="0" max="5" value={ratingValue} step="0.5" onInput={updateRatingValue}/></div>

                        <h3>Minimum Restaurant Class:</h3>
                        <div className="slider"><span className="filter-value">{restaurantClass}</span> <input type="range" className="normal-slider" min="1" max="5" value={restaurantClass} step="1" onInput={updateClassValue}/></div>

                        <h3>Maximum Price Range:</h3>
                        <div className="slider"><span className="filter-value" style={{marginRight: "10px"}}>{PRarray[priceRange]}</span> <input type="range" className="normal-slider" min="0" max="3" value={priceRange} step="1" onInput={updatePriceRange}/></div>

                        <div style={{margin: '40px 0px 30px 0px'}}>
                            <h3>Choose Cuisine Type:</h3>
                            <label><input type="checkbox" checked={cuisineArray[0]} onChange={()=>checkCuisine(0)}/>Seafood</label><br/>
                            <label><input type="checkbox" checked={cuisineArray[1]} onChange={()=>checkCuisine(1)}/>Indian</label><br/>
                            <label><input type="checkbox" checked={cuisineArray[2]} onChange={()=>checkCuisine(2)}/>Chinese</label><br/>
                            <label><input type="checkbox" checked={cuisineArray[3]} onChange={()=>checkCuisine(3)}/>Cafe</label>
                        </div>

                        <div style={{margin: '30px 0px 40px 0px'}}>
                            <h3>Choose Extra Facilities:</h3>
                            <label><input type="checkbox" checked={privArray[0]} onChange={()=>checkPriv(0)}/>Free WIFI</label><br/>
                            <label><input type="checkbox" checked={privArray[1]} onChange={()=>checkPriv(1)}/>Parking</label><br/>
                            <label><input type="checkbox" checked={privArray[2]} onChange={()=>checkPriv(2)}/>Delivery</label><br/>
                            <label><input type="checkbox" checked={privArray[3]} onChange={()=>checkPriv(3)}/>Takeaway</label><br/>
                            <label><input type="checkbox" checked={privArray[4]} onChange={()=>checkPriv(4)}/>Dine-In</label><br/>
                            <label><input type="checkbox" checked={privArray[5]} onChange={()=>checkPriv(5)}/>Accessible</label>
                        </div>
                    </div>
                    <div className='recommendation-container'>
                        <h1>Searched Accommodations -</h1>
                        <div className='bar-container'>
                            {restaurants.map((restaurant,index)=>
                                (isFilterApplied ? filterCheck(restaurant) : true) && <ItemBar key={index} itemType='restaurant' item={restaurant} index={`${index}`}/>
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Restaurants;