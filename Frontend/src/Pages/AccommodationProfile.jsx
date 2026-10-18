import "../Styles/button.css";

import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Rating from "../Components/Rating";
import UserInfoContext from '../Context/UserInfoContext';
import ReviewsAndRatings from "../Components/ReviewsAndRatings";
import AccommodationBooking from "../Components/AccommodationBooking";

import { IoWifiSharp } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { BiAccessibility } from "react-icons/bi";
import { MdPool, MdFreeBreakfast } from "react-icons/md";
import { apiFetch } from '../api';
import { ItemHeader, ItemLayout, InfoRow, InfoText, FeatureChips, ContactLinks } from "../Components/ItemProfile";

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

            setImages([data.image1, data.image2, data.image3].filter(Boolean));   // skip empty slots
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
                <div className="item-profile">
                    {showConfirmationMessage && <AccommodationBooking accommodation={result} setShowConfirmationMessage={setShowConfirmationMessage} />}
                    <ItemHeader
                        itemType='accommodation'
                        item={result}
                       
                        subtitle={[result.accommodation_type, result.accommodation_class && `${result.accommodation_class}★`, result.style].filter(Boolean).join(' · ')}
                        action={userInfo && userInfo.user_type !== 'admin' && <button className="btn-primary booking-btn" onClick={()=>setShowConfirmationMessage(true)}>Book Now!</button>}
                    />

                    <ItemLayout
                        images={images}
                        map={result.map}
                        reviewCount={allReviewRatings.length}
                        reviews={<ReviewsAndRatings personalRating={personalRating} personalReview={personalReview} reviews={allReviewRatings} handleSubmit={handleSubmit} />}
                    >
                        {result.description && <InfoText label="About">{result.description}</InfoText>}
                        <InfoRow label="Address">{result.address}</InfoRow>
                        <InfoRow label="Room Price Per Night">৳ {result.room_price.toLocaleString('en-US')}</InfoRow>
                        <InfoRow label="Room Capacity">{result.room_capacity} {result.room_capacity === 1 ? 'guest' : 'guests'}</InfoRow>
                        <InfoRow label="Rating"><Rating rating={parseFloat(result.rating)} isChanging={false} setRating={null} count={Number(result.rating_count)} /></InfoRow>
                        <FeatureChips features={[
                            { label: 'Free Wifi', icon: <IoWifiSharp/>, available: result.free_wifi === 'Y' },
                            { label: 'Parking', icon: <FaCar/>, available: result.parking === 'Y' },
                            { label: 'Pool', icon: <MdPool/>, available: result.pool === 'Y' },
                            { label: 'Breakfast', icon: <MdFreeBreakfast/>, available: result.breakfast === 'Y' },
                            { label: 'Accessible', icon: <BiAccessibility/>, available: result.accessible === 'Y' },
                        ]}/>
                        <ContactLinks item={result}/>
                    </ItemLayout>
                </div>}
        </>
    );
};

export default AccommodationProfile;