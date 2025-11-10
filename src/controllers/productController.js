import {
    getAllProducts
} from "../services/productServices.js";


export async function getAllProductsHandler(req, res) {
    
    let result = await getAllProducts();
    res.status(200).json(result);

}