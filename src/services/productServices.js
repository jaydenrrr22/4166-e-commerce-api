import {
    getAll,
    getById,
} from "../repositories/productRepo.js"

export async function getAllProducts() {
    return await getAll();
};

export async function getProductById(id) {
    let result = await getById(id);
    if (result) return result;
    else {
        const error = new Error(`Cannot find post with id: ${id}`);
        error.status = 404;
        throw error;
    }
};