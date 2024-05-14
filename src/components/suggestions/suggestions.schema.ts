import { Schema } from 'mongoose';

export const suggestionsSchema = new Schema({
  author: {
    firstName: String,
    lastName: String,
    email: String,
    tag: [String],
    phoneIndex: Number,
    phone: Number,
  },
  title: String,
  description : String
});
