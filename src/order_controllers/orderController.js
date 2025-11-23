
import * as orderServices from '../order_services/orderServices.js';

export async function getOrders(req, res, next) {
  try {
    const user = req.user;

    let orders;

    if (user.role === 'ADMIN') {
      // Admin can see all orders
      orders = await orderServices.getAllOrders();
    } else {
      // Normal user only sees their own orders
      orders = await orderServices.getAllOrdersByUserId(user.id);
    }

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const order = await orderServices.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Only admin or the user who owns the order can access
    if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
      return res.status(403).json({ error: "User not allowed to view other users’ orders." });
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

export async function createOrder(req, res, next) {
  try {
    const {  user_id,items } = req.body;

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !items.every(
        i => typeof i.product_id === 'number' && Number.isInteger(i.product_id) &&
             typeof i.quantity === 'number' && Number.isInteger(i.quantity) &&
             i.quantity > 0
      )
    ) {
      return res.status(400).json({
        error: "Request body must include an 'items' array with valid product_id and quantity"
      });
    }

   

    const order = await orderServices.createOrder(items, user_id);
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
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !items.every(
        i =>
          typeof i.product_id === 'number' && i.product_id > 0 &&
          typeof i.quantity === 'number' && i.quantity > 0
      )
    ) {
      return res.status(400).json({
        error: 'Items array must include valid product_id and quantity',
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const userId = req.user.id;
    const userRole = req.user.role; 

    const updatedOrder = await orderServices.updateOrder(orderId, items, userId, userRole);

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found or you are not authorized to update it' });
    }

    res.status(200).json({
      id: updatedOrder.id,
      user_id: updatedOrder.user_id,
      total: updatedOrder.total,
      updated_at: updatedOrder.updated_at,
      items: updatedOrder.orderItems,
    });
  } catch (err) {
    next(err);
  }
}


export async function deleteOrderHandler(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const user = req.user; 

    if (user.role.toUpperCase() !== 'ADMIN') {
      const order = await orderServices.getOrderById(orderId);
      if (order.user_id !== user.id) {
        return res.status(403).json({ error: "You can only delete your own orders" });
      }
    }

    const deletedOrder = await orderServices.deleteOrder(orderId);

    return res.status(200).json({
      message: `Order ${deletedOrder.id} deleted successfully`,
      order: deletedOrder
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        error: err.message,
        ...(err.details && { details: err.details })
      });
    }
    next(err);
  }
}
