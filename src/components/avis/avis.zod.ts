import { number, object, string } from 'zod';

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
      nom: string({
        invalid_type_error: 'the nom should be a string',
      }),
      note: number({
        invalid_type_error: 'the note should be a number',
      }),
      session_id: number({
        invalid_type_error: 'the session_id should be a number',
      }),
      slug: string({
        invalid_type_error: 'the slug should be a string',
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
