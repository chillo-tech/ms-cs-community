import { Schema } from 'mongoose';

export const newslettersUserSchema = new Schema({
  name: String,
  email: String,
  isActive: Boolean,
});
