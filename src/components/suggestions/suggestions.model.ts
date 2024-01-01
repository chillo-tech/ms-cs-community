import { model } from 'mongoose';
import { suggestionsSchema } from '@components/suggestions/suggestions.schema';

const Suggestions = model('Suggestions', suggestionsSchema);
export default Suggestions;

