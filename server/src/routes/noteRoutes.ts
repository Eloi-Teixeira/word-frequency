import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import {
  createNote,
  deletePermanentNote,
  deleteTemporaryNote,
  getAllNotesByUser,
  getAllTags,
  getNote,
  restoreNote,
  updateNote,
} from '../controllers/noteController';

const routers = Router();

routers.route('/tags').get(protect, getAllTags);
routers.route('/permanent').delete(protect, deletePermanentNote);
routers.route('/restore/:id').patch(protect, restoreNote);
routers.route('/').post(protect, createNote).get(protect, getAllNotesByUser);

routers
  .route('/:id')
  .get(protect, getNote)
  .patch(protect, updateNote)
  .delete(protect, deleteTemporaryNote);

export default routers;
