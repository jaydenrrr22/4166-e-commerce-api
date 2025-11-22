import prisma from "../config/db.js";
import { getUserById } from "../services/userServices.js";

export async function getAll() {
    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            price: true,
            stock: true,
            createdAt: true,
            sellerId: true, 
            categoryId: true
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
            createdAt: true,
            sellerId: true,
            categoryId: true
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

export async function remove(id){
    try {
        const deletedProduct = await prisma.product.delete({
            where: { id },
        });
        return deletedProduct;
    }
    catch (error) {
        if (error.code === "P2025") return null;
        throw error;
    };
};

export async function categoryExists(search) {
    let id = parseInt(search);
    const result = await prisma.category.findUnique({
        where: { id }
    });
    if (result) {
        return true;
    }
    return false;
};

export async function productListedBySeller(sellerID, productName) {
    let sellerId = parseInt(sellerID);
    let name = productName;
    const result = await prisma.product.findMany({
        where: {
            name,
            sellerId
        }
    });
    return result.length > 0;
}