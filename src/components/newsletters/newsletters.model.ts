import { model } from 'mongoose';
import { newslettersUserSchema } from './newsletters.schema';

const NewslettersUser = model('NewslettersUsers', newslettersUserSchema);
export default NewslettersUser;
