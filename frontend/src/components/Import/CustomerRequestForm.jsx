import { useState } from 'react';
import api from '../../api/axios.js';

const CustomerRequestForm = ({ onClose, vehicle }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bank: '',
        vehicle: vehicle?._id || undefined
    });

    const [errors, setErrors] = useState({});

    const banks = ['HNB', 'Sampath Bank', 'Commercial Bank', 'Peoples Bank'];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
        if (!formData.bank) newErrors.bank = 'Bank is required';

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
            const requestData = { ...formData };
            
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
                        <option value="">Select bank</option>
                        {banks.map((bank) => (
                            <option key={bank} value={bank}>{bank}</option>
                        ))}
                    </select>
                    {errors.bank && (
                        <p className="mt-1 text-sm text-red-500">{errors.bank}</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Submit Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerRequestForm;
