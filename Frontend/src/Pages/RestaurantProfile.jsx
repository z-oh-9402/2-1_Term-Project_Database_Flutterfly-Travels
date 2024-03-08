import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import Rating from "../Components/Rating";
import ImageSlider from "../Components/ImageSlider";
import { useParams } from "react-router-dom";
import RestaurantBooking from "../Components/RestaurantBooking";

const RestaurantProfile = () => {
    const {userInfo} = useContext(UserInfoContext);
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images,setImages] = useState([]);
    const [review, setReview] = useState("");
    const personalReview = {review, setReview};
    const [rating, setRating] = useState(0);
    const personalRating = {rating, setRating};
    const [allReviewRatings,setAllReviewRatings] = useState([]);
    const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
    
    useEffect(()=>{
        const fetchData = async () => {
            const name = encodeURIComponent(params.name);
            let response = await fetch(`http://localhost:3000/restaurant/fetch/restaurant-name?name=${name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await fetch(`http://localhost:3000/restaurant/review-rating/${data.RESTAURANT_ID}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if(userInfo!==null && userInfo.USER_TYPE==='customer')
            {
                response = await fetch(`http://localhost:3000/restaurant/review-rating/${data.RESTAURANT_ID}/${userInfo.USER_ID}`, {
                    method: "GET",
                });

                const data3 = await response.json();
                setRating(data3);
            }

            setImages([data.IMAGE1,data.IMAGE2,data.IMAGE3]);
            setResult(data);
        };
        fetchData()}
    ,[]);

    const handleSubmit = async () => {
        if(rating!==0)
        {
            await fetch(`http://localhost:3000/restaurant/review-rating/${result.RESTAURANT_ID}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    review: review,
                    rating: rating,
                    customerId: userInfo.USER_ID
                }),
            });

            setReview("");
            window.location.reload();
        }
        else
        {
            alert("Please provide a rating!");
        }
    };

    return (
        <>
            {result && 
            <div>
                 {showConfirmationMessage && <RestaurantBooking header='Book destination -' destination={result} setShowConfirmationMessage={setShowConfirmationMessage}/>}
                <div 
                    style={{display: 'flex', 
                            justifyContent: userInfo && userInfo.USER_TYPE!=='admin' ? 'space-between' : 'start', 
                            padding: '0px 40px'}}
                >
                    <h2 style={{margin: '0px'}}>{result.NAME}</h2>
                    {userInfo && userInfo.USER_TYPE!=='admin' && <button className="custom-btn" onClick={()=>setShowConfirmationMessage(true)}>Book Now!</button>}
                </div>
                
                <div style={{marginLeft: '0px',padding: '40px', display: 'flex', justifyContent:'space-between'}}>
                <ImageSlider images={images}/>
                    <div className="information-container" style={{width: '500px'}}>
                        <h3>Location: {result.LOCATION_NAME}, {result.DISTRICT_NAME}</h3><br/>
                        <h3>Address: {result.ADDRESS}</h3><br/>
                        <h3>Price Range: {result.PRICE_RANGE}</h3><br/>
                        <h3>Rating: <Rating rating={result.RATING} state={0} setRating={null}/></h3><br/>
                    </div>
                </div>

                <div style={{padding:'40px', display: "flex", justifyContent: 'space-between'}}>
                    <iframe src={result.MAP} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    <ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit}/>
                </div>
            </div>}
        </>
    );
}

export default RestaurantProfile;