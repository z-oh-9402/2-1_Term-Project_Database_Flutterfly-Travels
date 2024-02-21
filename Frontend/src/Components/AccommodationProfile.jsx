import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccommodationProfile = () => {
    const params = useParams();
    const [result, setResult] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [images,setImages] = useState([]);
    
    useEffect(()=>{
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/accommodation/fetch/accommodation-name?name=${params.name}`, {
                method: "GET",
            });

            const data = await response.json();
            setResult(data);
            setImages([data.IMAGE1,data.IMAGE2,data.IMAGE3]);
        };
        fetchData()}
    ,[]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const offset = '-100%';
            const slides = document.querySelector('.slides');
            slides.style.transform = 'translateX(' + offset + ')';
            slides.style.transition = 'transform 0.9s ease-in-out';
            setCurrentIndex((currentIndex+1)%3);

            const func = () =>{
                slides.removeEventListener('transitionend',func);
                const currElement = document.getElementById('show-image-'+currentIndex);
                currElement.remove();

                const newElement = document.createElement('img');
                newElement.id = 'show-image-'+currentIndex;
                newElement.classList.add('des-image');
                newElement.src = images[currentIndex];
                slides.appendChild(newElement);

                slides.style.transform = 'translateX(0%)';
                slides.style.transition = 'none';
            }

            slides.addEventListener('transitionend',func);
        }, 2800);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentIndex,images]);

    return (
        <>
            {result && 
            <>
                <h3>{result.NAME}</h3>
                <div className="slider-container">
                    <div className="slides">
                        <img id='show-image-0' className="des-image" src={images[0]}/>
                        <img id='show-image-1' className="des-image" src={images[1]}/>
                        <img id='show-image-2' className="des-image" src={images[2]}/>
                    </div>
                </div>
                <iframe src={result.MAP} width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </>}
        </>
    );
};

export default AccommodationProfile;
