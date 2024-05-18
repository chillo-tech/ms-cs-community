import { Schema } from 'mongoose';

export const newslettersUserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  isActive: Boolean,
});
