import prisma from '../config/db.js';

export async function findAll() {
  return prisma.order.findMany({
    include: {
      orderItems: true,
    },
  });
}
