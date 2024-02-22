import { number, object, string } from 'zod';

class WaitingListZodSchema {
  getFormationSchema = object({
    query: object({
      slug: string(),
    }),
  });

  subscribetoWaitingList = object({
    body: object({
      name: string(),
      email: string().email(),
      formationId: number(),
    }),
  });
}

const waitingListZodSchema = new WaitingListZodSchema();
export default waitingListZodSchema;
