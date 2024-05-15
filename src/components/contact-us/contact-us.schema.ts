import { Schema } from 'mongoose';

const contactUsSchema = new Schema({
  message: String,
  firstName: String,
  lastName: String,
  email: String,
  subject: String,
  phone: String,
  phoneIndex: String,
  appName: String,
  referrer: String
});

export { contactUsSchema };
