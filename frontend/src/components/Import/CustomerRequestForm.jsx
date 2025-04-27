import { useState } from 'react';
import axios from 'axios';

const CustomerRequestForm = ({ vehicle, onRequestSubmitted }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        bank: ''
    });

    const banks = ['HNB', 'Sampath Bank', 'Commercial Bank', 'Peoples Bank'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const token = localStorage.getItem("token");
          const payload = { ...formData, vehicle: vehicle._id };
          const res = await axios.post(
            '/api/customer-requests',
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          alert('Request submitted!');
          if (onRequestSubmitted) onRequestSubmitted(res.data);
          setFormData({ name: '', email: '', phoneNumber: '', bank: '' });
        } catch (err) {
          alert('Error: ' + err.message);
        }
      };
      

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Request Vehicle</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
