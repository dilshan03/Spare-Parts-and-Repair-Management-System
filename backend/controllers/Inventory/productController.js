//productController.js

import SparePart from "../../models/Inventory/Product.js";
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import multer from 'multer';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, Date.now() + ext);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Add a new spare part with image upload
export const addSparePart = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const { name, description, quantity, price, condition, category, reorderLevel } = req.body;

        // Log the extracted values
        console.log('Extracted values:', {
            name, description, quantity, price, condition, category, reorderLevel
        });

        // Validate required fields
        if (!name || !description || !quantity || !price || !condition || !category || !reorderLevel) {
            return res.status(400).json({
                message: "Missing required fields",
                received: { name, description, quantity, price, condition, category, reorderLevel }
            });
        }

        // Create and save the spare part
        const sparePart = new SparePart({
            name,
            description,
            quantity: Number(quantity),
            price: Number(price),
            condition,
            category,
            reorderLevel: Number(reorderLevel),
            picture: req.file.filename
        });

        console.log('Spare part before save:', sparePart);

        const savedPart = await sparePart.save();
        console.log('Spare part after save:', savedPart);
        
        // Add the full URL to the response
        const partWithUrl = {
            ...savedPart.toObject(),
            picture: `http://localhost:5000/uploads/${req.file.filename}`
        };
        
        res.status(201).json(partWithUrl);
    } catch (error) {
        console.error('Error adding spare part:', error);
        console.error('Error stack:', error.stack);
        
        // If there was an error and a file was uploaded, delete it
        if (req.file) {
            try {
                await fs.promises.unlink(req.file.path);
                console.log('Cleaned up uploaded file:', req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file after failed upload:', unlinkError);
            }
        }

        // Send a more detailed error response
        res.status(500).json({
            error: error.message,
            details: error.stack,
            requestBody: req.body,
            fileInfo: req.file
        });
    }
};


// Get all spare parts with reorder level notification
export const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await SparePart.find();
        const sparePartsWithAlerts = spareParts.map(part => {
            const partObject = part.toObject();
            // Add the full URL for the picture
            const pictureUrl = partObject.picture ? `http://localhost:5000/uploads/${partObject.picture}` : null;

            return {
                ...partObject,
                picture: pictureUrl,
                reorderAlert: part.quantity <= part.reorderLevel ? "This item has reached the reorder level." : null
            };
        });
        res.status(200).json(sparePartsWithAlerts);
    } catch (error) {
        console.error('Error in getAllSpareParts:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get spare part by ID
export const getSparePartById = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id);
        console.log(sparePart);
        
        if (!sparePart) return res.status(404).json({ message: "Spare part not found" });
        res.status(200).json(sparePart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a spare part by ID
// Update spare part quantity and check reorder level
export const updateSparePart = async (req, res) => {
    try {
        const updatedPart = await SparePart.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedPart) {
            return res.status(404).json({ message: "Spare part not found" });
        }

        // Check if the stock is below reorder level
        if (updatedPart.quantity <= updatedPart.reorderLevel) {
            await sendReorderEmail(updatedPart);
        }

        res.status(200).json(updatedPart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a spare part by ID
export const deleteSparePart = async (req, res) => {
    try {
        const deletedPart = await SparePart.findByIdAndDelete(req.params.id);
        if (!deletedPart) return res.status(404).json({ message: "Spare part not found" });
        res.status(200).json({ message: "Spare part deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
