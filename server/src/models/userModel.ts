import { InferSchemaType, Schema, model } from 'mongoose';
import dotenv from 'dotenv';
import bcript from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

dotenv.config();

const userSchema = new Schema({
  name: { type: String, required: [true, 'Por favor, forneça um nome'] },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [
      validator.isEmail,
      'Por favor, forneça um endereço de e-mail válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, forneça uma senha válida'],
    minlength: 8,
    select: false,
  },
  createdAt: { type: Date, default: Date.now },
  passwordChangedAt: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  configuration: {
    type: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: { type: String, default: 'pt-BR' },
      fontSize: { type: String, default: '16px' },
      fontFamily: { type: String, default: 'Arial' },
      highlightColor: { type: String, default: '#fb0' },
      boldHighlightColor: { type: String, default: '#fb0' },
      autoSave: { type: Boolean, default: true },
      autoSaveInterval: { type: Number, default: 5 },
    },
  },
});

userSchema.pre('save', async function (next) {
  const hash = await bcript.hashSync(this.password, 12);
  this.password = hash;
  next();
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id },
    process.env.JWT_SECRET || 'defaultSecret',
    { expiresIn: '72h' },
  );
  return token;
};

userSchema.methods.correctPassword = async function (
  password: string,
  userPassword: string,
) {
  return await bcript.compare(password, userPassword);
};

type UserDocument = InferSchemaType<typeof userSchema> & {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;
  generateAuthToken(): string;
};
const User = model<UserDocument>('User', userSchema);
export default User;
