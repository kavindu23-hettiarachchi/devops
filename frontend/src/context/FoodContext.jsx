import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch all foods
  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/foods');
      setFoods(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, clearing cart');
        setCart({ items: [], totalPrice: 0 });
        return;
      }
      const response = await axios.get('http://localhost:4000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Cart fetched:', response.data.data);
      const cartData = response.data.data || response.data;
      setCart({
        items: cartData?.items || [],
        totalPrice: cartData?.totalPrice || 0
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalPrice: 0 });
    }
  };

  // Add to cart
  const addToCart = async (foodId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return false;
      }
      
      console.log('Adding to cart:', { foodId, quantity });
      const response = await axios.post(
        'http://localhost:4000/api/cart/add',
        { foodId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Add to cart response:', response.data);
      
      // Update cart immediately with response data
      const cartData = response.data.data || response.data;
      setCart({
        items: cartData?.items || [],
        totalPrice: cartData?.totalPrice || 0
      });
      
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error.response?.data || error.message);
      alert('Error adding to cart: ' + (error.response?.data?.message || error.message));
      return false;
    }
  };

  // Remove from cart
  const removeFromCart = async (foodId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      console.log('Removing from cart:', foodId);
      const response = await axios.post(
        'http://localhost:4000/api/cart/remove',
        { foodId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Remove from cart response:', response.data);
      
      // Update cart immediately with response data
      const cartData = response.data.data || response.data;
      setCart({
        items: cartData?.items || [],
        totalPrice: cartData?.totalPrice || 0
      });
    } catch (error) {
      console.error('Error removing from cart:', error.response?.data || error.message);
    }
  };

  // Update cart quantity
  const updateCartQuantity = async (foodId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      console.log('Updating cart quantity:', { foodId, quantity });
      const response = await axios.post(
        'http://localhost:4000/api/cart/update',
        { foodId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Update cart response:', response.data);
      
      // Update cart immediately with response data
      const cartData = response.data.data || response.data;
      setCart({
        items: cartData?.items || [],
        totalPrice: cartData?.totalPrice || 0
      });
    } catch (error) {
      console.error('Error updating cart:', error.response?.data || error.message);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      await axios.post(
        'http://localhost:4000/api/cart/clear',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    fetchFoods();
    fetchCart();
  }, []);

  return (
    <FoodContext.Provider value={{
      foods,
      cart,
      loading,
      selectedCategory,
      setSelectedCategory,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      fetchCart,
      fetchFoods
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFoodContext = () => {
  const context = useContext(FoodContext);
  if (!context) {
    throw new Error('useFoodContext must be used within FoodProvider');
  }
  return context;
};
