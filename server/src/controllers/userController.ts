import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import filterObj from '../utils/filterFields';
import { AuthRequest } from '../middlewares/authMiddleware';

const createAndSendToken = (
  user: any,
  res: Response,
  message: string,
  codeStatus?: number,
) => {
  const token = user.generateAuthToken();
  const cookieOptions = {
    expires: new Date(Date.now() + 72 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  user.password = undefined;
  res.cookie('token', token, cookieOptions);
  return res.status(codeStatus ? codeStatus : 200).json({
    success: true,
    message: message,
    data: user,
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
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: 'A senha deve ter pelo menos 8 caracteres', status: false });
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
  createAndSendToken(user, res, 'Usuário criado com sucesso', 201);
});

export const getUser = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado', status: false });
    }
    return res.status(200).json({ success: true, data: user });
  },
);

export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await User.find();
  if (!users) {
    return res
      .status(404)
      .json({ message: 'Nenhum usuário encontrado', status: false });
  }
  return res.status(200).json({ success: true, data: users });
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

    const filteredBody = filterObj(req.body, ['name', 'email']);
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
    return res.status(200).json({ success: true, data: user });
  },
);

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res
      .status(404)
      .json({ message: 'Usuário não encontrado', status: false });
  }
  return res.status(204).json({ success: true, data: user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({
      status: false,
      message: 'Email ou senha invalido',
    });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res
      .status(404)
      .json({ message: 'Usuário não encontrado', status: false });
  }

  if (!(await user.correctPassword(password, user.password))) {
    return res
      .status(401)
      .json({ message: 'Senha ou email incorreto', status: false });
  }

  createAndSendToken(user, res, 'Usuário logado com sucesso');
});

export const logout = catchAsync((req: Request, res: Response) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: true });
});
