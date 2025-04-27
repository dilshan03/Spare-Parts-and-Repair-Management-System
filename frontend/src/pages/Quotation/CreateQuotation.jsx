import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, Typography, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

const CreateQuotation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token'); // 🔥 get token from localStorage

  // 🔥 Get today's date in yyyy-mm-dd format
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    vehicleNumber: '',
    items: [{ itemName: '', quantity: 0, price: 0 }],
    repairs: [{ repairType: '', price: 0 }],
    discount: 0,
    totalAmount: 0,
    quotationDate: getTodayDateString(), // 🔥 default to today
  });

  const [quotationId, setQuotationId] = useState(null);

  // Validate vehicle number format
  const validateVehicleNumber = (value) => {
    const vehicleNumberRegex = /^(?:[A-Za-z0-9]{2,3}-\d{4}|[A-Za-z0-9]{1,2} SRI \d{4})$/;
    return vehicleNumberRegex.test(value);
  };

  // Recalculate total amount whenever items, repairs, or discount change
  useEffect(() => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);
    const repairsTotal = formData.repairs.reduce((sum, repair) => sum + Number(repair.price), 0);
    const total = itemsTotal + repairsTotal - Number(formData.discount);

    if (total < 0) {
      alert('Total amount cannot be negative.');
      setFormData((prevData) => ({ ...prevData, totalAmount: 0 }));
    } else {
      setFormData((prevData) => ({ ...prevData, totalAmount: total }));
    }
  }, [formData.items, formData.repairs, formData.discount]);

  // Handle simple field input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'discount' && Number(value) < 0) return; // prevent negative discount
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleNumber' && value && !validateVehicleNumber(value)) {
      alert('Invalid vehicle number format. Use format: XX-1234, XXX-1234, XX SRI 1234, or X SRI 1234');
      setFormData((prevData) => ({ ...prevData, vehicleNumber: '' }));
    }
  };

  // Handle changes for items array
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index][name] = name === 'itemName' ? value : Number(value);
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { itemName: '', quantity: 0, price: 0 }] });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  // Handle changes for repairs array
  const handleRepairChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRepairs = [...formData.repairs];
    updatedRepairs[index][name] = name === 'repairType' ? value : Number(value);
    setFormData({ ...formData, repairs: updatedRepairs });
  };

  const addRepair = () => {
    setFormData({ ...formData, repairs: [...formData.repairs, { repairType: '', price: 0 }] });
  };

  const removeRepair = (index) => {
    const updatedRepairs = formData.repairs.filter((_, i) => i !== index);
    setFormData({ ...formData, repairs: updatedRepairs });
  };

  // 🔥 Submit form with Today's Date Validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Unauthorized! Please login.');
      navigate('/login');
      return;
    }

    // Validate: quotationDate must be today's date
    const today = new Date();
    const enteredDate = new Date(formData.quotationDate);
    today.setHours(0, 0, 0, 0);
    enteredDate.setHours(0, 0, 0, 0);

    if (enteredDate.getTime() !== today.getTime()) {
      alert('Quotation date must be today\'s date.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/quotations', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQuotationId(response.data._id);
      alert('Quotation created successfully');
    } catch (err) {
      console.error('Error creating quotation:', err.response?.data || err.message);
      alert('Error creating quotation: ' + (err.response?.data?.error || err.message));
    }
  };

  // Send quotation via email
  const sendEmail = async () => {
    if (!quotationId) {
      alert('No quotation created yet');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/quotations/send-email/${quotationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Email sent successfully');

      // Reset form after email
      setFormData({
        customerName: '',
        customerEmail: '',
        vehicleNumber: '',
        items: [{ itemName: '', quantity: 0, price: 0 }],
        repairs: [{ repairType: '', price: 0 }],
        discount: 0,
        totalAmount: 0,
        quotationDate: getTodayDateString(),
      });
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
            onBlur={handleBlur}
            fullWidth
            required
          />
        </Grid>

        {/* Quotation Date (auto-filled + disabled) */}
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
            disabled // 🔥 Prevent user from changing it
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

        {/* Total */}
        <Grid item xs={12}>
          <Typography variant="h6">
            Total Amount: LKR {formData.totalAmount.toFixed(2)}
          </Typography>
        </Grid>

        {/* Submit */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Quotation
          </Button>
        </Grid>

        {/* Send Email */}
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

        {/* View Quotations */}
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
