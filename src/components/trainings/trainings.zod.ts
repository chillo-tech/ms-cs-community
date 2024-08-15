import { boolean, object, string } from 'zod';

class TrainingZodSchema {
  createtrainingSchema = object({
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
      id: string()
    }),
  });
}

const trainingZodSchema = new TrainingZodSchema();
export default trainingZodSchema;
