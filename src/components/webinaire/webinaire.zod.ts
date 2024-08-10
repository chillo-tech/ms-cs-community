import { boolean, object, string } from 'zod';

class WebinaireZodSchema {
  createWebinaireSchema = object({
    body: object({
      firstName: string(),
      lastName: string(),
      email: string().email(),
      phoneIndex: string().optional(),
      phoneNumber: string().optional(),
      channel: string().optional(),
      newsletter: boolean().optional(),
    }),
    params: object({
      webinaire_id: string(),
      planning_id: string(),
    }),
  });
}

const webinaireZodSchema = new WebinaireZodSchema();
export default webinaireZodSchema;
