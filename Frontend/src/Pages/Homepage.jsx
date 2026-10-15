import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "../Styles/image-slider.css";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Homepage = () => {
    const slides = [
        {
            image: "https://cosmosgroup.sgp1.cdn.digitaloceanspaces.com/news/details/9880772_largest%20tea%20gardens%20Bangladesh.jpg",
            text: "Seeking a heavenly experience? Let's make it divine.",
        },
        {
            image: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/details/3921007.webp",
            text: "Wanna enjoy the best food in town???",
        },
        {
            image: "https://th.bing.com/th/id/R.3af5e8f7e610806fb5f8e9d046052a5d?rik=96WNlUsdwAZ%2f7A&pid=ImgRaw&r=0",
            text: "Get the ultimate travel experience!!!",
        },
        {
            image: "https://businessinspection.com.bd/wp-content/uploads/2022/06/Top-Resorts-in-Bangladesh-1.jpg",
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
