import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/userController';

const routes = Router();

routes.route('/signup').post(createUser);

routes.route('/').get(getAllUsers);
routes.route('/:id').get(getUser).patch(updateUser);

export default routes;
