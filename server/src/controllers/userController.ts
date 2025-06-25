import express from "express";
import User from "../models/userModel";
import catchAsync from "../utils/catchAsync";

const createAndSendToken = (user: any, res: express.Response) => {
  const token = user.generateAuthToken();
  const cookieOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  user.password = undefined;
  res.cookie("token", token, cookieOptions);
  return res.status(201).json({
    success: true,
    message: "Usuário criado com sucesso",
    user,
    token
  });
}

export const createUser = catchAsync(async (req: express.Request, res: express.Response) => { 
  const { name, email, password, confirmPassword } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios", status: false });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "As senhas não coincidem", status: false });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Usuário já existe", status: false });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "A senha deve ter pelo menos 6 caracteres", status: false });
  }
  

  const user = await User.create({ name, email, password });
  if (!user) {
    return res.status(400).json({ message: "Erro ao criar usuário", status: false });
  }
  createAndSendToken(user, res);
})