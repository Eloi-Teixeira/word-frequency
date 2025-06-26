import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  createNote,
  deletePermanentNote,
  deleteTemporaryNote,
  getAllNotesByUser,
  getNote,
  restoreNote,
  updateNote,
} from '../controllers/noteController';

const routers = Router();

routers.route('/').post(protect, createNote).get(protect, getAllNotesByUser);

routers
  .route('/:id')
  .get(protect, getNote)
  .patch(protect, updateNote)
  .delete(protect, deleteTemporaryNote);
routers.route('/permanent/:id').delete(protect, deletePermanentNote);
routers.route('/restore/:id').patch(protect, restoreNote);

export default routers;
