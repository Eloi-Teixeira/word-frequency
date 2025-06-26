import { Schema, model } from 'mongoose';

const noteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  latestVersionId: { type: Schema.Types.ObjectId, ref: 'NoteVersion', default: null },
}, { timestamps: true })

const Note = model('Note', noteSchema);
export default Note;