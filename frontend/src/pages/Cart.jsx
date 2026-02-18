import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FoodContext } from '../context/FoodContext';
import './Cart.css';

export default function Cart() {
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, updateCartQuantity } = useContext(FoodContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');

  if (!user) {
    return (
      <div className="cart-container">
        <div className="login-prompt">
          <h2>🔐 Please Login First</h2>
          <p>You need to login to view your cart</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      setNotification('Item removed from cart');
    } else {
      updateCartQuantity(foodId, newQuantity);
    }
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      setNotification('Add items to cart first');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      {notification && <div className="notification">{notification}</div>}

      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <button onClick={() => navigate('/')} className="continue-btn">
          ← Continue Shopping
        </button>
      </div>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">🛍️</div>
          <h2>Your cart is empty</h2>
          <p>Add delicious items from our menu</p>
          <button onClick={() => navigate('/')} className="shop-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.foodId} className="cart-item">
                <div className="item-image-container">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="item-image" />
                  ) : (
                    <div className="item-image-fallback">🍽️</div>
                  )}
                </div>

                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-price">₨ {item.price.toFixed(2)}</p>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() => handleQuantityChange(item.foodId, item.quantity - 1)}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.foodId, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  ₨ {item.subtotal.toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.foodId)}
                  className="remove-btn"
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({cart.items.length}):</span>
              <span>₨ {cart.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span className="delivery-fee">Free</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%):</span>
              <span>₨ {(cart.items.reduce((sum, item) => sum + item.subtotal, 0) * 0.05).toFixed(2)}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₨ {cart.totalPrice.toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            <button onClick={() => navigate('/')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
