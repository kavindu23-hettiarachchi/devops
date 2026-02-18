const Cart = require('../models/cart');
const Food = require('../models/food');

// Get cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    
    console.log('Add to cart request:', { userId, foodId, quantity });
    
    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID or quantity'
      });
    }
    
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({
        success: false,
        message: 'Food item not found'
      });
    }
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.foodId.toString() === foodId.toString());
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      cart.items.push({
        foodId,
        name: food.name,
        price: food.price,
        quantity,
        image: food.image,
        subtotal: quantity * food.price
      });
    }
    
    // Calculate total
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    console.log('Cart after save:', cart);
    
    res.json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Update cart quantity
exports.updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { foodId, quantity } = req.body;
    
    if (!foodId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid food ID or quantity'
      });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const item = cart.items.find(item => item.foodId.toString() === foodId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    item.quantity = quantity;
    item.subtotal = quantity * item.price;
    
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart updated',
      data: cart
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    cart.totalPrice = 0;
    cart.updatedAt = new Date();
    
    await cart.save();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
