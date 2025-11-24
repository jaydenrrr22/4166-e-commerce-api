import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeOrderOwnership } from '../middleware/authorizeOwnership.js';

const router = express.Router();

// Get all orders for user/admin
router.get('/', authenticate, orderController.getOrdersHandler);

// Get a single order
router.get('/:id', authenticate, authorizeOrderOwnership, orderController.getOrderById);

// Create a new order
router.post('/', authenticate, orderController.createOrder);

// Update an order
router.put('/:id', authenticate, authorizeOrderOwnership, orderController.updateOrderHandler);

// Delete an order
router.delete('/:id', authenticate, authorizeOrderOwnership, orderController.deleteOrderHandler);

export default router;
