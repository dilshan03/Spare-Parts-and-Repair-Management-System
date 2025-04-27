import { useState } from 'react';
import api from '../../api/axios.js';

const CustomerRequestForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        vehicleType: '',
        preferredBrand: '',
        budget: '',
        name: '',
        email: '',
        phoneNumber: '',
        bank: ''
    });

    const banks = ['HNB', 'Sampath Bank', 'Commercial Bank', 'Peoples Bank'];
    const vehicleTypes = ['Car', 'SUV', 'Van', 'Truck'];
    const carBrands = ['Toyota', 'Honda', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/api/customer-requests', formData);
            alert('Request submitted successfully!');
            onClose();
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            alert('Error submitting request: ' + errorMessage);
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
                        onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select vehicle type</option>
                        {vehicleTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Preferred Brand</label>
                    <select
                        name="preferredBrand"
                        value={formData.preferredBrand}
                        onChange={(e) => setFormData({ ...formData, preferredBrand: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select preferred brand</option>
                        {carBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Budget (LKR)</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                        placeholder="Enter your budget in LKR"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {['name', 'email', 'phoneNumber'].map((field) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                        <input
                            type={field === 'email' ? 'email' : field === 'phoneNumber' ? 'tel' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                ))}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bank</label>
                    <select
                        name="bank"
                        value={formData.bank}
                        onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Select a bank</option>
                        {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default CustomerRequestForm;
