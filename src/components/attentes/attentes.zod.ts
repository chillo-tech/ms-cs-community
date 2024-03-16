import { object, string } from 'zod';

class AttenteZodSchema {
  createAttenteSchema = object({
    body: object({
      email: string(),
      message: string({
        invalid_type_error: 'the message should be a string',
      }),
      phoneNumber: string({
        invalid_type_error: 'the phoneNumber should be a string',
      }),
      phoneIndex: string({
        invalid_type_error: 'the phoneIndex should be a string',
      }),
      sessionId: string({
        invalid_type_error: 'the id should be a string',
      }),
    })
  });
}

const attenteZodSchema = new AttenteZodSchema();
export default attenteZodSchema;
