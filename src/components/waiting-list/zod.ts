import { object, string } from 'zod';

class NewslettersZodSchema {
  getVideoSchema = object({
    query: object({
      id: string().uuid(),
    }),
  });

  subscribetoWaitingListSchema = object({
    body: object({
      name: string(),
      email: string().email(),
      videoId: string().uuid(),
    }),
  });
}

const newslettersZodSchema = new NewslettersZodSchema();
export default newslettersZodSchema;
