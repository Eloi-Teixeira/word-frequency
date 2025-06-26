import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import noteRouter from './routes/noteRoutes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRouter);
app.use('/api/notes', noteRouter);
export default app;