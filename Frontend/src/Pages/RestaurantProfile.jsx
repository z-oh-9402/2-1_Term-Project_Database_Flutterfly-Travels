import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import Rating from "../Components/Rating";
import ImageSlider from "../Components/ImageSlider";
import { useParams } from "react-router-dom";
import RestaurantBooking from "../Components/RestaurantBooking";
import { apiFetch } from '../api';
import WishlistHeart from "../Components/WishlistHeart";

const RestaurantProfile = () => {
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
            let response = await apiFetch(`http://localhost:3000/restaurant/fetch/restaurant-name?name=${name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await apiFetch(`http://localhost:3000/restaurant/review-rating/${data.restaurant_id}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if (userInfo && userInfo.user_type === 'customer') {
                response = await apiFetch(`http://localhost:3000/restaurant/review-rating/${data.restaurant_id}/${userInfo.user_id}`, {
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
            await apiFetch(`http://localhost:3000/restaurant/review-rating/${result.restaurant_id}`, {
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
                <div>
                 {showConfirmationMessage && <RestaurantBooking header='Book destination -' restaurant={result} setShowConfirmationMessage={setShowConfirmationMessage}/>}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: userInfo && userInfo.user_type !== 'admin' ? 'space-between' : 'start',
                            padding: '0px 40px'
                        }}
                    >
                        <h2 style={{ margin: '0px', color: "white", fontFamily: 'Brush Script, cursive' }}>{result.name}<WishlistHeart itemType='restaurant' item={result} className='title-fav-icon'/></h2>
                        {userInfo && userInfo.user_type !== 'admin' && <button className="custom-btn" onClick={()=>setShowConfirmationMessage(true)}>Book Now!</button>}
                    </div>

                    <div style={{ marginLeft: '0px', padding: '40px', display: 'flex', justifyContent: 'space-between' , alignItems: 'center' , fontSize:"14px", fontFamily: 'Brush Script, cursive'}}>
                        <ImageSlider images={images} />
                        <div className="information-container" style={{ width: '500px' }}>
                            <h3>Location: {result.location_name}, {result.district_name}</h3><br />
                            <h3>Address: {result.address}</h3><br />
                            <h3>Price Range: {result.price_range}</h3><br />
                            <h3>Rating: <Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)} /></h3><br />
                            <div>
                                {result.accessible === 'Y' && <h3 style={{ marginRight: '20px' }}>Accessible &#x2713;</h3>}
                                {result.free_wifi === 'Y' && <h3 style={{ marginRight: '20px' }}>Free Wifi &#x2713;</h3>}
                                {result.parking === 'Y' && <h3 style={{ marginRight: '20px' }}>Parking &#x2713;</h3>}
                                {result.takeaway === 'Y' && <h3 style={{ marginRight: '20px' }}>Takeaway &#x2713;</h3>}
                                {result.delivery === 'Y' && <h3 style={{ marginRight: '20px' }}>Delivery &#x2713;</h3>}
                                {result.dine_in === 'Y' && <h3 style={{ marginRight: '20px' }}>Dine In &#x2713;</h3>}
                            </div>
                            {result.phone_number && <h3>Phone Number: {result.phone_number}</h3>}<br />
                            {result.facebook && <a href={result.facebook} style={{ color: "white", marginRight: '20px', fontSize: '18px' }}>visit our Facebook</a>}
                            {result.website && <a href={result.website} style={{ color: "white", fontSize: '18px' }}>visit our Website</a>}<br /><br />
                            {result.email && <h3>Email: {result.email}</h3>}
                        </div>
                    </div>

                    <div style={{ padding: '40px', display: "flex", justifyContent: 'space-between', color: "white" }}>
                        <iframe src={result.map} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        <ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit} />
                    </div>
                </div>}
        </>
    );
}

export default RestaurantProfile;