import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Orders.css';

export default function Orders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setNotification('Failed to fetch orders');
      }
    } catch (err) {
      setNotification('Error fetching orders: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Cancelled' }),
      });

      if (response.ok) {
        setNotification('✅ Order cancelled successfully');
        fetchOrders();
      } else {
        setNotification('Failed to cancel order');
      }
    } catch (err) {
      setNotification('Error cancelling order: ' + err.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#FFA500',
      'Confirmed': '#4169E1',
      'Preparing': '#FF6B35',
      'Out for Delivery': '#9370DB',
      'Delivered': '#4CAF50',
      'Cancelled': '#FF0000',
    };
    return colors[status] || '#666';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'Pending': '⏳',
      'Confirmed': '✅',
      'Preparing': '👨‍🍳',
      'Out for Delivery': '🚴',
      'Delivered': '🎉',
      'Cancelled': '❌',
    };
    return emojis[status] || '📦';
  };

  if (!user) {
    return null;
  }

  return (
    <div className="orders-container">
      {notification && <div className="notification">{notification}</div>}

      <div className="orders-header">
        <h1>📦 My Orders</h1>
        <button onClick={() => navigate('/')} className="shop-btn">
          ← Continue Shopping
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <p>⏳ Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <div className="empty-icon">🛍️</div>
          <h2>No orders yet</h2>
          <p>Start ordering delicious food from our menu</p>
          <button onClick={() => navigate('/')} className="start-shopping-btn">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id-section">
                  <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">
                    📅 {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusEmoji(order.status)} {order.status}
                </div>
              </div>

              <div className="order-items">
                <h3>Items Ordered:</h3>
                <div className="items-list">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">₨ {item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span>📍 Delivery Address:</span>
                  <span>{order.deliveryAddress}</span>
                </div>
                <div className="detail-row">
                  <span>📞 Phone Number:</span>
                  <span>{order.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <span>💳 Payment Method:</span>
                  <span>{order.paymentMethod}</span>
                </div>
                {order.orderNotes && (
                  <div className="detail-row">
                    <span>📝 Special Instructions:</span>
                    <span>{order.orderNotes}</span>
                  </div>
                )}
              </div>

              <div className="order-footer">
                <div className="total-amount">
                  <span>Total:</span>
                  <span className="amount">₨ {order.totalPrice.toFixed(2)}</span>
                </div>
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="cancel-btn"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
