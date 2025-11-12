import express from 'express';

import {
    getAllProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
//TODO: Add authorizeroles(SELLER) for creating a product
router.post("/", createProductHandler);
//TODO: Add authorizeroles(SELLER, ADMIN) for updating a product
router.put("/:id", updateProductHandler);

export default router;