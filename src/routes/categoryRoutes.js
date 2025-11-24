import express from 'express';
import {
  validateCategoryId,
  validateCategory,
} from '../middleware/categoryValidators.js';

import {
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from '../controllers/categoryController.js';

import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', getAllCategoriesHandler);

router.get('/:id', validateCategoryId, getCategoryByIdHandler);

router.post('/', authenticate ,authorizeRoles('ADMIN'), validateCategory, createCategoryHandler);

router.put('/:id', authenticate, authorizeRoles('ADMIN'), validateCategoryId, validateCategory, updateCategoryHandler);

router.delete('/:id', authenticate, authorizeRoles('ADMIN'), validateCategoryId, deleteCategoryHandler);

export default router;