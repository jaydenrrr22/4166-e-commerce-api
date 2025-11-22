import prisma from "../config/db.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productService.js";


export async function getAllProductsHandler(req, res) {
    
    let result = await getAllProducts();
    res.status(200).json(result);

};

export async function getProductByIdHandler(req, res) {
    let id = parseInt(req.params.id);
    let product = await getProductById(id);
    res.status(200).json(product);
};

export async function createProductHandler(req, res) {
    const data = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        stock: parseInt(req.body.stock),
        /**
         * The seller id should be the id of the currently
         * logged in user. (req.user.id)
         * current data is placeholder.
         */
        sellerId: parseInt(req.user.id),
        categoryId: req.body.categoryId
    };
    let newProduct = await createProduct(data);
    res.status(201).json(newProduct);
};

export async function updateProductHandler(req, res) {
    let id = parseInt(req.params.id);
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = req.body.price;
    if (req.body.stock) updates.stock = req.body.stock;

    const updatedProduct = await updateProduct(id, updates);
    res.status(200).json(updatedProduct);
};

export async function deleteProductHandler(req, res) {
    let id = parseInt(req.params.id);
    await deleteProduct(id);
    res.status(204).send();
};