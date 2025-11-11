import express from 'express';
import * as orderController from '../order_controllers/orderController.js';


const router = express.Router();

router.get('/', orderController.getOrders);


export default router;
