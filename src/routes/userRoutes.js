
import express from 'express';
import * as userController from '../controllers/userController.js';
import {
  validateUser,
  validateUserUpdate,
} from '../middleware/userValidators.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { authorizeUserOwnership } from '../middleware/authorizeOwnership.js';

const router = express.Router();

//Get all users - only ADMIN allowed
router.get(
  '/',
  authenticate,
  authorizeRoles('ADMIN'),
  userController.getAllUsersHandler,
);

//Get user by Id - authenticated users (ADMIN or owner)
router.get(
  '/:id',
  authenticate,
  authorizeUserOwnership,
  userController.getUserByIdHandler,
);

//Create user - ADMIN only
router.post(
  '/',
  authenticate,
  validateUser,
  authorizeRoles('ADMIN'),
  userController.createUserHandler,
);

//Update user - authenticated users (ADMIN or owner)
router.put(
  '/:id',
  authenticate,
  authorizeUserOwnership,
  validateUserUpdate,
  userController.updateUserHandler,
);

//Delete user - authenticated users (ADMIN or owner)
router.delete(
  '/:id',
  authenticate,
  authorizeUserOwnership,
  userController.deleteUserHandler,
);

//Update user roles - only ADMIN allowed
router.patch(
  '/:id',
  authenticate,
  authorizeRoles('ADMIN'),
  userController.updateUserRoleHandler,
);

export default router;
