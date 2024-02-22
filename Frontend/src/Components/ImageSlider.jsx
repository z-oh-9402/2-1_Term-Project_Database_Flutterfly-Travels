import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../Styles/image-slider.css";

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const offset = '-100%';
            const slides = document.querySelector('.slides');
            slides.style.transform = 'translateX(' + offset + ')';
            slides.style.transition = 'transform 0.9s ease-in-out';
            setCurrentIndex((currentIndex + 1) % images.length);

            const func = () => {
                slides.removeEventListener('transitionend', func);
                const currElement = document.getElementById('show-image-' + currentIndex);
                currElement.remove();

                const newElement = document.createElement('img');
                newElement.id = 'show-image-' + currentIndex;
                newElement.classList.add('des-image');
                newElement.src = images[currentIndex];
                slides.appendChild(newElement);

                slides.style.transform = 'translateX(0%)';
                slides.style.transition = 'none';
            };

            slides.addEventListener('transitionend', func);
        }, 1800);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentIndex, images]);

    return (
        <div className="slider-container">
            <div className="slides">
                {images.map((image, index) => (
                    <img key={index} id={'show-image-' + index} className="des-image" src={image} />
                ))}
            </div>
        </div>
    );
};

ImageSlider.propTypes = {
    images: PropTypes.array
}

export default ImageSlider;