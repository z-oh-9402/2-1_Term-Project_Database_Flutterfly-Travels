import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "../Components/Rating";
import UserInfoContext from "../Context/UserInfoContext";
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import { apiFetch } from '../api';
import { ItemHeader, ItemLayout, InfoRow, InfoText } from "../Components/ItemProfile";

const DestinationProfile = () => {
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

            setImages([data.image1, data.image2, data.image3].filter(Boolean));   // skip empty slots
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
            <div className="item-profile">
                <ItemHeader itemType='destination' item={result} subtitle={(result.type || []).map(type => type.type_name).join(', ')}/>

                <ItemLayout
                    images={images}
                    map={result.map}
                    reviewCount={allReviewRatings.length}
                    reviews={<ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit}/>}
                >
                    {result.description && <InfoText label="About">{result.description}</InfoText>}
                    <InfoRow label="Attractions">{result.attractions}</InfoRow>
                    <InfoRow label="Travel Tips">{result.travel_tips}</InfoRow>
                    <InfoRow label="Weather Info">{result.weather_info}</InfoRow>
                    <InfoRow label="Rating"><Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)}/></InfoRow>
                </ItemLayout>
            </div>}
        </>
    );
};

export default DestinationProfile;
