import { Schema } from 'mongoose';

export const newslettersUserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  isActive: Boolean,
});
