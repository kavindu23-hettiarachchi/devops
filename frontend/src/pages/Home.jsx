import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFoodContext } from '../context/FoodContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { foods, loading, selectedCategory, setSelectedCategory, addToCart } = useFoodContext();
  const [notification, setNotification] = useState('');

  const categories = ['All', 'Rice', 'Kottu', 'Pizza', 'Burger', 'Dessert', 'Beverage', 'Starter'];

  const filteredFoods = selectedCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category === selectedCategory);

  const handleAddToCart = (foodId) => {
    console.log('Clicked add to cart for food:', foodId);
    const success = addToCart(foodId, 1);
    if (success !== false) {
      setNotification('Added to cart! ✅');
      setTimeout(() => setNotification(''), 2000);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">Faster implementation</span>
          <h1 className="hero-title">Experience the <span className="highlight">Taste</span> of Quality</h1>
          <p className="hero-subtitle">Delivered to your doorstep in minutes. Fresh, hot, and delicious.</p>
          <div className="hero-buttons">
            <button className="cta-btn" onClick={() => document.querySelector('.foods-section').scrollIntoView({ behavior: 'smooth' })}>Order Now</button>
            <button className="secondary-btn">View Menu</button>
          </div>
        </div>
        <div className="hero-image-wrapper">
           <div className="hero-circle"></div>
           {/* Placeholder for hero image if we had one, using CSS shape for now */}
        </div>
      </section>

      {/* Notification */}
      {notification && (
        <div className="notification-toast">
          {notification}
        </div>
      )}

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
           <h2 className="section-title">Browse Categories</h2>
           <p className="section-subtitle">Select from our wide range of delicious options</p>
        </div>
        
        <div className="categories-scroll">
          {categories.map(category => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Foods Grid */}
      <section className="foods-section">
        <h2 className="section-title">
          {selectedCategory === 'All' ? 'Popular Items' : selectedCategory}
        </h2>
        
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your cravings...</p>
          </div>
        ) : filteredFoods.length === 0 ? (
          <div className="no-items">
            <p>No items available in this category yet.</p>
          </div>
        ) : (
          <div className="foods-grid">
            {filteredFoods.map(food => (
              <div key={food._id} className="food-card">
                <div className="food-image-container">
                  <img 
                    src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={food.name}
                    className="food-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                    }}
                  />
                  <span className="rating-badge">
                    ⭐ {food.rating || '4.5'}
                  </span>
                </div>
                
                <div className="food-info">
                  <div className="food-header">
                    <h3 className="food-name">{food.name}</h3>
                    <span className="food-price">₨ {food.price}</span>
                  </div>
                  <p className="food-description">{food.description || 'Delicious meal prepared with fresh ingredients.'}</p>
                  
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(food._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Promo Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Free Delivery</h3>
          <p>On all orders above ₨ 500</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Fast Delivery</h3>
          <p>30-45 minutes guaranteed</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Secure Payment</h3>
          <p>100% safe and secure</p>
        </div>
      </section>
    </div>
  );
};

export default Home;