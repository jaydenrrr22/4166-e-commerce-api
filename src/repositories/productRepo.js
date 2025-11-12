import prisma from "../config/db.js";

export async function getAll() {
    const products = await prisma.product.findMany({
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
    const product = await prisma.product.findUnique({
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

export async function create(product) {
    const newProduct = await prisma.product.create({
        data: product,
    });
    return newProduct;
};

export async function update(id, updates) {
    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: updates,

        });
        return updatedProduct;
    }
    catch (error) {
        if (error.code === "P2025") return null;
        throw error;
    };
};