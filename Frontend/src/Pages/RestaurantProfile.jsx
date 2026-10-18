import { useContext, useEffect, useState } from "react";
import UserInfoContext from "../Context/UserInfoContext";
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import Rating from "../Components/Rating";
import { useParams } from "react-router-dom";
import RestaurantBooking from "../Components/RestaurantBooking";
import { apiFetch } from '../api';
import { ItemHeader, ItemLayout, InfoRow, FeatureChips, ContactLinks } from "../Components/ItemProfile";

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

            setImages([data.image1, data.image2, data.image3].filter(Boolean));   // skip empty slots
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
                <div className="item-profile">
                    {showConfirmationMessage && <RestaurantBooking restaurant={result} setShowConfirmationMessage={setShowConfirmationMessage}/>}
                    <ItemHeader
                        itemType='restaurant'
                        item={result}
                       
                        subtitle={[result.cuisine_type && `${result.cuisine_type} cuisine`, result.price_range].filter(Boolean).join(' · ')}
                        action={userInfo && userInfo.user_type !== 'admin' && <button className="btn-primary booking-btn" onClick={()=>setShowConfirmationMessage(true)}>Book Now!</button>}
                    />

                    <ItemLayout
                        images={images}
                        map={result.map}
                        reviewCount={allReviewRatings.length}
                        reviews={<ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit} />}
                    >
                        <InfoRow label="Address">{result.address}</InfoRow>
                        <InfoRow label="Price Range">{result.price_range}</InfoRow>
                        {result.booking_cost && <InfoRow label="Booking Cost">৳ {result.booking_cost.toLocaleString('en-US')} per seat</InfoRow>}
                        <InfoRow label="Rating"><Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)} /></InfoRow>
                        <FeatureChips features={[
                            { label: 'Dine In', available: result.dine_in === 'Y' },
                            { label: 'Takeaway', available: result.takeaway === 'Y' },
                            { label: 'Delivery', available: result.delivery === 'Y' },
                            { label: 'Free Wifi', available: result.free_wifi === 'Y' },
                            { label: 'Parking', available: result.parking === 'Y' },
                            { label: 'Accessible', available: result.accessible === 'Y' },
                        ]}/>
                        <ContactLinks item={result}/>
                    </ItemLayout>
                </div>}
        </>
    );
}

export default RestaurantProfile;