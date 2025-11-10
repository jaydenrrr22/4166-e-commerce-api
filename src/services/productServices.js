import {
    getAll
} from "../repositories/productRepo.js"

export async function getAllProducts() {
    return await getAll();
}