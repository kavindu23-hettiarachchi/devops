const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getUserOrders, getOrderById, createOrder, updateOrderStatus, cancelOrder } = require('../controllers/orderController');

router.get('/', auth, getUserOrders);
router.get('/:id', auth, getOrderById);
router.post('/', auth, createOrder);
router.put('/:id/status', updateOrderStatus); // Admin
router.put('/:id/cancel', auth, cancelOrder);

module.exports = router;
