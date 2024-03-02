import PropTypes from 'prop-types';
import { ImCross } from 'react-icons/im';
import '../Styles/login-signup.css';
import { useContext, useEffect, useState } from 'react';
import UserInfoContext from '../Context/UserInfoContext';

const Trips = (props) => {
    const {userInfo} = useContext(UserInfoContext);
    const {setShowTrips} = props;
    const [trips, setTrips] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            let response = await fetch(`http://localhost:3000/trips/${userInfo.USER_ID}`, {
                method: "GET",
            });

            const data = await response.json();
            setTrips(data);
        };
        fetchData()
    },[]);

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