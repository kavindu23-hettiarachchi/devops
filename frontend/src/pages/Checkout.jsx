import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FoodContext } from '../context/FoodContext';
import './Checkout.css';

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(FoodContext);
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phoneNumber: '',
    paymentMethod: 'Cash',
    orderNotes: '',
  });

  if (!user) {
    return (
      <div className="checkout-container">
        <div className="login-prompt">
          <h2>🔐 Please Login First</h2>
          <p>You need to login to checkout</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-prompt">
          <h2>🛒 Your cart is empty</h2>
          <p>Add items before checking out</p>
          <button onClick={() => navigate('/')} className="shop-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.deliveryAddress.trim()) {
      setNotification('Please enter delivery address');
      setLoading(false);
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setNotification('Please enter phone number');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.items,
          totalPrice: cart.totalPrice,
          deliveryAddress: formData.deliveryAddress,
          phoneNumber: formData.phoneNumber,
          paymentMethod: formData.paymentMethod,
          orderNotes: formData.orderNotes,
        }),
      });

      if (response.ok) {
        const order = await response.json();
        setNotification('✅ Order placed successfully!');
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        const error = await response.json();
        setNotification(error.message || 'Failed to place order');
      }
    } catch (err) {
      setNotification('Error placing order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTax = () => {
    return cart.items.reduce((sum, item) => sum + item.subtotal, 0) * 0.05;
  };

  return (
    <div className="checkout-container">
      {notification && <div className="notification">{notification}</div>}

      <div className="checkout-header">
        <h1>📦 Checkout</h1>
        <button onClick={() => navigate('/cart')} className="back-btn">
          ← Back to Cart
        </button>
      </div>

      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Delivery Details</h2>

          <div className="form-group">
            <label htmlFor="deliveryAddress">Delivery Address *</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Enter your complete delivery address"
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="03001234567"
              required
            />
          </div>

          <h2 style={{ marginTop: '30px' }}>Payment Method</h2>

          <div className="payment-options">
            {['Cash', 'Card', 'Online'].map((method) => (
              <label key={method} className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                />
                <span className="radio-label">{method}</span>
              </label>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="orderNotes">Special Instructions (Optional)</label>
            <textarea
              id="orderNotes"
              name="orderNotes"
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Any special requests? (e.g., Extra spicy, No onions...)"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={loading}
          >
            {loading ? '⏳ Placing Order...' : '✓ Place Order'}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {cart.items.map((item) => (
              <div key={item.foodId} className="summary-item">
                <div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="item-price">₨ {item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-line">
            <span>Subtotal:</span>
            <span>₨ {cart.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Tax (5%):</span>
            <span>₨ {calculateTax().toFixed(2)}</span>
          </div>

          <div className="summary-line">
            <span>Delivery Fee:</span>
            <span className="free">Free</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-line total">
            <span>Total Amount:</span>
            <span>₨ {cart.totalPrice.toFixed(2)}</span>
          </div>

          <div className="payment-info">
            <p>💳 Payment Method: <strong>{formData.paymentMethod}</strong></p>
            {formData.paymentMethod === 'Cash' && (
              <p className="note">Pay cash when your order arrives</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
