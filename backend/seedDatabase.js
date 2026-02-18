const mongoose = require('mongoose');
const Food = require('./models/food');

const foodItems = [
    // Rice
    {
        name: 'Chicken Fried Rice',
        description: 'Delicious fried rice with tender chicken pieces, vegetables, and aromatic spices',
        category: 'Rice',
        price: 850,
        rating: 4.7,
        reviews: 234,
        image: '/uploads/chicken-fried-rice.jpg'
    },
    {
        name: 'Nasi Goreng',
        description: 'Indonesian style fried rice with egg, chicken, and special sambal sauce',
        category: 'Rice',
        price: 950,
        rating: 4.8,
        reviews: 189,
        image: '/uploads/nasi-goreng.jpg'
    },
    {
        name: 'Seafood Fried Rice',
        description: 'Premium fried rice loaded with fresh prawns, squid, and fish',
        category: 'Rice',
        price: 1200,
        rating: 4.6,
        reviews: 156,
        image: '/uploads/seafood-rice.jpg'
    },
    // Kottu
    {
        name: 'Chicken Kottu',
        description: 'Sri Lankan street food specialty with chopped roti, chicken, and spicy gravy',
        category: 'Kottu',
        price: 900,
        rating: 4.9,
        reviews: 312,
        image: '/uploads/chicken-kottu.jpg'
    },
    {
        name: 'Egg Kottu',
        description: 'Classic kottu with scrambled eggs and crispy chopped roti',
        category: 'Kottu',
        price: 700,
        rating: 4.5,
        reviews: 198,
        image: '/uploads/egg-kottu.jpg'
    },
    {
        name: 'Cheese Kottu',
        description: 'Indulgent kottu topped with melted cheese',
        category: 'Kottu',
        price: 1100,
        rating: 4.7,
        reviews: 221,
        image: '/uploads/cheese-kottu.jpg'
    },
    // Pizza
    {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil',
        category: 'Pizza',
        price: 1400,
        rating: 4.6,
        reviews: 267,
        image: '/uploads/margherita-pizza.jpg'
    },
    {
        name: 'Pepperoni Pizza',
        description: 'Loaded with spicy pepperoni and extra cheese',
        category: 'Pizza',
        price: 1600,
        rating: 4.8,
        reviews: 342,
        image: '/uploads/pepperoni-pizza.jpg'
    },
    {
        name: 'BBQ Chicken Pizza',
        description: 'Grilled chicken with BBQ sauce, onions, and bell peppers',
        category: 'Pizza',
        price: 1800,
        rating: 4.7,
        reviews: 289,
        image: '/uploads/bbq-chicken-pizza.jpg'
    },
    // Burger
    {
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, cheese, and special sauce',
        category: 'Burger',
        price: 800,
        rating: 4.6,
        reviews: 423,
        image: '/uploads/classic-burger.jpg'
    },
    {
        name: 'Chicken Burger',
        description: 'Crispy fried chicken fillet with mayo and fresh vegetables',
        category: 'Burger',
        price: 750,
        rating: 4.5,
        reviews: 356,
        image: '/uploads/chicken-burger.jpg'
    },
    {
        name: 'Double Cheese Burger',
        description: 'Two beef patties with double cheese and caramelized onions',
        category: 'Burger',
        price: 1200,
        rating: 4.9,
        reviews: 512,
        image: '/uploads/double-burger.jpg'
    },
    // Dessert
    {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten chocolate center, served with vanilla ice cream',
        category: 'Dessert',
        price: 650,
        rating: 4.9,
        reviews: 287,
        image: '/uploads/lava-cake.jpg'
    },
    {
        name: 'Watalappan',
        description: 'Traditional Sri Lankan coconut custard with jaggery and cardamom',
        category: 'Dessert',
        price: 400,
        rating: 4.7,
        reviews: 134,
        image: '/uploads/watalappan.jpg'
    },
    {
        name: 'Ice Cream Sundae',
        description: 'Three scoops of ice cream with chocolate sauce, nuts, and cherry',
        category: 'Dessert',
        price: 550,
        rating: 4.6,
        reviews: 198,
        image: '/uploads/ice-cream-sundae.jpg'
    },
    // Beverage
    {
        name: 'Fresh Lime Juice',
        description: 'Freshly squeezed lime with mint and soda water',
        category: 'Beverage',
        price: 250,
        rating: 4.5,
        reviews: 456,
        image: '/uploads/lime-juice.jpg'
    },
    {
        name: 'Mango Smoothie',
        description: 'Thick and creamy mango smoothie with yogurt',
        category: 'Beverage',
        price: 400,
        rating: 4.8,
        reviews: 312,
        image: '/uploads/mango-smoothie.jpg'
    },
    {
        name: 'Iced Coffee',
        description: 'Cold brew coffee with milk and ice cubes',
        category: 'Beverage',
        price: 350,
        rating: 4.6,
        reviews: 389,
        image: '/uploads/iced-coffee.jpg'
    },
    // Starter
    {
        name: 'Chicken Wings',
        description: 'Crispy buffalo wings with blue cheese dip',
        category: 'Starter',
        price: 600,
        rating: 4.7,
        reviews: 267,
        image: '/uploads/chicken-wings.jpg'
    },
    {
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls with sweet chili sauce',
        category: 'Starter',
        price: 450,
        rating: 4.5,
        reviews: 178,
        image: '/uploads/spring-rolls.jpg'
    },
    {
        name: 'Calamari Rings',
        description: 'Deep fried squid rings with tartar sauce',
        category: 'Starter',
        price: 850,
        rating: 4.8,
        reviews: 234,
        image: '/uploads/calamari.jpg'
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/demo';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing food items
        await Food.deleteMany({});
        console.log('Cleared existing food items');

        // Insert new food items
        const result = await Food.insertMany(foodItems);
        console.log(`Successfully added ${result.length} food items`);

        console.log('\nFood items by category:');
        const categories = ['Rice', 'Kottu', 'Pizza', 'Burger', 'Dessert', 'Beverage', 'Starter'];
        for (const category of categories) {
            const count = foodItems.filter(item => item.category === category).length;
            console.log(`  ${category}: ${count} items`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
