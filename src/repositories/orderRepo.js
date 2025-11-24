import prisma from '../config/db.js';

export async function findAll() {
  return prisma.order.findMany({
    include: {
      orderItems: true,
    },
  });
}


export async function findById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: { orderItems: true }
  });
}


export async function createOrder(total, items, userId) {
  return prisma.order.create({
    data: {
      total,
      user: { connect: { id: userId } }, 
      orderItems: {
        create: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          subtotal: i.subtotal
        }))
      }
    },
    include: { orderItems: true }
  });
}

export async function findProductById(id) {
  return prisma.product.findUnique({
    where: { id },
  });
}

export async function updateOrder(orderId, items, userId) {
  await prisma.orderItem.deleteMany({
    where: { order_id: orderId },
  });

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      total,
      user: { connect: { id: userId } }, 
      updated_at: new Date(),
      orderItems: {
        create: items.map(i => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          subtotal: i.quantity * i.unit_price,
        })),
      },
    },
    include: { orderItems: true },
  });

  return updatedOrder;
}