import { object, string } from 'zod';

class WaitingListZodSchema {
  getVideoSchema = object({
    query: object({
      id: string().uuid(),
    }),
  });

  subscribetoWaitingList = object({
    body: object({
      name: string(),
      email: string().email(),
      videoId: string().uuid(),
    }),
  });
}

const waitingListZodSchema = new WaitingListZodSchema();
export default waitingListZodSchema;
