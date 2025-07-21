import { Request, Response, NextFunction } from 'express';
import Note from '../models/noteModel';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../middlewares/authMiddleware';
import filterFields from '../utils/filterFields';
import mongoose from 'mongoose';

export const createNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let title = 'Sem título';
    let content = '';
    if (req.body) {
      title = req.body.title ? req.body.title.trim() : 'Sem título';
      content = req.body.content ? req.body.content.trim() : '';
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }

    const note = await Note.create({
      userId,
      title,
      content,
    });
    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao criar nota',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Nota criada com sucesso',
      data: note,
    });
  },
);

export const getAllNotes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const notes = await Note.find();
    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao buscar notas',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Notas encontradas com sucesso',
      data: notes,
    });
  },
);

export const getAllNotesByUser = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }

    const notes = await Note.find({ userId }).sort({ updatedAt: -1 });
    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao buscar notas',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notas encontradas com sucesso',
      data: notes,
    });
  },
);

export const getNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }
    const noteId = req.params.id;
    const note = await Note.findOne({ userId, _id: noteId });
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Nota encontrada com sucesso',
      data: note,
    });
  },
);

// Criar a função para atualizar uma nota e deletar uma nota

export const updateNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }
    const noteId = req.params.id;
    const filteredBody = filterFields(req.body, [
      'title',
      'content',
      'isDeleted',
      'pinned',
      'tags',
    ]);
    filteredBody.updatedAt = new Date();
    const note = await Note.findOneAndUpdate(
      { userId, _id: noteId },
      filteredBody,
      { new: true, runValidators: true },
    );
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Nota atualizada com sucesso',
      data: note,
    });
  },
);

export const deleteTemporaryNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }
    const notes = req.body.notes;
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }

    if (notes.every((id) => typeof id !== 'string')) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }
    const objectIds = notes.map((id) => new mongoose.Types.ObjectId(id));
    const note = await Note.findOne({ userId, _id: {$in: objectIds}, isDeleted: false });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada',
      });
    }
    
    note.isDeleted = true;
    await note.save();
    return res.status(200).json({
      success: true,
      message: 'Nota deletada com sucesso',
      data: note,
    });
  },
);

export const deletePermanentNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }
    const notes = req.body.notes;
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }

    if (notes.every((id) => typeof id !== 'string')) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }
    const objectIds = notes.map((id) => new mongoose.Types.ObjectId(id));
    const deletedNotes = await Note.deleteMany({
      _id: { $in: objectIds },
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: true,
    });

    const newNotes = await Note.find({ userId });
    return res.status(200).json({
      success: true,
      deletedCount: deletedNotes.deletedCount,
      message: `${deletedNotes.deletedCount} notas deletadas.`,
      data: newNotes,
    });
  },
);

export const restoreNote = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Usuário não autorizado' });
    }

    const notes = req.body.notes;
    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }

    if (notes.every((id) => typeof id !== 'string')) {
      return res.status(400).json({
        success: false,
        message: 'Requisição inválida',
      });
    }

    const objectIds = notes.map((id) => new mongoose.Types.ObjectId(id));

    const noteRestored = await Note.updateMany(
      { _id: { $in: objectIds }, userId, isDeleted: true },
      { isDeleted: false, deletedAt: null },
      { new: true },
    );

    if (!noteRestored) {
      return res.status(404).json({
        success: false,
        message: 'Nota não encontrada ou não está na lixeira',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nota restaurada com sucesso',
      data: noteRestored,
    });
  },
);

export const getAllTags = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autorizado',
      });
    }
    const notes = await Note.find({ userId, isDeleted: false });
    if (!notes) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao buscar notas',
      });
    }
    let tags: string[] = [];
    notes.forEach((note) => {
      if (note.tags && note.tags.length > 0) {
        tags = [...tags, ...note.tags];
      }
    });

    const uniqueTags = [...new Set(tags)];
    return res.status(200).json({
      success: true,
      message: 'Tags encontradas com sucesso',
      data: uniqueTags,
    });
  },
);
