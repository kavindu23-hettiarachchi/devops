#!/usr/bin/env node

// Quick script to check if cart data is in MongoDB
require('dotenv').config();
const mongoose = require('mongoose');
const Cart = require('./models/cart');
const User = require('./models/user');

const checkDatabase = async () => {
  try {
    console.log('\n📊 DATABASE CHECK STARTED...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Check users
    const userCount = await User.countDocuments();
    console.log(`\n👥 Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const users = await User.find().select('_id username email').limit(5);
      console.log('Sample users:');
      users.forEach(u => console.log(`  - ${u.username} (ID: ${u._id})`));
    }
    
    // Check carts
    const cartCount = await Cart.countDocuments();
    console.log(`\n🛒 Carts in database: ${cartCount}`);
    
    if (cartCount > 0) {
      const carts = await Cart.find().populate('userId', 'username').limit(5);
      console.log('\nCarts details:');
      carts.forEach((cart, idx) => {
        const username = cart.userId?.username || 'Unknown';
        console.log(`\n  Cart ${idx + 1}:`);
        console.log(`    User: ${username}`);
        console.log(`    Items: ${cart.items.length}`);
        console.log(`    Total: ${cart.totalPrice}`);
        if (cart.items.length > 0) {
          cart.items.forEach((item, i) => {
            console.log(`      Item ${i + 1}: ${item.name} x${item.quantity} = ${item.subtotal}`);
          });
        }
      });
    } else {
      console.log('\n⚠️  No carts found! Cart data might not be saving.');
    }
    
    // Raw MongoDB check
    console.log('\n\n📋 RAW DATABASE CHECK:');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`Collections in database: ${collections.map(c => c.name).join(', ')}`);
    
    // Check if carts collection exists
    const cartsExist = collections.some(c => c.name === 'carts');
    if (!cartsExist) {
      console.log('⚠️  WARNING: "carts" collection does NOT exist!');
    } else {
      console.log('✅ "carts" collection exists');
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Check complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkDatabase();
