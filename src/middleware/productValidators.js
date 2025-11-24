import { param, query, body, oneOf } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';
import { categoryExists, productListedBySeller } from '../repositories/productRepo.js';

export const validateProductId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product id must be a positive integer'),
  handleValidationErrors,
];

const allowedSortFields = ['id', 'name', 'createdAt'];
const allowedSortOrders = ['asc', 'desc'];
export const validateProductQuery = [
  query('search').optional().isString().withMessage('search must be a string'),

  query('sortBy')
    .optional()
    .isIn(allowedSortFields)
    .withMessage(`sortBy must be one of: ${allowedSortFields.join(', ')}`),

  query('sortOrder')
    .optional()
    .isIn(allowedSortOrders)
    .withMessage(`sortOrder must be one of: ${allowedSortOrders.join(', ')}`),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),

  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('offset must be 0 or a positive integer'),

  handleValidationErrors,
];

export const validateCreateProduct = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('name is required')
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .custom(async (value, {req}) => {
      if (!await productListedBySeller(req.user.id, value)) {
        return true;
      }
      throw new Error("Product already listed by seller. Increase stock instead.");
    })
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters'),

  body('description')
    .optional({values: 'falsy'})
    .trim()
    .escape()
    .isString()
    .withMessage("description must be a string"),
  
  body("price")
    .exists({ values: 'falsy' })
    .withMessage("price is required")
    .bail()
    .isFloat()
    .withMessage("price must be a decimal number"),
  
  body("stock")
    .exists({ values: 'falsy' })
    .withMessage("stock is required")
    .bail()
    .isInt()
    .withMessage("stock must be an integer"),
  
  body('categoryId')
    .exists({ values: 'falsy' })
    .withMessage("category id is required")
    .bail()
    .isInt()
    .withMessage("category id must be an integer")
    .bail()
    .custom(async (value) => {
      if (value && await categoryExists(value)) {
        return true;
      }
      throw new Error(`Category with id ${value} does not exist`);
  }),
  
  handleValidationErrors,
];

export const validateUpdateProduct = [
  oneOf(
    [
      body('name').exists({ values: 'falsy' }),
      body('description').exists({ values: 'falsy' }),
      body('price').exists({ values: 'falsy' }),
      body('stock').exists({ values: 'falsy' }),
    ],
    {
      message:
        'At least one field (name, description, price, stock) must be provided',
    },
  ),

  body('name')
    .optional()
    .bail()
    .trim()
    .escape()
    .isString()
    .withMessage('name must be a string')
    .bail()
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters'),

  body('description')
    .optional()
    .trim()
    .escape()
    .isString()
    .withMessage('description must be a string'),
  
  body("price")
    .optional()
    .isFloat()
    .withMessage("price must be a decimal number"),
  
  body("stock")
    .optional()
    .isInt()
    .withMessage("stock must be an integer"),

  handleValidationErrors,
];