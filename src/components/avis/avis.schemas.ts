import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  nom: String,
  email: String,
  subject: String,
  impression: String,
});

const avisFrontViewSchema = new Schema({
  name: String,
  title: String,
  description: String,
});

export { avisFrontViewSchema, avisSchema };
