import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

// Update Product Component
const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        picture: "",
        quantity: "" // Add quantity field to form data
    });

    useEffect(() => {
        // Fetch the product data by ID
        axios.get(`http://localhost:5000/api/spareparts/${id}`).then((response) => {
            setFormData(response.data);
        }).catch((error) => {
            console.error("Error fetching product:", error);
        });
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the updated data to the backend (including quantity)y
            await axios.put(`http://localhost:5000/api/spareparts/${id}`, formData);
            navigate("/manageInventory");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="d-flex" style={{ height: '100vh' }}>
            {/* Sidebar */}
            <div className="bg-primary text-white p-4 d-flex flex-column" style={{ width: '250px', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
                {/* Inventory Logo */}
                <div className="text-center mb-5">
                    <img src="/images/inventory-logo.jpg" alt="Inventory Logo" style={{ width: '80%', height: 'auto' }} />
                </div>

                {/* Navigation Menu */}
                <ul className="list-unstyled flex-grow-1">
                    <li className="mb-4"><a href="/addProducts" className="text-white text-decoration-none fs-5">Add Inventory</a></li>
                    <li className="mb-4"><a href="/manageInventory" className="text-white text-decoration-none fs-5">Manage Inventory</a></li>
                    <li className="mb-4"><a href="/viewInventory" className="text-white text-decoration-none fs-5">View Inventory</a></li>
                    <li className="mb-4"><a href="/reports" className="text-white text-decoration-none fs-5">Inventory Reports</a></li>
                    <li className="mb-4"><a href="/inventoryHome" className="text-white text-decoration-none fs-5">Main Inventory</a></li>
                </ul>

                {/* Background Image at Bottom */}
                <div className="mt-auto">
                    <img src="/images/sidebar-bg.jpg" alt="Sidebar Background" style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '10px' }} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow-1 p-4" style={{ marginLeft: '250px' }}>
                <h1 className="text-primary mb-4">Update Spare Part</h1>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: '500px' }}>
                    <h2 className="h5 text-primary mb-4">Update Product</h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Category"
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Price"
                            className="form-control"
                            required
                        />
                    </div>
                    {/* Added input for quantity */}
                    <div className="mb-3">
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Quantity"
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProduct;
