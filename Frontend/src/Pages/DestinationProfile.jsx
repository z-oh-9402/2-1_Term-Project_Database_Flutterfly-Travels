import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "../Components/ImageSlider";

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
            </>}
        </>
    );
};

export default DestinationProfile;
