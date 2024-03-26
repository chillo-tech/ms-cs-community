import { object, string } from 'zod';

class AttenteZodSchema {
  createAttenteSchema = object({
    body: object({
      email: string(),
      message: string({
        invalid_type_error: 'Le message doit être une chaîne de caractères',
      }),
      phoneNumber: string({
        invalid_type_error:
          'Le numéro de téléphone doit être une chaîne de caractères',
      }),
      phoneIndex: string({
        invalid_type_error:
          "L'index téléphonique doit être une chaîne de caractères",
      }),
      sessionId: string({
        invalid_type_error:
          "L'id de la session doit être une chaîne de caractères",
      }),
    }),
  });
}

const attenteZodSchema = new AttenteZodSchema();
export default attenteZodSchema;
