import express, { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

const filterObj = (obj: any) => {
  const newObj: any = {};
  const allowedFields = ['name', 'email'];
  allowedFields.forEach((field) => {
    if (obj[field]) {
      newObj[field] = obj[field];
    }
  });
  return newObj;
};

const createAndSendToken = (user: any, res: express.Response) => {
  const token = user.generateAuthToken();
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  user.password = undefined;
  res.cookie('token', token, cookieOptions);
  return res.status(201).json({
    success: true,
    message: 'Usuário criado com sucesso',
    user,
    token,
  });
};

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Todos os campos são obrigatórios', status: false });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'As senhas não coincidem', status: false });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(400)
      .json({ message: 'Usuário já existe', status: false });
  }
  if (password.length < 6) {
    return res.status(400).json({
      message: 'A senha deve ter pelo menos 6 caracteres',
      status: false,
    });
  }

  const user = await User.create({ name, email, password });
  if (!user) {
    return res
      .status(400)
      .json({ message: 'Erro ao criar usuário', status: false });
  }
  createAndSendToken(user, res);
});

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado', status: false });
    }
    user.password = '';
    return res.status(200).json({ success: true, user });
  },
);

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await User.find();
  if (!users) {
    return res
      .status(404)
      .json({ message: 'Nenhum usuário encontrado', status: false });
  }
  return res.status(200).json({ success: true, users });
});

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new Error(
          'This route is not for password updates. Please use /updatePassword.',
        ),
      );
    }

    const filteredBody = filterObj(req.body);
    if (Object.keys(filteredBody).length === 0) {
      return res.status(400).json({
        message: 'Nenhum campo para atualizar',
        status: false,
      });
    }

    const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado', status: false });
    }
    user.password = '';
    return res.status(200).json({ success: true, user });
  },
);

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ message: 'Usuário não encontrado', status: false });
  }
  return res.status(204).json({ success: true, user });
});
