import { object, string } from 'zod';

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
      directusKey: string(),
    }),
  });
}

const newslettersZodSchema = new NewslettersZodSchema();
export default newslettersZodSchema;
