import { model } from 'mongoose';
import { contactUsSchema } from './contact-us.schema';

const ContactUs = model('ContactUs', contactUsSchema);
export { ContactUs };
