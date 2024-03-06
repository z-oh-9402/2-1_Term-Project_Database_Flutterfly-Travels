import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import '../Styles/trips.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';

const Trips = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const [trips, setTrips] = useState([]);
    const {setShowTrips} = props;
    const [currentCategory, setCurrentCategory] = useState(0);
    
    useEffect(() => {
        const sortTrips = () => {
            let newTrips = [];
            const updatingTrips = [];
            const pendingTrips = [];
            const confirmedTrips = [];
            const completedTrips = [];
    
            for(let trip of userInfo.TRIPS)
            {
                if(trip.TRIP_STATUS === "UPDATING")
                {
                    updatingTrips.push(trip);
                }
                else if(trip.TRIP_STATUS === "PENDING")
                {
                    pendingTrips.push(trip);
                }
                else if(trip.TRIP_STATUS === "CONFIRMED")
                {
                    confirmedTrips.push(trip);
                }
                else
                {
                    completedTrips.push(trip);
                }
            }
    
            newTrips.push(updatingTrips);
            newTrips.push(pendingTrips);
            newTrips.push(confirmedTrips);
            newTrips.push(completedTrips);
    
            setTrips(newTrips);
        }

        sortTrips();
    }, []);

    const handleGoToCurrentPage = () => {
        setShowTrips(false);
    }

    return(
        <>
            <div className='login-signup-popup'>
                <div className="close-container" style={{position: 'relative'}}>
                    <ImCross className='close' onClick={handleGoToCurrentPage} />
                    <div className='login-signup-container trip-container'>
                        <h2>My Trips</h2>
                        <div className="category-bar" id="categoryBar">
                            <div className={"category" + (currentCategory===0 ? " selected-category" : "")} id="category0" onClick={()=>setCurrentCategory(0)}>Updating</div>
                            <div className={"category" + (currentCategory===1 ? " selected-category" : "")} id="category1" onClick={()=>setCurrentCategory(1)}>Pending</div>
                            <div className={"category" + (currentCategory===2 ? " selected-category" : "")} id="category2" onClick={()=>setCurrentCategory(2)}>Confirmed</div>
                            <div className={"category" + (currentCategory===3 ? " selected-category" : "")} id="category3" onClick={()=>setCurrentCategory(3)}>Completed</div>
                        </div>

                        {trips.length!==0 &&
                        <div className="category-data" id="categoryData">
                            {trips[currentCategory].length===0 ? 
                                <div className="no-trips">
                                    <h3>No trips in this category</h3>
                                </div>
                            :
                            trips[currentCategory].map((trip, index) => 
                                <div key={index} className="trip">
                                    <h3 style={{marginTop: '0px', marginBottom: '8px'}}>{trip.NAME}</h3>
                                    <div className="trip-details">
                                        <p>Departure Date: 
                                            {new Date(trip.DEPARTURE_DATE).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p>Return Date: 
                                            {new Date(trip.RETURN_DATE).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p>Total Cost: {trip.TOTAL_COST}</p>
                                        <p>Discount: {trip.DISCOUNT}</p>
                                    </div>
                                </div>
                            )}
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

Trips.propTypes = {
    setShowTrips: PropTypes.func
}

export default Trips;