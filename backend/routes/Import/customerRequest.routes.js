import express from 'express';
import CustomerRequest from '../../models/Import/CustomerRequest.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, phoneNumber, bank } = req.body;
        
        // Check required fields
        if (!name || !email || !phoneNumber || !bank) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['name', 'email', 'phoneNumber', 'bank'],
                received: req.body
            });
        }

        const customerRequest = new CustomerRequest(req.body);
        const savedRequest = await customerRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ 
            message: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : undefined
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const requests = await CustomerRequest.find().populate('vehicle');
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
