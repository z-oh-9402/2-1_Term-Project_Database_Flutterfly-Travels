import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";
import Rating from "../Components/Rating";
import UserInfoContext from '../Context/UserInfoContext';
import ReviewsAndRatings from "../Components/ReviewsAndRatings";

const AccommodationProfile = () => {
    const {userInfo} = useContext(UserInfoContext);
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images,setImages] = useState([]);
    const [review, setReview] = useState("");
    const personalReview = {review, setReview};
    const [rating, setRating] = useState(0);
    const personalRating = {rating, setRating};
    const [allReviewRatings,setAllReviewRatings] = useState([]);
    
    useEffect(()=>{
        const fetchData = async () => {
            let response = await fetch(`http://localhost:3000/accommodation/fetch/accommodation-name?name=${params.name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await fetch(`http://localhost:3000/accommodation/review-rating/${data.ACCOMMODATION_ID}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if(userInfo!==null && userInfo.USER_TYPE==='customer')
            {
                response = await fetch(`http://localhost:3000/accommodation/review-rating/${data.ACCOMMODATION_ID}/${userInfo.USER_ID}`, {
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
            let response = await fetch(`http://localhost:3000/accommodation/review-rating/${result.ACCOMMODATION_ID}`, {
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

            response = await fetch(`http://localhost:3000/accommodation/review-rating/${result.ACCOMMODATION_ID}`, {
                method: "GET",
            });
            let data = await response.json();
            setAllReviewRatings(data);

            response = await fetch(`http://localhost:3000/accommodation/review-rating/${result.ACCOMMODATION_ID}/${userInfo.USER_ID}`, {
                method: "GET",
            });

            data = await response.json();
            setRating(data);
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
                <h2 style={{paddingLeft: '40px'}}>{result.NAME}</h2>
                
                <div style={{marginLeft: '0px',padding: '40px', display: 'flex', justifyContent:'space-between'}}>
                <ImageSlider images={images}/>
                    <div className="information-container" style={{width: '500px'}}>
                        <h3>Location: {result.LOCATION_NAME}, {result.DISTRICT_NAME}</h3><br/>
                        <h3>Address: {result.ADDRESS}</h3><br/>
                        <h3>Room Price: ৳ {result.ROOM_PRICE}</h3><br/>
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
};

export default AccommodationProfile;