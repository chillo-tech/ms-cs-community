import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  impression: String,
});

export { avisSchema };
