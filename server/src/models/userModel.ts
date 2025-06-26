import { Schema, model } from 'mongoose';
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
    { expiresIn: '24h' },
  );
  return token;
};

const User = model('User', userSchema);
export default User;
