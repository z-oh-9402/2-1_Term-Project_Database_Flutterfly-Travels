import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";
import Rating from "../Components/Rating";
import UserInfoContext from "../Context/UserInfoContext";
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import { apiFetch } from '../api';
import WishlistHeart from "../Components/WishlistHeart";

const DestinationProfile = () => {
    const {userInfo} = useContext(UserInfoContext);
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images,setImages] = useState([]);
    const [review, setReview] = useState("");
    const personalReview = {review, setReview};
    const [rating, setRating] = useState(0);
    const personalRating = {rating, setRating};
    const [allReviewRatings,setAllReviewRatings] = useState([{}]);
    
    useEffect(()=>{
        const fetchData = async () => {
            const name = encodeURIComponent(params.name);
            let response = await apiFetch(`http://localhost:3000/destination/fetch/destination-name?name=${name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await apiFetch(`http://localhost:3000/destination/review-rating/${data.destination_id}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if(userInfo && userInfo.user_type==='customer')
            {
                response = await apiFetch(`http://localhost:3000/destination/review-rating/${data.destination_id}/${userInfo.user_id}`, {
                    method: "GET",
                });

                const data3 = await response.json();
                setRating(data3);
            }

            setImages([data.image1, data.image2, data.image3]);
            setResult(data);
        };
        fetchData()}
    ,[]);

    const handleSubmit = async () => {
        if(rating)
        {
            await apiFetch(`http://localhost:3000/destination/review-rating/${result.destination_id}`, {
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
        else
        {
            alert("Please provide a rating!");
        }
    };

    return (
        <>
            {result && 
            <>
                <div style={{marginLeft: '0px',padding: '40px', display: 'flex', justifyContent:'space-between', fontFamily: 'Brush Script, cursive'}}>
                    <div className="information-container" style={{width: '500px'}}>
                        <h1 style={{margin: '0px 0px 40px 0px', color:"white"}}>{result.name}<WishlistHeart itemType='destination' item={result} className='title-fav-icon'/></h1>
                        <h3><span style={{color: '#03fcf8'}}>Location: </span>{result.location_name}, {result.district_name}</h3><br/>
                        <h3><span style={{color: '#03fcf8'}}>Travel Tips: </span>{result.travel_tips}</h3><br/>
                        <h3><span style={{color: '#03fcf8'}}>Atrractions: </span>{result.attractions}</h3><br/>
                        <h3><span style={{color: '#03fcf8'}}>Weather Info: </span>{result.weather_info}</h3><br/>
                        <h3><span style={{color: '#03fcf8'}}>Rating: </span><Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)}/></h3><br/>
                    </div>
                    
                    <ImageSlider images={images}/>
                </div>

                <div style={{padding:'40px', display: "flex", justifyContent: 'space-between',color:"white"}}>
                    <iframe src={result.map} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    <ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit}/>
                </div>
            </>}
        </>
    );
};

export default DestinationProfile;
