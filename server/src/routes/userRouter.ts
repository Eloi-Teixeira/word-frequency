import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController';

const userRouter = Router();

userRouter
  .post('/signup', createUser)
  .get('/:id', getUser)
  .get('/', getAllUsers)
  .patch('/:id', updateUser);

export default userRouter;
