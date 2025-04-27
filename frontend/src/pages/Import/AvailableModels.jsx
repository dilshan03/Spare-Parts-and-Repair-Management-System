import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { BACKEND_URL } from '../../config.js';
import CustomerRequestForm from '../../components/Import/CustomerRequestForm.jsx';

export default function AvailableModels() {
  const [models, setModels] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    api.get('/api/vehicles')
      .then(res => setModels(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Available Vehicle Models</h1>
        <button 
          onClick={() => setShowRequestForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Request Vehicle Import
        </button>
      </div>

      {showRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Request Vehicle Import</h2>
              <button 
                onClick={() => setShowRequestForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CustomerRequestForm onClose={() => setShowRequestForm(false)} />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map(model => (
          <div
            key={model._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <img
              src={`${BACKEND_URL}${model.imageUrl}`}
              alt={model.name}
              className="w-full h-48 object-cover"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">
                {model.brand} {model.name} ({model.year})
              </h2>
              <p className="text-gray-600">{model.description}</p>    
              <p className="text-lg font-bold mt-2">
                Price: LKR{model.price.toLocaleString()}
              </p>
              <p
                className={`mt-1 text-sm ${
                  model.available ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {model.available ? 'Available' : 'Not Available'}
              </p>
              {model.available && (
                <button
                  onClick={() => setSelectedVehicle(model)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Request Vehicle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <CustomerRequestForm
              vehicle={selectedVehicle}
              onRequestSubmitted={() => setSelectedVehicle(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
