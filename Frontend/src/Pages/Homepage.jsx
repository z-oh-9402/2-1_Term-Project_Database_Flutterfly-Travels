import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../Styles/image-slider.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Slider photos are part of the app (Frontend/public/homepage/)
const SLIDE_IMAGES = "/homepage/";

const Homepage = () => {
    const slides = [
        {
            image: SLIDE_IMAGES + "tea-garden.jpg",
            text: "Seeking a heavenly experience? Let's make it divine.",
        },
        {
            image: SLIDE_IMAGES + "food.webp",
            text: "Wanna enjoy the best food in town???",
        },
        {
            image: SLIDE_IMAGES + "beach.jpg",
            text: "Get the ultimate travel experience!!!",
        },
        {
            image: SLIDE_IMAGES + "resort.jpg",
            text: "Get the best hotel deals here!!!",
        }
    ];
    const customPrevArrow = <FaChevronLeft size={24} color="white" />; // Customize left arrow icon
    const customNextArrow = <FaChevronRight size={24} color="white" />;
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2200,
        prevArrow: customPrevArrow,
        nextArrow: customNextArrow,
    };

    return (

        <div style={{ width: "650px", margin: "0 auto", justifyContent: "center", alignItems: "center" }}>
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index}>
                        <img src={slide.image} alt={`Slide ${index + 1}`} style={{ width: "650px", height: "350px" }} />
                        <div style={{ color: "white", fontSize: "24px", fontFamily: "Arial, sans-serif", fontStyle: "italic", background: "linear-gradient(to right, #FF6A00, #EE0979)", padding: "10px" }}>
                            {slide.text}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Homepage;
