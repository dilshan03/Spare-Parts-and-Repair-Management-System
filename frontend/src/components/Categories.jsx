import React from 'react';

const Categories = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Repair Service */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Repair Service</h3>
          <p className="text-gray-600 mb-4">
            Professional vehicle repair services with skilled mechanics and quality parts.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Learn More
          </button>
        </div>

        {/* Spare Parts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Spare Parts</h3>
          <p className="text-gray-600 mb-4">
            Genuine spare parts for all major vehicle brands with warranty.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Parts
          </button>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Maintenance</h3>
          <p className="text-gray-600 mb-4">
            Regular maintenance services to keep your vehicle in optimal condition.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Schedule Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categories;
