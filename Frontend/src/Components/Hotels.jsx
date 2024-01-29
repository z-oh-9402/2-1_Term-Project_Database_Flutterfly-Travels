import { useState } from "react";
import "../Styles/search.css"

const Hotels = ()=>{
    const [search,setSearch] = useState("");

    const handleSearch = (e) =>{
        setSearch(e.target.value);

        
    }

    const handleSubmit = () =>{
        
    }

    return(
        <div className="homepage">
            <h1>Flutterfly Travels</h1>
            <div className="search-container">
                <input type="text" className="search-input" value={search} placeholder="Search hotel name or area..." onChange={handleSearch}/>
                <button className="search-button custom-btn" onClick={handleSubmit}>&#128269;</button>
            </div>
        </div>)
}

export default Hotels;