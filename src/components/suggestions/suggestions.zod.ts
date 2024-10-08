import { POSITIONS } from '@constants/suggestions';
import { ZodEnum, object, string } from 'zod';

class SuggestionsZodSchema {
  createSuggestionsSchema = object({
    body: object({
      author: object({
        firstName: string(),
        lastName: string(),
        email: string().email(),
        tag: ZodEnum.create(POSITIONS)
          .array()
          .min(1, 'you should provide at least one tag')
          .optional(),
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
