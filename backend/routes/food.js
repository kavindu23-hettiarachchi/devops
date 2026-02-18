const express = require('express');
const router = express.Router();
const { getAllFoods, getFoodsByCategory, getFoodById, createFood, updateFood, deleteFood } = require('../controllers/foodController');

// Public routes
router.get('/', getAllFoods);
router.get('/category/:category', getFoodsByCategory);
router.get('/:id', getFoodById);

// Admin routes (add auth middleware later)
router.post('/', createFood);
router.put('/:id', updateFood);
router.delete('/:id', deleteFood);

module.exports = router;
