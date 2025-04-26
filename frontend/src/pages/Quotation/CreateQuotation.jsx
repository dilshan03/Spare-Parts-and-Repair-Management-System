import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const CreateQuotation = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    vehicleNumber: '',
    items: [{ itemName: '', quantity: 0, price: 0 }],
    repairs: [{ repairType: '', price: 0 }],
    discount: 0,
    totalAmount: 0,
    quotationDate: '', // 🆕 Add this line
  });

  const [quotationId, setQuotationId] = useState(null); // Store the created quotation ID
  const navigate = useNavigate(); // For navigation

  // Validation function for vehicle number
 const validateVehicleNumber = (value) => {
  const vehicleNumberRegex = /^(?:[A-Za-z0-9]{2,3}-\d{4}|[A-Za-z0-9]{1,2} SRI \d{4})$/;
  return vehicleNumberRegex.test(value);
};


  // Calculate total amount whenever items, repairs, or discount changes
  useEffect(() => {
    const itemsTotal = formData.items.reduce((sum, item) => {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      return sum + quantity * price;
    }, 0);

    const repairsTotal = formData.repairs.reduce((sum, repair) => {
      const price = Number(repair.price);
      return sum + price;
    }, 0);

    const total = itemsTotal + repairsTotal - Number(formData.discount);
    setFormData((prevData) => ({ ...prevData, totalAmount: total }));
  }, [formData.items, formData.repairs, formData.discount]);

  // Handle input changes for customer name, email, vehicle number, and discount
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount" && Number(value) < 0) return; // Prevent negative discount

    setFormData({ ...formData, [name]: value });
  };

  // Handle blur event for vehicle number validation
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "vehicleNumber" && value && !validateVehicleNumber(value)) {
      alert("Invalid vehicle number format. Use format: XX-1234, XXX-1234, XX SRI 1234, or X SRI 1234");
      setFormData((prevData) => ({ ...prevData, vehicleNumber: '' })); // Clear the field if invalid
    }
  };

  // Handle changes for items
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === 'itemName') {
      const newItems = [...formData.items];
      newItems[index][name] = value; // Handle item name as string
      setFormData({ ...formData, items: newItems });
    } else if (numValue >= 0) {
      const newItems = [...formData.items];
      newItems[index][name] = numValue;
      setFormData({ ...formData, items: newItems });
    }
  };

  // Handle changes for repairs
  const handleRepairChange = (index, e) => {
    const { name, value } = e.target;
    const numValue = Number(value);

    if (name === 'repairType') {
      const newRepairs = [...formData.repairs];
      newRepairs[index][name] = value; // Handle repair type as string
      setFormData({ ...formData, repairs: newRepairs });
    } else if (numValue >= 0) {
      const newRepairs = [...formData.repairs];
      newRepairs[index][name] = numValue;
      setFormData({ ...formData, repairs: newRepairs });
    }
  };

  // Add a new item field
  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', quantity: 0, price: 0 }],
    });
  };

  // Remove an item field
  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  // Add a new repair field
  const addRepair = () => {
    setFormData({
      ...formData,
      repairs: [...formData.repairs, { repairType: '', price: 0 }],
    });
  };

  // Remove a repair field
  const removeRepair = (index) => {
    const newRepairs = formData.repairs.filter((_, i) => i !== index);
    setFormData({ ...formData, repairs: newRepairs });
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem("token");//RY
  //     const response = await axios.post('http://localhost:5000/api/quotations', formData);
  //     setQuotationId(response.data._id); // Store the quotation ID
  //     alert('Quotation created successfully');
  //   } catch (err) {
  //     console.error('Error creating quotation:', err.response?.data || err.message);
  //     alert('Error creating quotation: ' + (err.response?.data?.error || err.message));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // RY
      const response = await axios.post(
        'http://localhost:5000/api/quotations',
        formData, // <-- Data object (quotation details)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token header
            "Content-Type": "application/json"
          }
        }
      );
      setQuotationId(response.data._id); // Store the quotation ID
      alert('Quotation created successfully');
      navigate('/quotations'); // Redirect to quotations page or another route
    } catch (err) {
      console.error('Error creating quotation:', err.response?.data || err.message);
      alert('Error creating quotation: ' + (err.response?.data?.error || err.message));
    }
  };
  
  

  // Send quotation email
  const sendEmail = async () => {
    if (!quotationId) {
      alert('No quotation created yet');
      return;
    }
    try {
      // const token = localStorage.getItem("token");//RY
      // await axios.post(`http://localhost:5000/api/quotations/send-email/${quotationId}`, {//RT
      //   headers: { Authorization: `Bearer ${token}` }
      // })//RY
      // alert('Email sent successfully');
      const token = localStorage.getItem("token"); // RY

      await axios.post(
        `http://localhost:5000/api/quotations/send-email/${quotationId}`, // RT
        {}, // 🛑 Second parameter = data object (empty {} if no data to send)
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ); // RY

      alert('Email sent successfully');


      // Reset the form only after the email is sent
      setFormData({
        customerName: '',
        customerEmail: '',
        vehicleNumber: '',
        items: [{ itemName: '', quantity: 0, price: 0 }],
        repairs: [{ repairType: '', price: 0 }],
        discount: 0,
        totalAmount: 0,
      });

      // Reset quotation ID after email is sent
      setQuotationId(null);
    } catch (err) {
      console.error('Error sending email:', err.response?.data || err.message);
      alert('Error sending email: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom>
        Create Quotation
      </Typography>
      <Grid container spacing={2}>
        {/* Customer Name */}
        <Grid item xs={12}>
          <TextField
            label="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Customer Email */}
        <Grid item xs={12}>
          <TextField
            label="Customer Email"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleInputChange}
            fullWidth
            required
          />
        </Grid>

        {/* Vehicle Number */}
        <Grid item xs={12}>
          <TextField
            label="Vehicle Number"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleInputChange}
            onBlur={handleBlur} // Add onBlur for validation
            fullWidth
            required
          />
        </Grid>

         {/* Quotation Date */}
         <Grid item xs={12}>
          <TextField
            label="Quotation Date"
            name="quotationDate"
            type="date"
            value={formData.quotationDate}
            onChange={handleInputChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Items */}
        <Grid item xs={12}>
          <Typography variant="h6">Items</Typography>
          {formData.items.map((item, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={5}>
                <TextField
                  label="Item Name"
                  name="itemName"
                  value={item.itemName}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Price (LKR)"
                  name="price"
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => removeItem(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addItem}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>
        </Grid>

        {/* Repairs */}
        <Grid item xs={12}>
          <Typography variant="h6">Repairs</Typography>
          {formData.repairs.map((repair, index) => (
            <Grid container spacing={2} key={index}>
              <Grid item xs={5}>
                <TextField
                  label="Repair Type"
                  name="repairType"
                  value={repair.repairType}
                  onChange={(e) => handleRepairChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Price (LKR)"
                  name="price"
                  type="number"
                  value={repair.price}
                  onChange={(e) => handleRepairChange(index, e)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => removeRepair(index)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={addRepair}
            sx={{ mt: 1 }}
          >
            Add Repair
          </Button>
        </Grid>

        {/* Discount */}
        <Grid item xs={12}>
          <TextField
            label="Discount (LKR)"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>

        {/* Total Amount */}
        <Grid item xs={12}>
          <Typography variant="h6">
            Total Amount: LKR {formData.totalAmount.toFixed(2)}
          </Typography>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Quotation
          </Button>
        </Grid>

        {/* Send Email Button */}
        {quotationId && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={sendEmail}
            >
              Send Quotation via Email
            </Button>
          </Grid>
        )}

        {/* View Quotation History Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate('/QuotationDash/quotations')}
          >
            View Quotation History
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreateQuotation;