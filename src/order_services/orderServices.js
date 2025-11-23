import * as orderRepo from '../order_repositories/orderRepo.js';
import prisma from '../config/db.js'; 
//import * as productRepo from '../product_repositories/productRepo.js';
export async function getAllOrders() {
  return orderRepo.findAll();
}

export function getOrderById(id) {
  return orderRepo.findById(id);
}

export async function createOrder(items, userId) {
  let total = 0;
  const orderItemsData = [];

  for (const item of items) {
    const product = await orderRepo.findProductById(item.product_id);
    if (!product) {
      throw new Error(`Product with id ${item.product_id} not found`);
    }

    const subtotal = product.price * item.quantity;
    total += subtotal;

    orderItemsData.push({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: product.price,
      subtotal
    });
  }

  const order = await orderRepo.createOrder(total, orderItemsData, userId);
  return order;
}

export async function updateOrder(orderId, items, userId) {
  const order = await orderRepo.findById(orderId);
  if (!order) {
    const err = new Error('Order not found');
    err.status = 404;
    throw err;
  }

  if (order.user_id !== userId) {
    const err = new Error('You are not authorized to update this order');
    err.status = 403;
    throw err;
  }

  for (const item of items) {
    const product = await productRepo.findById(item.product_id);
    if (!product) {
      const err = new Error(`Product with id ${item.product_id} not found`);
      err.status = 404;
      throw err;
    }
    item.unit_price = product.price; 
  }

  return orderRepo.updateOrder(orderId, items, userId);
}


export async function deleteOrder(orderId) {
  if (!Number.isInteger(orderId) || orderId <= 0) {
    const err = new Error("Bad request");
    err.status = 400;
    err.details = ["id must be a positive integer"];
    throw err;
  }

  try {
    await prisma.orderItem.deleteMany({
      where: { order_id: orderId },
    });

    const deleted = await prisma.order.delete({
      where: { id: orderId },
    });

    return deleted;
  } catch (error) {
    if (error.code === 'P2025') { 
      const err = new Error("order does not exist");
      err.status = 404;
      throw err;
    }
    throw error;
  }
}