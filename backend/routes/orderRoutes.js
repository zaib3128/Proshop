import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  deleteOrder,
  getOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Get logged-in user's orders
router.route('/myorders').get(protect, getMyOrders);

// Create order (user) & Get all orders (admin)
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// Get order by ID / Delete order (admin)
router.route('/:id')
  .get(protect, getOrderById)
  .delete(protect, admin, deleteOrder);

// Update order to paid
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Update order to delivered (admin)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
