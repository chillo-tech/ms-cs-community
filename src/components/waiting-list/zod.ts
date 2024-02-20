import { number, object, string, union } from 'zod';

class NewslettersZodSchema {
  createNewSlugSchema = object({
    body: object({
      title: string().optional(),
      video: string().url(),
      formationSlug: string().optional(),
      sessionsSlug: string().optional(),
    }),
  });

  subscribetoWaitingListSchema = object({
    body: object({
      name: string(),
      email: string().email(),
    }),
  });

  unscrubcribeToWaitingListSchema = object({
    query: object({
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
