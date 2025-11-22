import { body } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateUser = [
  body('email')
    .exists({ values: 'falsy' })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email is not valid')
    .normalizeEmail(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 64 })
    .withMessage(
      'password must contain at least 8 characters and at most 64 characters',
    ),

  handleValidationErrors,
];

export const validateUserUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .optional()
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 64 })
    .withMessage(
      'password must contain at least 8 characters and at most 64 characters',
    ),
  handleValidationErrors,
];

export const validateSignup = [
  body('name')
    .exists({ values: 'falsy' })
    .withMessage('name is required')
    .bail()
    .isLength({ min: 1, max: 100 })
    .withMessage('name must not be empty'),

  body('email')
    .exists({ values: 'falsy' })
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('email is not valid')
    .normalizeEmail(),

  body('password')
    .exists({ values: 'falsy' })
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 64 })
    .withMessage(
      'password must contain at least 8 characters and at most 64 characters',
    ),

  handleValidationErrors,
];