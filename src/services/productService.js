import prisma from "../config/db.js";
import {
    getAll,
    getById,
    create,
    update,
    remove

} from "../repositories/productRepo.js"

export async function getAllProducts() {
    return await getAll();
};

export async function getProductById(id) {
    let result = await getById(id);
    if (result) return result;
    else {
        const error = new Error(`Cannot find product with id: ${id}`);
        error.status = 404;
        throw error;
    }
};

export async function createProduct(data) {
    return await create(data);
};

export async function updateProduct(id, data) {
    const updatedProduct = await update(id, data);
    if (updatedProduct) return updatedProduct;
    else {
        const error = new Error(`Cannot find product with id: ${id}`);
        error.status = 404;
        throw error;
    };
};

export async function deleteProduct(id) {
    let result = await remove(id);
    if (result) return;
    else {
        const error = new Error(`Cannot find product with id ${id}`);
        error.status = 404;
        throw error;
    }
}