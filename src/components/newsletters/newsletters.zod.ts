import { object, string } from 'zod';

class NewslettersZodSchema {
  createNewslettersUserSchema = object({
    body: object({
      firstName: string(),
      lastName: string(),
      email: string().email(),
    }),
  });
  deleteNewslettersUserSchema = object({
    query: object({
      payload: string(),
    }),
  });
}

const newslettersZodSchema = new NewslettersZodSchema();
export default newslettersZodSchema;
