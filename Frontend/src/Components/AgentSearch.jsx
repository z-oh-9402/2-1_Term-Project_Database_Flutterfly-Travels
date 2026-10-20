import { useState } from "react";
import PropTypes from 'prop-types';
import { FaBriefcase } from 'react-icons/fa';
import Rating from './Rating';
import '../Styles/search.css';
import { apiFetch, photoUrl } from '../api';
import MessageHover from './MessageHover';

// Finds an approved agent by username; picking one passes their profile to setProfile.
// Once picked (profile is set), the agent is shown as a card instead of the search, with a button to pick another.
const AgentSearch = (props) => {
    const {profile, setProfile} = props;

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
        if(!response.ok)
        {
            return;
        }
        setProfile(await response.json());
        setIsOpen(false);
    }

    const pickAnother = () => {
        setProfile(undefined);
        setSearch("");
        setSuggestions([]);
    }

    if(profile)
    {
        const fullName = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim();
        return (
            <div className='agent-picked'>
                <div className='agent-picked-photo'>
                    <img src={photoUrl(profile.photo)} alt=''/>
                </div>
                <div className='agent-picked-info'>
                    <div className='agent-picked-name'>
                        <MessageHover person={{ user_id: profile.user_id, user_type: 'agent', username: profile.username }}>{profile.username}</MessageHover>
                    </div>
                    {fullName && <div className='agent-picked-fullname'>{fullName}</div>}
                    <div className='agent-picked-stats'>
                        <span><FaBriefcase/> {profile.experience_years} years</span>
                        <span>৳ {Number(profile.fee).toLocaleString('en-US')} fee</span>
                        <Rating rating={parseFloat(profile.rating)} isChanging={false} setRating={null} count={Number(profile.rating_count)}/>
                    </div>
                </div>
                <button type='button' className='agent-picked-change' onClick={pickAnother}>Change</button>
            </div>
        );
    }

    return (
        <div className='agent-search'>
            {/* it only appears when the user asks to choose an agent, so typing can start right away */}
            <input className="search-input user-search-input" type="text" value={search} placeholder="Search username..." autoFocus
                   onChange={handleSearch} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}/>

            {isOpen && suggestions.length!==0 &&
            // mousedown would blur the input (closing the list) before the click lands, so it is held back
            <div className="agent-suggestions" onMouseDown={(e) => e.preventDefault()}>
                {suggestions.map((suggestion) =>
                    <div key={suggestion.user_id} className="suggested-items" onClick={()=>selectAgent(suggestion.user_id)}>
                        <div className="profile-pic agent-suggestion-profile-pic">
                            <img src={photoUrl(suggestion.photo)}/>
                        </div>

                        <div className="agent-profile-info">
                            <h4>{suggestion.username}</h4>
                            <p className='agent-suggestion-stats'>
                                Experience: {suggestion.experience_years} years · Fee: ৳ {Number(suggestion.fee).toLocaleString('en-US')} ·
                                <Rating rating={parseFloat(suggestion.rating)} isChanging={false} setRating={null} count={Number(suggestion.rating_count)}/>
                            </p>
                        </div>
                    </div>
                )}
            </div>}
        </div>
    )
}

AgentSearch.propTypes = {
    profile: PropTypes.object,
    setProfile: PropTypes.func
}

export default AgentSearch;
