import express from 'express';
import * as userController from '../user_controllers/userController.js';
import {
  validateUser,
  validateUserUpdate,
} from '../middleware/userValidators.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.get('/', authenticate, userController.getAllUsersHandler);

router.get('/:id', authenticate, userController.getUserByIdHandler);

router.post('/', validateUser, userController.createUserHandler);

router.put(
  '/:id',
  authenticate,
  validateUserUpdate,
  userController.updateUserHandler,
);

router.delete('/:id', authenticate, userController.deleteUserHandler);

router.patch('/:id', authenticate, userController.updateUserRoleHandler);

export default router;
