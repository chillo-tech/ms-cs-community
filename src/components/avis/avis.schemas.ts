import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  email: String,
  impression: String,
});

export { avisSchema };
