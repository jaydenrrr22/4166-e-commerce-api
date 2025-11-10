import express from 'express';

import {
    getAllProductsHandler,
    getProductByIdHandler
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);

export default router;