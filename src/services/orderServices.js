// orderServices.js
import * as orderRepo from '../repositories/orderRepo.js';
import prisma from '../config/db.js';

// --- Order services ---
export async function getAllOrders() {
  return prisma.order.findMany({
    include: { orderItems: true },
  });
}

export async function getAllOrdersByUserId(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: { orderItems: true },
  });
}

// --- Helper for controllers ---
export async function getOrders(userId, role) {
  if (role === 'ADMIN') {
    return getAllOrders();
  }
  return getAllOrdersByUserId(userId);
}

export async function getOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { orderItems: true },
  });
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
      productId: item.product_id,   
      quantity: item.quantity,
      unitPrice: product.price,     
      subtotal
    });
  }

  const order = await prisma.order.create({
    data: {
      total,
      user: { connect: { id: userId } },
      orderItems: { create: orderItemsData },
    },
    include: { orderItems: true },
  });

  return order;
}



export async function updateOrder(orderId, items, userId) {
 
  await prisma.orderItem.deleteMany({
    where: { orderId },
  });

 
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
      productId: item.product_id,   
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal,
    });
  }

  
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      total,
      user: { connect: { id: userId } },
      updatedAt: new Date(),
      orderItems: { create: orderItemsData },
    },
    include: { orderItems: true },
  });

  return updatedOrder;
}


export async function deleteOrder(orderId) {
  try {
   
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    const deleted = await prisma.order.delete({
      where: { id: orderId },
    });

    return deleted;
  } catch (error) {
    if (error.code === 'P2025') { 
      const err = new Error("Order does not exist");
      err.status = 404;
      throw err;
    }
    throw error;
  }
}
