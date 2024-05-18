import { Schema } from 'mongoose';

const contactSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  phone: String,
  phoneIndex: String,
  tags: String,
  position: String,
});

export { contactSchema };
