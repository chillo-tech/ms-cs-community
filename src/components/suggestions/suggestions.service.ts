import { SuggestionType } from '@entities/Suggest';
import Suggestions from './suggestions.model';

const create = async (suggestion: SuggestionType) => {
  try {
    const newSuggestion = await Suggestions.create(suggestion);
    return newSuggestion.toJSON();
  } catch (err) {
    throw new Error('Une erreur est survenue went creating a new suggestion');
  }
};

const suggestionsService = {
  create,
};

export default suggestionsService;
