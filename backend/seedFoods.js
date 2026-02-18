// Run this file to seed the database with sample food items
// Use: node backend/seedFoods.js

const mongoose = require('mongoose');
require('dotenv').config();

const Food = require('./models/food');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedFoods = async () => {
  try {
    // Clear existing foods
    await Food.deleteMany({});
    console.log('🗑️  Cleared existing foods');

    const foods = [
      // Rice dishes
      {
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice cooked with tender chicken and aromatic spices',
        category: 'Rice',
        price: 450,
        image: null,
        rating: 4.8,
        reviews: 125,
        available: true
      },
      {
        name: 'Beef Pulao',
        description: 'Slow-cooked beef with rice and traditional spices',
        category: 'Rice',
        price: 520,
        image: null,
        rating: 4.7,
        reviews: 98,
        available: true
      },
      {
        name: 'Vegetable Biryani',
        description: 'Mixed vegetables with aromatic rice',
        category: 'Rice',
        price: 380,
        image: null,
        rating: 4.5,
        reviews: 76,
        available: true
      },
      // Kottu dishes
      {
        name: 'Chicken Kottu',
        description: 'Shredded roti with spiced chicken and vegetables',
        category: 'Kottu',
        price: 320,
        image: null,
        rating: 4.9,
        reviews: 156,
        available: true
      },
      {
        name: 'Beef Kottu',
        description: 'Crispy kottu with tender beef and peppers',
        category: 'Kottu',
        price: 380,
        image: null,
        rating: 4.8,
        reviews: 134,
        available: true
      },
      {
        name: 'Vegetable Kottu',
        description: 'Delicious mix of vegetables in kottu',
        category: 'Kottu',
        price: 280,
        image: null,
        rating: 4.6,
        reviews: 92,
        available: true
      },
      // Pizza
      {
        name: 'Margherita Pizza',
        description: 'Fresh mozzarella, tomato sauce, and basil',
        category: 'Pizza',
        price: 550,
        image: null,
        rating: 4.7,
        reviews: 189,
        available: true
      },
      {
        name: 'Pepperoni Pizza',
        description: 'Classic pepperoni with cheese',
        category: 'Pizza',
        price: 600,
        image: null,
        rating: 4.9,
        reviews: 267,
        available: true
      },
      {
        name: 'Chicken Tikka Pizza',
        description: 'Marinated chicken tikka on pizza base',
        category: 'Pizza',
        price: 650,
        image: null,
        rating: 4.8,
        reviews: 142,
        available: true
      },
      {
        name: 'Veggie Supreme',
        description: 'Bell peppers, mushrooms, olives, and onions',
        category: 'Pizza',
        price: 500,
        image: null,
        rating: 4.6,
        reviews: 115,
        available: true
      },
      // Burgers
      {
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese',
        category: 'Burger',
        price: 380,
        image: null,
        rating: 4.8,
        reviews: 203,
        available: true
      },
      {
        name: 'Chicken Burger',
        description: 'Crispy fried chicken breast burger',
        category: 'Burger',
        price: 350,
        image: null,
        rating: 4.7,
        reviews: 167,
        available: true
      },
      {
        name: 'Double Beef Burger',
        description: 'Two beef patties with extra cheese',
        category: 'Burger',
        price: 480,
        image: null,
        rating: 4.9,
        reviews: 198,
        available: true
      },
      {
        name: 'Veggie Burger',
        description: 'Plant-based patty with fresh vegetables',
        category: 'Burger',
        price: 320,
        image: null,
        rating: 4.5,
        reviews: 89,
        available: true
      },
      // Desserts
      {
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake',
        category: 'Dessert',
        price: 180,
        image: null,
        rating: 4.9,
        reviews: 276,
        available: true
      },
      {
        name: 'Cheesecake',
        description: 'Creamy New York style cheesecake',
        category: 'Dessert',
        price: 220,
        image: null,
        rating: 4.8,
        reviews: 142,
        available: true
      },
      {
        name: 'Ice Cream Sundae',
        description: 'Vanilla ice cream with chocolate sauce',
        category: 'Dessert',
        price: 150,
        image: null,
        rating: 4.7,
        reviews: 198,
        available: true
      },
      // Beverages
      {
        name: 'Mango Shake',
        description: 'Fresh mango blended with milk',
        category: 'Beverage',
        price: 120,
        image: null,
        rating: 4.8,
        reviews: 234,
        available: true
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew coffee with ice',
        category: 'Beverage',
        price: 100,
        image: null,
        rating: 4.6,
        reviews: 145,
        available: true
      },
      {
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice',
        category: 'Beverage',
        price: 110,
        image: null,
        rating: 4.7,
        reviews: 167,
        available: true
      },
      // Starters
      {
        name: 'Samosa',
        description: 'Crispy pastry with spiced potato filling',
        category: 'Starter',
        price: 80,
        image: null,
        rating: 4.8,
        reviews: 267,
        available: true
      },
      {
        name: 'Chicken Wings',
        description: 'Spicy grilled chicken wings',
        category: 'Starter',
        price: 280,
        image: null,
        rating: 4.9,
        reviews: 189,
        available: true
      },
      {
        name: 'Spring Rolls',
        description: 'Crispy rolls with vegetable filling',
        category: 'Starter',
        price: 150,
        image: null,
        rating: 4.7,
        reviews: 124,
        available: true
      }
    ];

    const result = await Food.insertMany(foods);
    console.log(`✅ Seeded ${result.length} food items`);
    console.log('\n📊 Food Items by Category:');
    
    const categories = {};
    result.forEach(food => {
      if (!categories[food.category]) {
        categories[food.category] = 0;
      }
      categories[food.category]++;
    });
    
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} items`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding foods:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedFoods();
});
