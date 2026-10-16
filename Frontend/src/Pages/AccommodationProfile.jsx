import "../Styles/button.css";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";
import Rating from "../Components/Rating";
import UserInfoContext from '../Context/UserInfoContext';
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import AccommodationBooking from "../Components/AccommodationBooking";

import { IoWifiSharp } from "react-icons/io5";
import { FaCar, FaFacebook } from "react-icons/fa";
import { BiAccessibility } from "react-icons/bi";
import { BsGlobe } from "react-icons/bs";
import { MdEmail, MdPool, MdFreeBreakfast } from "react-icons/md";
import { apiFetch } from '../api';
import WishlistHeart from "../Components/WishlistHeart";

const iconStyle = {
    color: "white",
    fontSize: "30px",
    marginRight: "20px"
}

const AccommodationProfile = () => {
    const { userInfo } = useContext(UserInfoContext);
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images, setImages] = useState([]);
    const [review, setReview] = useState("");
    const personalReview = { review, setReview };
    const [rating, setRating] = useState(0);
    const personalRating = { rating, setRating };
    const [allReviewRatings, setAllReviewRatings] = useState([]);
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const name = encodeURIComponent(params.name);
            let response = await apiFetch(`http://localhost:3000/accommodation/fetch/accommodation-name?name=${name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await apiFetch(`http://localhost:3000/accommodation/review-rating/${data.accommodation_id}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if (userInfo && userInfo.user_type === 'customer') {
                response = await apiFetch(`http://localhost:3000/accommodation/review-rating/${data.accommodation_id}/${userInfo.user_id}`, {
                    method: "GET",
                });

                const data3 = await response.json();
                setRating(data3);
            }

            setImages([data.image1, data.image2, data.image3]);
            setResult(data);
        };
        fetchData()
    }
    , []);

    const handleSubmit = async () => {
        if (rating !== 0) {
            await apiFetch(`http://localhost:3000/accommodation/review-rating/${result.accommodation_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    review: review,
                    rating: rating,
                    customerId: userInfo.user_id
                }),
            });

            setReview("");
            window.location.reload();
        }
        else {
            alert("Please provide a rating!");
        }
    };

    return (
        <>
            {result &&
                <div style={{fontFamily: 'Brush Script, cursive'}}>
                    {showConfirmationMessage && <AccommodationBooking accommodation={result} setShowConfirmationMessage={setShowConfirmationMessage} />}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: userInfo && userInfo.user_type !== 'admin' ? 'space-between' : 'start',
                            padding: '0px 40px'
                        }}
                    >
                        <h1 style={{ margin: '0px', color: "white", fontFamily: 'Brush Script, cursive' }}>{result.name}<WishlistHeart itemType='accommodation' item={result} className='title-fav-icon'/></h1>
                        {userInfo && userInfo.user_type !== 'admin' && <button className="btn-primary booking-btn" onClick={()=>setShowConfirmationMessage(true)}>Book Now!</button>}
                    </div>
                    
                    <div style={{ marginLeft: '0px', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="information-container" style={{ width: '500px', color: "white", fontSize: '14px' }}>
                            <h3><span style={{color: '#03fcf8'}}>Location: </span>{result.location_name}, {result.district_name}</h3><br />
                            <h3><span style={{color: '#03fcf8'}}>Address: </span>{result.address}</h3><br />
                            <h3><span style={{color: '#03fcf8'}}>Room Price Per Night: </span>৳ {result.room_price.toLocaleString('en-US')}</h3><br />
                            <h3><span style={{color: '#03fcf8'}}>Rating: </span><Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)} /></h3><br />
                            <h3><span style={{color: '#03fcf8'}}>Room Capacity: </span>{result.room_capacity}</h3><br />
                            <div>
                                <IoWifiSharp style={{...iconStyle , color: result.free_wifi === 'Y' ? 'lightgreen' : 'red'}}/>
                                <FaCar style={{...iconStyle , color: result.parking === 'Y'? 'lightgreen' : 'red'}}/>
                                <MdPool style={{...iconStyle , color: result.pool === 'Y'? 'lightgreen' : 'red'}}/>
                                <MdFreeBreakfast style={{...iconStyle , color: result.breakfast === 'Y'? 'lightgreen' : 'red'}}/>
                                <BiAccessibility style={{...iconStyle , color: result.accessible === 'Y'? 'lightgreen' : 'red'}}/>
                            </div>
                            {result.phone_number && <h3><span style={{color: '#03fcf8'}}>Phone Number: </span>{result.phone_number}</h3>}<br />
                            <div>
                                {result.email && <a href={result.email} style={iconStyle}><MdEmail/></a>}
                                {result.facebook && <a href={result.facebook} style={iconStyle}><FaFacebook/></a>}
                                {result.website && <a href={result.website} style={iconStyle}><BsGlobe/></a>}
                            </div>
                        </div>
                        <ImageSlider images={images} />
                    </div>

                    <div style={{ padding: '40px', display: "flex", justifyContent: 'space-between', color: "white" }}>
                        <iframe src={result.map} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        <ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit} />
                    </div>
                </div>}
        </>
    );
};

export default AccommodationProfile;