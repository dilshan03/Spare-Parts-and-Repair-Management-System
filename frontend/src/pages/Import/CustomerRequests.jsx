import { useState, useEffect } from 'react';
import api from '../../api/axios.js';

const CustomerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await api.get('/api/customer-requests');
                setRequests(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <div className="text-center mt-8">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Customer Requests</h1>
            <div className="grid gap-6">
                {requests.map((req) => (
                    <div key={req._id} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                                <p><b>Name:</b> {req.name}</p>
                                <p><b>Email:</b> {req.email}</p>
                                <p><b>Phone:</b> {req.phoneNumber}</p>
                                <p><b>Bank:</b> {req.bank}</p>
                                <p><b>Date:</b> {new Date(req.requestDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Vehicle Details</h3>
                                {req.vehicle ? (
                                    <>
                                        <p><b>Name:</b> {req.vehicle.name}</p>
                                        <p><b>Brand:</b> {req.vehicle.brand}</p>
                                        <p><b>Year:</b> {req.vehicle.year}</p>
                                        <p><b>Price:</b> {req.vehicle.price}</p>
                                    </>
                                ) : <p>Vehicle info not found.</p>}
                            </div>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <p className="text-center text-gray-500">No customer requests found.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerRequests;
