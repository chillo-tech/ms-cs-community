import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  email: String,
  subject: String,
  impression: String,
});

export { avisSchema };
