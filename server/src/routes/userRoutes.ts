import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const routes = Router();

routes.route('/signup').post(createUser);

routes.route('/').get(protect, getAllUsers);
routes.route('/:id').get(getUser).patch(protect, updateUser);

export default routes;
