import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/users', userRouter);
export default app;