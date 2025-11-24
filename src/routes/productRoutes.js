import express from 'express';

import {
    getAllProductsHandler,
    getProductByIdHandler,
    createProductHandler,
    updateProductHandler,
    deleteProductHandler
} from "../controllers/productController.js";

import {
    validateProductId,
    validateCreateProduct,
    validateProductQuery,
    validateUpdateProduct,
} from "../middleware/productValidators.js"

import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authorizeProductOwnership } from '../middleware/authorizeOwnership.js';
const router = express.Router();

router.get("/",
    validateProductQuery,
    getAllProductsHandler);
    
router.get("/:id",
    validateProductId,
    getProductByIdHandler);

router.post("/",
    authenticate,
    authorizeRoles("SELLER", "ADMIN"),
    validateCreateProduct,
    createProductHandler);

router.put("/:id",
    authenticate,
    authorizeRoles("SELLER", "ADMIN"),
    authorizeProductOwnership,
    validateProductId,
    validateUpdateProduct,
    updateProductHandler);

router.delete("/:id",
    authenticate,
    authorizeRoles("SELLER", "ADMIN"),
    authorizeProductOwnership,
    validateProductId,
    deleteProductHandler);

export default router;