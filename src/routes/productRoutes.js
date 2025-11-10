import express from 'express';

import {
    getAllProductsHandler,
    getProductByIdHandler,
    createProductHandler
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
//TODO: Add authorizeroles(SELLER) for creating a product
router.post("/", createProductHandler);

export default router;