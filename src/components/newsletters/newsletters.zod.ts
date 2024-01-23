import { number, object, string, union } from 'zod';

class NewslettersZodSchema {
  createNewslettersUserSchema = object({
    body: object({
      name: string(),
      email: string().email(),
    }),
  });
  deleteNewslettersUserSchema = object({
    query: object({
      name: string(),
      email: string().email(),
      backoffice_contact_id: union([string(), number()]),
      contactoffice_contact_id: union([string(), number()]),
    }),
  });
}

const newslettersZodSchema = new NewslettersZodSchema();
export default newslettersZodSchema;
