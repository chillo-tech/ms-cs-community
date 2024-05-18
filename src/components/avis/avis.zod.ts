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
      firstName: string({
        invalid_type_error: 'the firstName should be a string',
      }),
      lastName: string({
        invalid_type_error: 'the lastName should be a string',
      }),
      note: number({
        invalid_type_error: 'the note should be a number',
      }).optional(),
      subject: string({
        invalid_type_error: 'the subject should be a number',
      }).optional(),
      training_slug: string({
        invalid_type_error: 'the training_slug should be a string',
      }).optional(),
      session_slug: string({
        invalid_type_error: 'the session_slug should be a string',
      }).optional(),
    }),
  });
  getAvisViewSchema = object({
    query: object({
      formationSlug: string().optional(),
      sessionSlug: string().optional(),
    }),
  });
}

const avisZodSchema = new AvisZodSchema();
export default avisZodSchema;
