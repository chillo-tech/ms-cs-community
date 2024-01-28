import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  nom: String,
  email: String,
  subject: String,
  impression: String,
});

export { avisSchema };
