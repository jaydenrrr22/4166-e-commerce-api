import express from 'express';

import {
    getAllProductsHandler
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProductsHandler);

export default router;