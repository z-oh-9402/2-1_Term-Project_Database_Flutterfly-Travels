import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";
import Rating from "../Components/Rating";
import UserInfoContext from "../Context/UserInfoContext";

const max_review_length = 700;

const DestinationProfile = () => {
    const {userInfo} = useContext(UserInfoContext);
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images,setImages] = useState([]);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [allReviewRatings,setAllReviewRatings] = useState([{}]);


    const handleReviewChange = (e) => {
        if(e.target.value.length <= max_review_length)
        {
            setReview(e.target.value);
        }
    };
    
    useEffect(()=>{
        const fetchData = async () => {
            let response = await fetch(`http://localhost:3000/destination/fetch/destination-name?name=${params.name}`, {
                method: "GET",
            });

            let data = await response.json();

            response = await fetch(`http://localhost:3000/destination/review-rating/${data.DESTINATION_ID}`, {
                method: "GET",
            });
            const data2 = await response.json();
            setAllReviewRatings(data2);

            if(userInfo!==null)
            {
                response = await fetch(`http://localhost:3000/destination/review-rating/${data.DESTINATION_ID}/${userInfo.USER_ID}`, {
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
        let response = await fetch(`http://localhost:3000/destination/review-rating/${result.DESTINATION_ID}`, {
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

        response = await fetch(`http://localhost:3000/destination/review-rating/${result.DESTINATION_ID}`, {
            method: "GET",
        });
        let data = await response.json();
        setAllReviewRatings(data);

        if(userInfo!==null)
        {
            response = await fetch(`http://localhost:3000/destination/review-rating/${result.DESTINATION_ID}/${userInfo.USER_ID}`, {
                method: "GET",
            });

            data = await response.json();
            setRating(data);
        }
        setReview("");
    };

    return (
        <>
            {result && 
            <>
                <h2 style={{paddingLeft: '40px'}}>{result.NAME}</h2>
                
                <div style={{marginLeft: '0px',padding: '40px', display: 'flex', justifyContent:'space-between'}}>
                <ImageSlider images={images}/>
                    <div className="information-container" style={{width: '500px'}}>
                        <h3>Location: {result.LOCATION_NAME}, {result.DISTRICT_NAME}</h3><br/>
                        <h3>Travel Tips: {result.TRAVEL_TIPS}</h3><br/>
                        <h3>Atrractions: {result.ATTRACTIONS}</h3><br/>
                        <h3>Weather Info: {result.WEATHER_INFO}</h3><br/>
                        <h3>Rating: <Rating rating={result.RATING} state={0} setRating={null}/></h3><br/>
                    </div>
                </div>

                <div style={{padding:'40px', display: "flex", justifyContent: 'space-between'}}>
                    <iframe src={result.MAP} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                    {userInfo!==null &&
                        <div className="review-section" style={{maxWidth: "400px"}}>
                        <h2>Reviews</h2>
                        <form>
                            <div style={{display: 'inline-block'}}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <label>Your Rating: </label>
                                    <Rating rating={rating} state={1} setRating={setRating}/>
                                </div>
                            </div>

                            <textarea value={review} placeholder="Write your review here..." onChange={handleReviewChange}/>
                            <p>{review.length}/{max_review_length}</p>
                            <button className="btn-primary" onClick={handleSubmit}>Submit Review</button>
                        </form>
                    </div>}

                    <div className="all-review" style={{width: "300px"}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h2>All Reviews ({allReviewRatings.length})</h2>
                            {allReviewRatings.length>5 && <div className="see-all-link">see all</div>}
                        </div>
                        {allReviewRatings.map((item,index) => (
                            index<5 &&
                            <div key={index}>
                                <p>{item.USERNAME}</p>
                                <Rating rating={item.RATING} state={0} setRating={null}/>
                                <p>{item.REVIEW}</p>
                                <p>{item.CREATED_AT}</p>
                                <br/>
                            </div>
                        ))}
                    </div>
                </div>
            </>}
        </>
    );
};

export default DestinationProfile;
