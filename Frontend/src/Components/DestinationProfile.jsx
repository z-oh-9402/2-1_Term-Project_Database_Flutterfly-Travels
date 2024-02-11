import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DestinationProfile = () => {
    const params = useParams();
    const [result, setResult] = useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/destination/fetch/destination-name?name=${params.name}`, {
                method: "GET",
            });

            const data = await response.json();
            setResult(data);
        };
        fetchData()}
    ,[params.name]);

    return (<>{result ? result.NAME : null}</>);
};

export default DestinationProfile;
