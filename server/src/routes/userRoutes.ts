import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  login,
  logout,
  updateUser,
} from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const routes = Router();

routes.route('/auth/signup').post(createUser);
routes.route('/auth/login').post(login);
routes.route('/auth/logout').get(protect, logout)

routes.route('/me').get(protect, getUser);
routes.route('/admin').get(protect, getAllUsers);
routes.route('/:id').get(protect, getUser).patch(protect, updateUser);

export default routes;
