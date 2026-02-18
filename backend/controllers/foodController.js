const Food = require('../models/food');

// Get all foods
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find({ available: true });
    res.json({
      success: true,
      data: foods
    });
  } catch (error) {
    console.error('Get foods error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching foods',
      error: error.message
    });
  }
};

// Get foods by category
exports.getFoodsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const foods = await Food.find({ 
      category: category,
      available: true 
    });
    res.json({
      success: true,
      data: foods
    });
  } catch (error) {
    console.error('Get foods by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching foods',
      error: error.message
    });
  }
};

// Get single food
exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    res.json({
      success: true,
      data: food
    });
  } catch (error) {
    console.error('Get food error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching food',
      error: error.message
    });
  }
};

// Create food (admin)
exports.createFood = async (req, res) => {
  try {
    const { name, description, category, price, image, rating, reviews } = req.body;
    
    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    const food = new Food({
      name,
      description,
      category,
      price,
      image,
      rating: rating || 4.5,
      reviews: reviews || 0
    });
    
    await food.save();
    
    res.status(201).json({
      success: true,
      message: 'Food item created successfully',
      data: food
    });
  } catch (error) {
    console.error('Create food error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating food item',
      error: error.message
    });
  }
};

// Update food (admin)
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, image, available, rating } = req.body;
    
    const food = await Food.findByIdAndUpdate(
      id,
      { name, description, category, price, image, available, rating },
      { new: true, runValidators: true }
    );
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Food item updated successfully',
      data: food
    });
  } catch (error) {
    console.error('Update food error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating food item',
      error: error.message
    });
  }
};

// Delete food (admin)
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findByIdAndDelete(id);
    
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Food item deleted successfully'
    });
  } catch (error) {
    console.error('Delete food error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting food item',
      error: error.message
    });
  }
};
