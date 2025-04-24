import express from 'express';
import ProfitLoss from '../models/ProfitLoss.js';

const router = express.Router();

// Route to add a new profit & loss entry
router.post('/add', async (req, res) => {
    try {
        const { revenue, expenses, netProfit } = req.body;
        
        const newProfitLossEntry = new ProfitLoss({ revenue, expenses, netProfit });
        await newProfitLossEntry.save();
        res.status(201).send('Profit & Loss Entry Added');
    } catch (error) {
        res.status(500).send('Error adding profit & loss entry: ' + error.message);
    }
});

// Route to get all profit & loss entries
router.get('/', async (req, res) => {
    try {
        const profitLoss = await ProfitLoss.find();
        res.json(profitLoss);
    } catch (error) {
        res.status(500).send('Error fetching profit & loss entries: ' + error.message);
    }
});

export default router;
