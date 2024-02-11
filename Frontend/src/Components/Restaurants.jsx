import { useState } from "react";
import "../Styles/search.css"

const Restaurants = ()=>{
    const [search,setSearch] = useState("");

    const handleSearch = (e) =>{
        setSearch(e.target.value);

        
    }

    const handleSubmit = () =>{
        
    }

    return(
        <div className="homepage">
            <div className="search-container">
                <input type="text" className="search-input" value={search} placeholder="Search restaurant name or area..." onChange={handleSearch}/>
                <button className="search-button custom-btn" onClick={handleSubmit}>&#128269;</button>
            </div>
        </div>)
}

export default Restaurants;