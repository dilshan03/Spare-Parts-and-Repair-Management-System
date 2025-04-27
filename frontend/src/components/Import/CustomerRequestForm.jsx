import { useState } from 'react';
import api from '../../api/axios.js';

const CustomerRequestForm = ({ onClose, vehicle }) => {
    const [formData, setFormData] = useState({
        vehicleType: vehicle?.type || '',
        preferredBrand: vehicle?.brand || '',
        budget: '',
        name: '',
        email: '',
        phoneNumber: '',
        bank: '',
        vehicle: vehicle?._id || undefined
    });

    const [errors, setErrors] = useState({});

    const banks = ['HNB', 'Sampath Bank', 'Commercial Bank', 'Peoples Bank'];
    const vehicleTypes = ['Car', 'SUV', 'Van', 'Truck'];
    const carBrands = ['Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.bank) newErrors.bank = 'Bank is required';
        if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
        if (!formData.preferredBrand) newErrors.preferredBrand = 'Preferred brand is required';
        if (!formData.budget) newErrors.budget = 'Budget is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Convert budget to number and prepare request data
            const requestData = {
                ...formData,
                budget: Number(formData.budget)
            };
            
            // Remove vehicle field if it's undefined
            if (!requestData.vehicle) {
                delete requestData.vehicle;
            }

            console.log('Submitting request data:', requestData);
            const response = await api.post('/api/customer-requests', requestData);
            console.log('Server response:', response.data);
            
            alert('Request submitted successfully!');
            onClose();
        } catch (err) {
            console.error('Error details:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message;
            alert('Error submitting request: ' + errorMessage);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Request Vehicle Import</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select
                        name="vehicleType"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.vehicleType ? 'border-red-500' : ''
                        }`}
                    >
                        <option value="">Select vehicle type</option>
                        {vehicleTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    {errors.vehicleType && (
                        <p className="mt-1 text-sm text-red-500">{errors.vehicleType}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Brand</label>
                    <select
                        name="preferredBrand"
                        value={formData.preferredBrand}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.preferredBrand ? 'border-red-500' : ''
                        }`}
                    >
                        <option value="">Select preferred brand</option>
                        {carBrands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    {errors.preferredBrand && (
                        <p className="mt-1 text-sm text-red-500">{errors.preferredBrand}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Budget (LKR)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        min="0"
                        step="1000"
                        placeholder="Enter your budget in LKR"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.budget ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.budget && (
                        <p className="mt-1 text-sm text-red-500">{errors.budget}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.name ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.email ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.phoneNumber ? 'border-red-500' : ''
                        }`}
                    />
                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Bank</label>
                    <select
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
                        required
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                            errors.bank ? 'border-red-500' : ''
                        }`}
                    >
                        <option value="">Select a bank</option>
                        {banks.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    {errors.bank && (
                        <p className="mt-1 text-sm text-red-500">{errors.bank}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default CustomerRequestForm;
