import {
    getAllProducts,
    getProductById,
} from "../services/productServices.js";


export async function getAllProductsHandler(req, res) {
    
    let result = await getAllProducts();
    res.status(200).json(result);

};

export async function getProductByIdHandler(req, res) {
    let id = parseInt(req.params.id);
    let product = await getProductById(id);
    res.status(200).json(product);
}