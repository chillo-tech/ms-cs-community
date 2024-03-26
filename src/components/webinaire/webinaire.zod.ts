
import { boolean, object, string } from 'zod';

class WebinaireZodSchema {
  createWebinaireSchema = object({
    body: object({
      nom: string(),
      prenom: string(),
      numero_telephone: string(),
      consentement_marketing: boolean(),
      connaissance_webinaire: string(),
      adresse_mail : string().email(),
      date_inscription: string().datetime(),
    }),
  });
}

const webinaireZodSchema = new WebinaireZodSchema();
export default webinaireZodSchema;
