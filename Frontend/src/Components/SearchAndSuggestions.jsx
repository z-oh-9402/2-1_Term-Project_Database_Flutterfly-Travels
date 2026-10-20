import { MdLocationPin } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";
import { IoIosRestaurant } from "react-icons/io";
import { FaHotel } from "react-icons/fa";
import PropTypes from 'prop-types';
import "../Styles/search.css"
import { useEffect } from "react";

const SearchAndSuggestions = (props) => {
    const {data, functions} = props;

    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById('search-items');
            const rect = element.getBoundingClientRect();

            if(rect.bottom<30)
            {
                document.getElementById('search-bar').blur();
            }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const setOnFocus = () =>{
        const blurBackground = document.getElementById("dim-background");
        blurBackground.style.display = "block";

        const searchItems = document.getElementById("search-items");
        searchItems.style.zIndex = 3;
        
        if(data.suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            suggestionsBlock.style.display = "flex";
        }
    }

    const setOnBlur = () =>{
        const blurBackground = document.getElementById("dim-background");
        setTimeout(()=>{blurBackground.style.display = "none"}, 300);

        const searchItems = document.getElementById("search-items");
        setTimeout(()=>{searchItems.style.zIndex = 0}, 300);
        
        if(data.suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            setTimeout(()=>{suggestionsBlock.style.display = "none"}, 300);
        }
    }

    return (
        <>
            <span id="dim-background"></span>
            <div id='search-items' style={{position: "relative", zIndex: "0", margin: "20px 0px 36px 0px"}}>
                <div className="search-container">
                    <input id="search-bar" type="text" autoComplete="off" onFocus={setOnFocus} onBlur={setOnBlur} className="search-input" value={data.search} placeholder={`Search ${data.category} name or area...`} onChange={functions.handleSearch}/>
                    <button className="search-button custom-btn" onClick={functions.handleSubmit}>
                        <h1>🔍</h1>
                    </button>
                </div>
                {data.suggestions!==undefined &&
                    <div id="suggestions-container">
                        {data.suggestions.destination.map((item,index)=>
                            <div key={index} className="suggested-items" onClick={() => functions.showItem(item.name)}>
                                {data.category==='destination' ? <FaLocationArrow size={30} style={{paddingRight: "8px"}}/> 
                                                          : (data.category ==='accommodation' ? <FaHotel size={30} style={{paddingRight: "8px"}}/> 
                                                                                 : <IoIosRestaurant size={30} style={{paddingRight: "8px"}}/>)}
                                <div><h3>{item.name}</h3>
                                {item.location_name}, {item.district_name}</div>
                            </div>
                        )}
                        {data.suggestions.location.subDistrict.map((item,index)=>
                            <div key={index} className="suggested-items" onClick={()=>functions.placeSelected(1,item.location_name)}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3>{item.location_name}</h3>
                                {item.district_name}, {item.division_name}</div>
                            </div>
                        )}
                        {data.suggestions.location.district.map((item,index)=>
                            <div key={index} className="suggested-items" onClick={()=>functions.placeSelected(2,item.district_name)}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3>{item.district_name}</h3>
                                {item.division_name} Division</div>
                            </div>
                        )}
                        {data.suggestions.location.division.map((item,index)=>
                            <div key={index} className="suggested-items" onClick={()=>functions.placeSelected(3,item.division_name)}>
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3>{item.division_name}</h3>
                                Bangladesh</div>
                            </div>
                        )}
                    </div>
                }
            </div>
        </>
    )
}

SearchAndSuggestions.propTypes = {
    data: PropTypes.object,
    functions: PropTypes.object
}

export default SearchAndSuggestions;