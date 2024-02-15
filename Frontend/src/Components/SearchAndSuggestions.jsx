import { MdLocationPin } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";
import { IoIosRestaurant } from "react-icons/io";
import { FaHotel } from "react-icons/fa";
import PropTypes from 'prop-types';
import "../Styles/search.css"

const SearchAndSuggestions = (props) => {
    const {data, functions} = props;

    const setOnFocus = () =>{
        const blurBackground = document.getElementById("dim-background");
        blurBackground.style.display = "block";
        
        if(data.suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            suggestionsBlock.style.display = "flex";
        }
    }

    const setOnBlur = () =>{
        const blurBackground = document.getElementById("dim-background");
        setTimeout(()=>{blurBackground.style.display = "none"}, 250);
        
        if(data.suggestions)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            setTimeout(()=>{suggestionsBlock.style.display = "none"}, 250);
        }
    }

    return (
        <>
            <span id="dim-background"></span>
            <div className="search-div-container" style={{position: "relative"}}>
                <div className="search-container">
                    <input type="text" onFocus={setOnFocus} onBlur={setOnBlur} className="search-input" value={data.search} placeholder="Search destination name or area..." onChange={functions.handleSearch}/>
                    <button className="search-button custom-btn" onClick={functions.handleSubmit}>
                        <h1>🔍</h1>
                    </button>
                </div>
                {data.suggestions!==undefined &&
                    <div id="suggestions-container">
                        {data.suggestions.destination.map((item,index)=>
                            <div key={index} className="suggested-items">
                                {data.category==='destination' ? <FaLocationArrow size={30} style={{paddingRight: "8px"}}/> 
                                                          : (data.category ==='hotel' ? <FaHotel size={30} style={{paddingRight: "8px"}}/> 
                                                                                 : <IoIosRestaurant size={30} style={{paddingRight: "8px"}}/>)}
                                <div><h3 onClick={functions.showDestination}>{item.NAME}</h3>
                                {item.LOCATION_NAME}, {item.DISTRICT_NAME}</div>
                            </div>
                        )}
                        {data.suggestions.location.subDistrict.map((item,index)=>
                            <div key={index} className="suggested-items">
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>{functions.placeSelected(1,e.target.innerText)}}>{item.LOCATION_NAME}</h3>
                                {item.DISTRICT_NAME}, {item.DIVISION_NAME}</div>
                            </div>
                        )}
                        {data.suggestions.location.district.map((item,index)=>
                            <div key={index} className="suggested-items">
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>functions.placeSelected(2,e.target.innerText)}>{item.DISTRICT_NAME}</h3>
                                {item.DIVISION_NAME} Division</div>
                            </div>
                        )}
                        {data.suggestions.location.division.map((item,index)=>
                            <div key={index} className="suggested-items">
                                <MdLocationPin size={30} style={{paddingRight: "8px"}}/>
                                <div><h3 onClick={(e)=>functions.placeSelected(3,e.target.innerText)}>{item.DIVISION_NAME}</h3>
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