import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
      }

      req.user = { id: user._id.toString() };

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Token não fornecido' });
  }
})
