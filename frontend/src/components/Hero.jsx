import React from "react";
import carImage from "../assets/car.jpg"; // Make sure car.jpg is inside /src/assets/

const Hero = () => {
  return (
    <section className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between">
      <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          WELCOME TO <br />
          <span className="text-orange-500">COSMO EXPORTS</span>
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Your trusted partner in vehicle imports, repairs, and spare parts.
        </p>
      </div>
      <div className="md:w-1/2">
        <img
          src={carImage}
          alt="Car"
          className="w-full max-w-md mx-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Hero;
