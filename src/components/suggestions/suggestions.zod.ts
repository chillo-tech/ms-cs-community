import { POSITIONS } from '@constants/suggestions';
import { ZodEnum, number, object, string } from 'zod';

class SuggestionsZodSchema {
  createSuggestionsSchema = object({
    body: object({
      author: object({
        name: string(),
        email: string().email(),
        tag: ZodEnum.create(POSITIONS)
          .array()
          .min(1, 'you should provide at least one tag')
          .optional(),
        phoneIndex: number(),
        phone: number(),
      }),
      title: string({
        required_error: 'Title is required',
        invalid_type_error: 'title should be a string',
      }),
      description: string({
        invalid_type_error: 'the description should be a string',
      }).optional(),
    }),
  });
}

const suggestionsZodSchema = new SuggestionsZodSchema();
export default suggestionsZodSchema;
