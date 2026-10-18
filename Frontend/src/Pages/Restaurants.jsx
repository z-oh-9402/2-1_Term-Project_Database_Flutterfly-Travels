import { useState } from "react";
import "../Styles/search.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import PaginatedItemBars from "../Components/PaginatedItemBars";
import { apiFetch } from '../api';

const facilityColumns = ['free_wifi','parking','delivery','takeaway','dine_in','accessible']; // in the order of the checkboxes
const placeKinds = {1: 'location', 2: 'district', 3: 'division'}; // SearchAndSuggestions' place categories

const Restaurants = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [narrowedTo,setNarrowedTo] = useState({}); // {keyword} or {location | district | division: name}; {} = everything
    const [shownFor,setShownFor] = useState(null); // the same in words, e.g. 'in Sylhet'
    const [ratingValue, setRatingValue] = useState(0);
    const [restaurantClass, setRestaurantClass] = useState(0);
    const [priceRange, setPriceRange] = useState(3);
    const PRarray = ["$","$$","$$$", "$$$$"];
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const cuisines = ["Bangladeshi","Seafood","Indian","Chinese","Thai","Cafe","Fast Food"];
    const [cuisineArray, setCuisineArray] = useState(cuisines.map(() => false));
    const [privArray, setPrivArray] = useState([false,false,false,false,false,false]);
    const navigate = useNavigate();

    const showAll = () => {
        setNarrowedTo({});
        setShownFor(null);
    }

    const resetFilter = () => {
        setRatingValue(0);
        setRestaurantClass(0);
        setPriceRange(3);
        setCuisineArray(cuisines.map(() => false));
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

    const handleSubmit = () =>{
        setNarrowedTo(search.length===0 ? {} : {keyword: search});
        setShownFor(search.length===0 ? null : `matching "${search}"`);
        setSearch("");
    }

    const placeSelected = (category,text) =>{
        setNarrowedTo({[placeKinds[category]]: text});
        setShownFor(`in ${text}`);
        setSuggestions(undefined);
        setSearch("");
    }

    const showRestaurant = async (e) => {
        navigate(`${e.target.innerText}`);
    }

    // the search and filters, as GET /restaurant/fetch parameters
    const query = {
        ...narrowedTo,
        ...(isFilterApplied && {
            minRating: ratingValue,
            minClass: restaurantClass,
            maxPriceRange: PRarray[priceRange],
            cuisines: cuisines.filter((cuisine, index) => cuisineArray[index]).join(','),
            facilities: facilityColumns.filter((column, index) => privArray[index]).join(','),
        }),
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
                        {cuisines.map((cuisine, index) =>
                            <span key={cuisine}><label><input type="checkbox" checked={cuisineArray[index]} onChange={()=>checkCuisine(index)}/>{cuisine}</label><br/></span>
                        )}
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
                <div className='recommendation-container browse-results'>
                    <div className='browse-results-header'>
                        <h1>{shownFor ? `Restaurants ${shownFor}` : 'All Restaurants'}</h1>
                        {shownFor &&
                            <div className="see-all-link" role="button" tabIndex={0} onClick={showAll}
                                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showAll()}>show all</div>}
                    </div>
                    <PaginatedItemBars itemType='restaurant' query={query}
                        emptyMessage={isFilterApplied ? 'No restaurants match these filters.' : `No restaurants ${shownFor ?? 'yet'}.`}/>
                </div>
            </div>
        </div>
    )
}

export default Restaurants;