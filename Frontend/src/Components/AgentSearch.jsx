import { useState } from "react";
import PropTypes from 'prop-types';
import '../Styles/search.css';
import { apiFetch, photoUrl } from '../api';

// Finds an approved agent by username; picking one passes their profile to setProfile
const AgentSearch = (props) => {
    const {setProfile} = props;

    const [suggestions, setSuggestions] = useState([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSearch = async (e) =>{
        const keyword = e.target.value;
        setSearch(keyword);
        setIsOpen(true);

        if(keyword.length===0)
        {
            setSuggestions([]);
            return;
        }

        const response = await apiFetch(`http://localhost:3000/agent/search?keyword=${encodeURIComponent(keyword)}`,{
            method: "GET",
        });
        const result = await response.json();
        setSuggestions(result.status ? result.data : []);
    }

    const selectAgent = async (agentId) =>{
        const response = await apiFetch(`http://localhost:3000/agent/fetch/${agentId}`,{
            method: "GET",
        });
        const result = await response.json();

        setProfile(result);
        setSearch(result.username);
        setIsOpen(false);
    }

    return (
        <div className='agent-search'>
            <input className="search-input user-search-input" type="text" value={search} placeholder="Search username..."
                   onChange={handleSearch} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}/>

            {isOpen && suggestions.length!==0 &&
            // mousedown would blur the input (closing the list) before the click lands, so it is held back
            <div className="agent-suggestions" onMouseDown={(e) => e.preventDefault()}>
                {suggestions.map((suggestion) =>
                    <div key={suggestion.user_id} className="suggested-items" onClick={()=>selectAgent(suggestion.user_id)}>
                        <div className="profile-pic">
                            <img src={photoUrl(suggestion.photo)}/>
                        </div>
                        <div className="agent-profile-info">
                            <h4>{suggestion.username}</h4>
                            <p>Experience: {suggestion.experience_years} years · Fee: ৳ {Number(suggestion.fee).toLocaleString('en-US')} · Rating: {suggestion.rating}</p>
                        </div>
                    </div>
                )}
            </div>}
        </div>
    )
}

AgentSearch.propTypes = {
    setProfile: PropTypes.func
}

export default AgentSearch;
