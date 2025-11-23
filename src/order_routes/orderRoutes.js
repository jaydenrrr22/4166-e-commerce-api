import express from 'express';
import * as orderController from '../order_controllers/orderController.js';
//import { requireAuth } from '../middleware/auth.js';
import { deleteOrderHandler } from '../order_controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/', orderController. updateOrderHandler);
router.delete('/:id', deleteOrderHandler);


export default router;
