import { SuggestionType } from '@entities/Suggest';
import Suggestions from './suggestions.model';

const create = async (suggestion: SuggestionType) => {
  try {
    const newSuggestion = await Suggestions.create(suggestion);
    return newSuggestion.toJSON();
  } catch (err) {
    console.log('err', err);
    throw new Error('something went wrong went creating a new suggestion');
  }
};

const suggestionsService = {
  create,
};

export default suggestionsService;
