import bcrypt from 'bcrypt';
import prisma from '../src/config/db.js';

try {
  // 🧹 Clear existing data in reverse dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 👤 Create Users
  const usersData = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('alice1234', 10),
      role: 'USER',
    },
    {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: await bcrypt.hash('bob12345', 10),
      role: 'SELLER',
    },
    {
      name: 'Charlie Admin',
      email: 'charlie@example.com',
      password: await bcrypt.hash('charlie1234', 10),
      role: 'ADMIN',
    },
  ];

  const users = await Promise.all(
    usersData.map((u) => prisma.user.create({ data: u }))
  );

  const seller = users.find((u) => u.role === 'SELLER');
  const buyer = users.find((u) => u.role === 'USER');

  // 🏷️ Create Categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Home Appliances' },
    ],
  });

  const allCategories = await prisma.category.findMany();

  // 🛍️ Create Products (linked to Seller + Categories)
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Wireless Mouse',
        description: 'Ergonomic mouse with smooth tracking.',
        price: 25.99,
        stock: 100,
        sellerId: seller.id,
        categoryId: allCategories.find((c) => c.name === 'Electronics').id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Science Fiction Novel',
        description: 'A thrilling journey through space.',
        price: 12.5,
        stock: 50,
        sellerId: seller.id,
        categoryId: allCategories.find((c) => c.name === 'Books').id,
      },
    }),
  ]);

  // 🧾 Create an Order for Buyer
  const order = await prisma.order.create({
    data: {
      userId: buyer.id,
      total: products[0].price * 2,
      orderItems: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: products[0].price,
            subtotal: products[0].price * 2,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully!');
} catch (error) {
  console.error('❌ Seed failed:', error);
} finally {
  await prisma.$disconnect();
}
