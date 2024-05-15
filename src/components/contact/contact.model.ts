import { model } from 'mongoose';
import { contactSchema } from './contact.schemas';

const Contact = model('Contact', contactSchema);
export { Contact };
