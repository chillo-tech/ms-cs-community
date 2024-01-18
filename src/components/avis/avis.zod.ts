import { object, string } from 'zod';

class AvisZodSchema {
  createAvisSchema = object({
    body: object({
      email: string({
        required_error: 'Email is required',
        invalid_type_error: 'email should be a string',
      }).email(),
      message: string({
        invalid_type_error: 'the message should be a string',
      }),
      note: string({
        invalid_type_error: 'the note should be a string',
      }),
      subject: string({
        invalid_type_error: 'the subject should be a string',
      }),
    }),
  });
  getAvisViewSchema = object({
    query: object({
      slug: string(),
    }),
  });
}

const avisZodSchema = new AvisZodSchema();
export default avisZodSchema;
