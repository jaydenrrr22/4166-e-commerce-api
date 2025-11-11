import express from 'express';
import * as userController from '../user_controllers/userController.js';

const router = express.Router();

router.get('/', userController.getAllUsers);

export default router;
