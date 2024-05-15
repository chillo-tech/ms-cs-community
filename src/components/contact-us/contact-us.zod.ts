import { object, string } from 'zod';

class ContactUsZodSchema {
  createContactUsSchema = object({
    body: object({
      data: object({
        email: string({
          required_error: 'Email is required',
          invalid_type_error: 'email should be a string',
        }).email(),
        message: string({
          invalid_type_error: 'the message should be a string',
        }),
        firstName: string({
          invalid_type_error: 'the firstName should be a string',
        }).optional(),
        lastName: string({
          invalid_type_error: 'the lastName should be a string',
        }).optional(),
        phone: string({
          invalid_type_error: 'the phone should be a string',
        }).optional(),
        phoneIndex: string({
          invalid_type_error: 'the phoneIndex should be a string',
        }).optional(),
        subject: string({
          invalid_type_error: 'the subject should be a string',
        }).optional(),
      }),
      appName: string({
        invalid_type_error: 'the note should be a string',
      }),
    }),
  });
}

const contactUsZodSchema = new ContactUsZodSchema();
export default contactUsZodSchema;
