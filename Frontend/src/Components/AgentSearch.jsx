import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import '../Styles/search.css';
import { apiFetch } from '../api';

const AgentSearch = (props) => {
    const {setProfile} = props;

    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");

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
        
        if(suggestions.length)
        {
            const suggestionsBlock = document.getElementById("suggestions-container");
            suggestionsBlock.style.display = "flex";
        }
    }

    const setOnBlur = () =>{
        setTimeout(()=>{
            const blurBackground = document.getElementById("dim-background");
            blurBackground.style.display = "none";

            const searchItems = document.getElementById("search-items");
            searchItems.style.zIndex = 0;
            
            if(suggestions.length)
            {
                const suggestionsBlock = document.getElementById("suggestions-container");
                suggestionsBlock.style.display = "none"
            }
        }, 300);
    }

    const handleSearch = async (e) =>{
        setSearch(e.target.value);

        if(e.target.value.length===0)
        {
            setSuggestions([]);
        }
        else
        {
            const response = await apiFetch(`http://localhost:3000/agent/search?keyword=${e.target.value}`,{
                method: "GET",
            });

            const result = await response.json();
            if(result.status)
            {
                setSuggestions(result.data);
            }
            else
            {
                setSuggestions([]);
            }
        }
    }

    const selectAgent = async (agentId) =>{
        console.log(agentId);
        const response = await apiFetch(`http://localhost:3000/agent/fetch/${agentId}`,{
            method: "GET",
        });

        const result = await response.json();
        
        setProfile(result);
        console.log(result);
        setSearch(result.username);
    }

    return (
        <>
            <span id="dim-background"></span>
            <div id='search-items' style={{position: "relative", zIndex: "0"}}>
                <div className="search-container user-search-container">
                    <input id="search-bar" type="text" onFocus={setOnFocus} className="search-input user-search-input" value={search} placeholder="Search username..." onChange={handleSearch}/>
                </div>

                {suggestions.length!==0 &&
                <div id="suggestions-container" className="agent-suggestions-container">
                    {suggestions.map((suggestion, index) => 
                        <div key={index} className="suggested-items" onClick={()=>selectAgent(suggestion.user_id)}>
                            <div className="profile-pic">
                                {console.log(suggestion)}
                                <img src={suggestion.photo ?'http://localhost:3000/uploads/'+suggestion.photo : "default_profile_pic.jpeg"}/>
                            </div>
                            <div className="agent-profile-info">
                                <h4>{suggestion.username}</h4>
                                <p>Experience years: {suggestion.experience_years}</p>
                                <p>Fee: {suggestion.fee}</p>
                                <p>Rating: {suggestion.rating}</p>
                            </div>
                        </div>
                    )}
                </div>}
            </div>
        </>
    )
}

AgentSearch.propTypes = {
    setProfile: PropTypes.func
}

export default AgentSearch;