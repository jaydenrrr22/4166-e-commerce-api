import * as orderServices from '../services/orderServices.js';


export async function getOrderById(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = await orderServices.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}


export async function createOrder(req, res, next) {
  try {
    const { items } = req.body;

    if (
      !items || !Array.isArray(items) || items.length === 0 ||
      !items.every(
        i => typeof i.product_id === 'number' && i.product_id > 0 &&
             typeof i.quantity === 'number' && i.quantity > 0
      )
    ) {
      return res.status(400).json({
        error: "Request body must include an 'items' array with valid product_id and quantity"
      });
    }

    const userId = req.user.id;
    const order = await orderServices.createOrder(items, userId);

    return res.status(201).json(order);
  } catch (err) {
    if (err.message.startsWith("Product with id")) {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}


export async function updateOrderHandler(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const items = req.body.items;

    if (
      !items || !Array.isArray(items) || items.length === 0 ||
      !items.every(
        i => typeof i.product_id === 'number' && i.product_id > 0 &&
             typeof i.quantity === 'number' && i.quantity > 0
      )
    ) {
      return res.status(400).json({
        error: "Items array must include valid product_id and quantity"
      });
    }

    const userId = req.user.id;
    const userRole = req.user.role;

    const updatedOrder = await orderServices.updateOrder(orderId, items, userId, userRole);

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found or you are not authorized to update it' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
}


export async function deleteOrderHandler(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const deletedOrder = await orderServices.deleteOrder(orderId);

    return res.status(200).json({
      message: `Order ${deletedOrder.id} deleted successfully`,
      order: deletedOrder
    });
  } catch (err) {
    next(err);
  }
}


export async function getOrdersHandler(req, res, next) {
  try {
    const orders = await orderServices.getOrders(req.user.id, req.user.role);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}
