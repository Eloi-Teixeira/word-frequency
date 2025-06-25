import { Schema, model } from 'mongoose';
import dotenv from 'dotenv';
import bcript from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
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
