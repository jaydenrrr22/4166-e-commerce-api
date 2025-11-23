import express from 'express';
import * as orderController from '../order_controllers/orderController.js';
import { authenticate } from '../middleware/authenticate.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = express.Router();

router.get('/', authenticate, orderController.getOrders);


router.get('/:id' ,authenticate, orderController.getOrderById);


router.post('/', authenticate, orderController.createOrder);
router.put('/', authenticate, orderController.updateOrderHandler);
router.delete('/:id',authenticate, orderController.deleteOrderHandler);

export default router;