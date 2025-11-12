import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../services/productServices.js";


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
        price: req.body.price,
        stock: req.body.stock,
        /**
         * The seller id should be the id of the currently
         * logged in user.
         * current data is placeholder.
         */
        seller_id: req.body.seller_id,
        category_id: req.body.category_id,
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