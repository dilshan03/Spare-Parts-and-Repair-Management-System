import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import your images
import carImage from "../assets/car.jpg";
import image1 from "../assets/slide1.jpg";
import image2 from "../assets/slide2.jpg";
import image3 from "../assets/slide3.jpg";

const Hero = () => {
  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear'
  };

  // Sample slides data - you can add more images and content
  const slides = [
    {
      image: carImage,
      title: 'Welcome to Cosmo Exports',
      description: 'Get your dream car imported with our hassle-free service'
    },
    {
      image: image3, 
      title: 'Quality Spare Parts',
      description: 'Genuine spare parts for all major vehicle brands'
    },

    {
      image: image2, 
      title: 'Expert Repair Services',
      description: 'Professional repair and maintenance by certified technicians'
    },
    
    {
      image: image3,
      title: 'Premium Vehicle Imports',
      description: 'Get your dream car imported with our hassle-free service'
    },
  ];

  return (
    <section className="relative">
      <Slider {...settings} className="overflow-hidden">
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <div className="h-[600px] relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    {index === 0 && (
                      <>
                        WELCOME TO<br />
                        <span className="text-orange-500">COSMO EXPORTS</span>
                      </>
                    )}
                    {index !== 0 && slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <button className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Hero;
