import { object, optional, string } from 'zod';

class AttenteZodSchema {
  createAttenteSchema = object({
    body: object({
      appName: string({
        invalid_type_error:
          "Le nom de l'application doit être une chaîne de caractères",
      }),
      firstName: optional(
        string({
          invalid_type_error: 'Le nom doit être une chaîne de caractères',
        })
      ),
      lastName: optional(
        string({
          invalid_type_error: 'Le prenom doit être une chaîne de caractères',
        })
      ),
      email: string().email(),
      message: string({
        invalid_type_error: 'Le message doit être une chaîne de caractères',
      }),
      phone: optional(
        string({
          invalid_type_error:
            'Le numéro de téléphone doit être une chaîne de caractères',
        })
      ),
      phoneIndex: optional(
        string({
          invalid_type_error:
            "L'index téléphonique doit être une chaîne de caractères",
        })
      ),
      sessionId: optional(
        string({
          invalid_type_error:
            "L'id de la session doit être une chaîne de caractères",
        })
      ),
      itemSlug: optional(
        string({
          invalid_type_error:
            "Le slug de l'item doit être une chaîne de caractères",
        })
      ),
    }),
  });
}

const attenteZodSchema = new AttenteZodSchema();
export default attenteZodSchema;
