import { Schema } from 'mongoose';

const avisSchema = new Schema({
  message: String,
  email: String,
  subject: String,
  impression: String,
});

const avisFrontViewSchema = new Schema({
  name: String,
  left: {
    title: String,
    desc: String,
  },
  right: {
    title: String,
    desc: String,
    bottom: String,
    fields: [
      {
        name: String,
        fieldType: {
          type: String,
          enum: ['text', 'email', 'radio', 'checkbox'],
        },
        label: String,
        placeholder: String,
        choices: [String],
      },
    ],
  },
});

export { avisSchema, avisFrontViewSchema };
