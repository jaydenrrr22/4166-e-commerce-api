import prisma from "../config/db.js";

export async function getAll() {
    const products = prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            seller_id: true,
            category_id: true
        }
    });
    return products;
};

export async function getById(id) {
    const product = prisma.product.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            seller_id: true,
            category_id: true
        },
    });
    return product;
};