const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Payment = require('../../models/Finance/Payment'); // Assuming a Payment model is created
const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Process Payment
router.post('/process-payment', upload.single('bankSlip'), async (req, res) => {
    try {
        const { customerName, email, cardNumber, cvc, amount, paymentMethod } = req.body;
        let paymentStatus = "Failed";
        let bankSlipFile = req.file ? req.file.path : null;

        if (paymentMethod === "Cash on Delivery") {
            paymentStatus = "Processing";
        } else if (paymentMethod === "Online Bank Slip" && bankSlipFile) {
            paymentStatus = "Pending";
        } else if (paymentMethod === "Credit Card" || paymentMethod === "Debit Card") {
            // Validate card (check with mock database)
            const storedCard = await Payment.findOne({ cardNumber, cvc });
            if (storedCard && storedCard.amount >= amount) {
                paymentStatus = "Successful";
            }
        }

        // Save payment record
        const payment = new Payment({ customerName, email, amount, paymentMethod, paymentStatus, bankSlip: bankSlipFile });
        await payment.save();

        // Send Email Receipt
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Payment Confirmation',
            text: `Dear ${customerName}, your payment of $${amount} is ${paymentStatus}. Thank you!`
        };
        transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Payment ${paymentStatus}` });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error });
    }
});

// Update Payment Status (Admin)
router.put('/update-payment/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await Payment.findByIdAndUpdate(req.params.id, { paymentStatus: status }, { new: true });
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating payment status' });
    }
});

module.exports = router;
