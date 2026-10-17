import { useState } from "react";
import "../Styles/card.css"
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import RangeSlider from "../Components/RangeSlider";
import PaginatedItemBars from "../Components/PaginatedItemBars";
import { apiFetch } from '../api';

const facilityColumns = ['free_wifi','parking','breakfast','pool','accessible']; // in the order of the checkboxes
const placeKinds = {1: 'location', 2: 'district', 3: 'division'}; // SearchAndSuggestions' place categories

const marks = {
    0: '৳0',
    5000: '৳5,000',
    10000: '৳10,000',
    15000: '৳15,000',
    20000: '৳20,000'
};

const Accommodations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [narrowedTo,setNarrowedTo] = useState({}); // {keyword} or {location | district | division: name}; {} = everything
    const [shownFor,setShownFor] = useState(null); // the same in words, e.g. 'in Sylhet'
    const [ratingValue, setRatingValue] = useState(0);
    const [roomCapacity, setRoomCapacity] = useState(0);
    const [accommodationClass, setAccommodationClass] = useState(0);
    const [prices, setPrices] = useState([0, 20000]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [privArray, setPrivArray] = useState([false,false,false,false,false]);
    const navigate = useNavigate();

    const showAll = () => {
        setNarrowedTo({});
        setShownFor(null);
    }

    const resetFilter = () => {
        setRatingValue(0);
        setRoomCapacity(0);
        setAccommodationClass(0);
        setPrices([0, 20000]);
        setPrivArray([false,false,false,false,false]);
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
            const response = await apiFetch(`http://localhost:3000/accommodation/search?keyword=${e.target.value}`,{
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

    const showAccommodation = async (text) => {
        navigate(`${text}`);
    }

    // the search and filters, as GET /accommodation/fetch parameters
    const query = {
        ...narrowedTo,
        ...(isFilterApplied && {
            minRating: ratingValue,
            minCapacity: roomCapacity,
            minClass: accommodationClass,
            minPrice: prices[0],
            maxPrice: prices[1],
            facilities: facilityColumns.filter((column, index) => privArray[index]).join(','),
        }),
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
        showItem: showAccommodation
    }

    return(
        <div className="homepage">
            <SearchAndSuggestions data={data} functions={functions}/>
            
            <div className='destination-search'>
                <div className="filter">
                    <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>
                    <h3>Minimum Rating:</h3>
                    <div className="slider"><span className="filter-value">{ratingValue}</span> <input type="range" className="normal-slider" min="0" max="5" value={ratingValue} step="0.5" onInput={updateRatingValue}/></div>

                    <h3>Minimum Room Capacity:</h3>
                    <div className="slider"><span className="filter-value">{roomCapacity}</span> <input type="range" className="normal-slider" min="0" max="4" value={roomCapacity} step="1" onInput={updateCapacityValue}/></div>

                    <h3>Minimum Accommodation Class:</h3>
                    <div className="slider"><span className="filter-value">{accommodationClass}</span> <input type="range" className="normal-slider" min="1" max="5" value={accommodationClass} step="1" onInput={updateClassValue}/></div>

                    <h3>Price Range</h3>
                    <RangeSlider marks={marks} minValue={0} maxValue={20000} values={prices} setValues={setPrices} setIsFilterApplied={setIsFilterApplied}/>

                    <div style={{margin: '40px 0px 40px 0px'}}>
                        <h3>Choose Your Accommodation Preferences:</h3>
                        <label><input type="checkbox" id="preference1" value="Free WIFI" checked={privArray[0]} onChange={()=>checkPriv(0)}/>Free WIFI</label><br/>
                        <label><input type="checkbox" id="preference2" value="Parking" checked={privArray[1]} onChange={()=>checkPriv(1)}/>Parking</label><br/>
                        <label><input type="checkbox" id="preference3" value="Breakfast" checked={privArray[2]} onChange={()=>checkPriv(2)}/>Breakfast</label><br/>
                        <label><input type="checkbox" id="preference4" value="Pool" checked={privArray[3]} onChange={()=>checkPriv(3)}/>Pool</label><br/>
                        <label><input type="checkbox" id="preference5" value="Accessible" checked={privArray[4]} onChange={()=>checkPriv(4)}/>Accessible</label><br/>
                    </div>
                </div>
                <div className='recommendation-container browse-results'>
                    <div className='browse-results-header'>
                        <h1>{shownFor ? `Accommodations ${shownFor}` : 'All Accommodations'}</h1>
                        {shownFor &&
                            <div className="see-all-link" role="button" tabIndex={0} onClick={showAll}
                                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showAll()}>show all</div>}
                    </div>
                    <PaginatedItemBars itemType='accommodation' query={query}
                        emptyMessage={isFilterApplied ? 'No accommodations match these filters.' : `No accommodations ${shownFor ?? 'yet'}.`}/>
                </div>
            </div>
        </div>
    )
}

export default Accommodations;