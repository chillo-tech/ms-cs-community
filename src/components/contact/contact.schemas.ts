import { Schema } from 'mongoose';

const contactSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  phoneIndex: String,
  tags: String,
  position: String,
});

export { contactSchema };
