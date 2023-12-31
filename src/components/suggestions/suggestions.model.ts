import { model } from 'mongoose';
import { suggestSchema } from './suggestions.schema';

const Suggest = model('Suggest', suggestSchema);
export default Suggest;

