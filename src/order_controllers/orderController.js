import * as orderServices from '../order_services/orderServices.js';

export async function getOrders(req, res, next) {
  try {
    const orders = await orderServices.getAllOrders();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}
