import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";
import Rating from "../Components/Rating";

const DestinationProfile = () => {
    const params = useParams();
    const [result, setResult] = useState(null);
    const [images,setImages] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/destination/fetch/destination-name?name=${params.name}`, {
                method: "GET",
            });

            const data = await response.json();
            setResult(data);
            setImages([data.IMAGE1,data.IMAGE2,data.IMAGE3]);
        };
        fetchData()}
    ,[]);

    return (
        <>
            {result && 
            <>
                <h3>{result.NAME}</h3>
                <ImageSlider images={images}/>
                <iframe src={result.MAP} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>

                <div className="review-section">
                    <h2>Reviews</h2>
                    <Rating rating={0} state={1}/>
                    <form>
                        <label>Your Rating:</label>
                        {/* Your rating component, e.g., a star rating component */}
                        <input type="number" min="1" max="5" />
                        <textarea placeholder="Write your review here..." />
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            </>}
        </>
    );
};

export default DestinationProfile;
