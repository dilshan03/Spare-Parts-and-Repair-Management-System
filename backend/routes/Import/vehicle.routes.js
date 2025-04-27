import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import VehicleModel from '../models/VehicleModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif/;
    const isValid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
    cb(isValid ? null : 'Error: Images only!', isValid);
  }
});

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const vehicles = await VehicleModel.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    const { name, brand, year, price, description = '', available = true } = req.body;
    const yearNum = parseInt(year);
    const priceNum = parseFloat(price);

    if (!name || !brand || isNaN(yearNum) || isNaN(priceNum)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const vehicle = new VehicleModel({
      name,
      brand,
      year: yearNum,
      price: priceNum,
      description,
      available: available === 'true',
      imageUrl: `/uploads/${req.file.filename}`
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a vehicle
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, year, price, description, available } = req.body;
    const yearNum = parseInt(year);
    const priceNum = parseFloat(price);

    if (!name || !brand || isNaN(yearNum) || isNaN(priceNum)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }

    const updateData = {
      name,
      brand,
      year: yearNum,
      price: priceNum,
      description,
      available: available === 'true'
    };

    // Update image if a new one is uploaded
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const vehicle = await VehicleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a vehicle
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await VehicleModel.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
