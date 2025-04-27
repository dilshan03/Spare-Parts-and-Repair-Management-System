import express from 'express';
import CustomerRequest from '../models/CustomerRequest.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, phoneNumber, bank, vehicle } = req.body;
        if (!name || !email || !phoneNumber || !bank || !vehicle) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const customerRequest = new CustomerRequest(req.body);
        const savedRequest = await customerRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
