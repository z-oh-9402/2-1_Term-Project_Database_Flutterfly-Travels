import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchAndSuggestions from "../Components/SearchAndSuggestions";
import PaginatedItemBars from "../Components/PaginatedItemBars";
import { apiFetch } from '../api';

const placeTypes = ["Mountains","Lakes","Beaches","Forests","Hill Tracks","Tea Gardens","Historical Places"];
const placeKinds = {1: 'location', 2: 'district', 3: 'division'}; // SearchAndSuggestions' place categories

const Destinations = ()=>{
    const [search,setSearch] = useState("");
    const [suggestions,setSuggestions] = useState(undefined);
    const [narrowedTo,setNarrowedTo] = useState({}); // {keyword} or {location | district | division: name}; {} = everything
    const [shownFor,setShownFor] = useState(null); // the same in words, e.g. 'in Sylhet'
    const [ratingValue, setRatingValue] = useState(0);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [prefArray, setPrefArray] = useState(placeTypes.map(() => false));
    const navigate = useNavigate();

    const showAll = () => {
        setNarrowedTo({});
        setShownFor(null);
    }

    const resetFilter = () => {
        setRatingValue(0);
        setPrefArray(placeTypes.map(() => false));
        setIsFilterApplied(false);
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
            const response = await apiFetch(`http://localhost:3000/destination/search?keyword=${e.target.value}`,{
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

    const showDestination = async (name) => {
        navigate(`${name}`);
    }

    // the search and filters, as GET /destination/fetch parameters
    const query = {
        ...narrowedTo,
        ...(isFilterApplied && {
            minRating: ratingValue,
            types: placeTypes.filter((type, index) => prefArray[index]).join(','),
        }),
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
        showItem: showDestination
    }

    return(
        <div className="homepage">
            <SearchAndSuggestions data={data} functions={functions}/>
            
            <div className='destination-search'>
                <div className="filter">
                    <button className="btn-primary" style={{marginBottom:'10px'}} onClick={resetFilter}>Reset Filter</button>
                    <h3>Minimum Rating:</h3>
                    <div className="slider"><span className="filter-value">{ratingValue}</span> <input type="range" className="normal-slider" min="0" max="5" value={ratingValue} step="0.5" onInput={updateValue}/></div>

                    <div style={{marginTop: '40px'}}>
                        <h3>Choose Your Destination Preferences:</h3>
                        {placeTypes.map((type, index) =>
                            <span key={type}><label><input type="checkbox" checked={prefArray[index]} onChange={()=>checkPref(index)}/>{type}</label><br/></span>
                        )}
                    </div>
                </div>
                <div className='recommendation-container browse-results'>
                    <div className='browse-results-header'>
                        <h1>{shownFor ? `Destinations ${shownFor}` : 'All Destinations'}</h1>
                        {shownFor &&
                            <div className="see-all-link" role="button" tabIndex={0} onClick={showAll}
                                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && showAll()}>show all</div>}
                    </div>
                    <PaginatedItemBars itemType='destination' query={query}
                        emptyMessage={isFilterApplied ? 'No destinations match these filters.' : `No destinations ${shownFor ?? 'yet'}.`}/>
                </div>
            </div>
        </div>)
}

export default Destinations;