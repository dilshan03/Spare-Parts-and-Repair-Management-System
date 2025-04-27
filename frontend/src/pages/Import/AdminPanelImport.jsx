import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import { BACKEND_URL } from '../../config.js';

export default function AdminPanelImport() {
  const [models, setModels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    year: '',
    price: '',
    description: '',
    available: true
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);
  
  const token = localStorage.getItem("token");
  const fetchVehicles = async () => {
    try {
      setIsLoading(true);
      
      const response = await api.get('/api/vehicles');
      // Ensure response.data is an array, if not set to empty array
      setVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Failed to fetch vehicles');
      setVehicles([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Basic validation
      if (!formData.name || !formData.brand || !formData.year || !formData.price) {
        alert('Please fill in all required fields');
        return;
      }
  
      if (!selectedFile && !editingId) {
        alert('Please select an image file');
        return;
      }
  
      // Create FormData object
      const formDataToSend = new FormData();
  
      // Add the image file if selected
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }
  
      // Add form fields with proper type conversion
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('year', parseInt(formData.year));
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('description', (formData.description || '').trim());
      formDataToSend.append('available', formData.available);
  
      const token = localStorage.getItem("token");
  
      let response;
      if (editingId) {
        // Update existing vehicle
        response = await api.put(
          `/api/vehicles/${editingId}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          }
        );
        alert('Vehicle updated successfully!');
      } else {
        // Create new vehicle
        response = await api.post(
          '/api/vehicles',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
          }
        );
        alert('Vehicle added successfully!');
      }
  
      // Reset form
      setEditingId(null);
      setFormData({ name: '', brand: '', year: '', price: '', description: '', available: true });
      setSelectedFile(null);
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error saving vehicle. Please try again.';
      console.log('Full error response:', error.response?.data); // Add this for debugging
      alert(errorMessage);
    }
  };
  

  const handleEdit = (vehicle) => {
    setFormData({
      ...vehicle,
      year: vehicle.year.toString(),
      price: vehicle.price.toString()
    });
    setEditingId(vehicle._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this vehicle?')) {
        const token = localStorage.getItem("token");
        await api.delete(`/api/vehicles/${id}`);
        fetchVehicles();
        alert('Vehicle deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      alert('Failed to delete vehicle. Please try again.');
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl mb-10">
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Model Name"
          className="p-2 border rounded"
          required
        />
        <input
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Brand"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          placeholder="Year"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price"
          className="p-2 border rounded"
          required
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="p-2 border rounded"
          required={!editingId}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleInputChange}
          />
          <span>Available</span>
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Model' : 'Add Model'}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">All Models</h2>
      <div className="grid gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="border rounded p-4 flex justify-between items-start">
            <div>
              <img
                src={`${BACKEND_URL}${vehicle.imageUrl}`}
                alt={vehicle.name}
                className="w-32 h-32 object-cover mb-2 rounded"
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
                }}
              />
              <p><strong>{vehicle.brand} {vehicle.name}</strong> ({vehicle.year})</p>
              <p>LKR{vehicle.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{vehicle.description}</p>
              <p className={`text-sm ${vehicle.available ? 'text-green-600' : 'text-red-600'}`}>
                {vehicle.available ? 'Available' : 'Not Available'}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(vehicle)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(vehicle._id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
