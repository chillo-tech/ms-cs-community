import { model } from 'mongoose';
import { suggestionsSchema } from './suggestions.schema';

const Suggestions = model('Suggestions', suggestionsSchema);
export default Suggestions;

