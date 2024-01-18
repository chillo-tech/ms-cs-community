import { search } from '@services/queries';
import { Request, Response } from 'express';

const getAvisAndSuggestions = async (req: Request, res: Response) => {
  try {
    const avis = await search(
      `/api/backoffice/avis?fields=*,avis_id.*&limit=20&filter[status][_eq]=published&filter[note][_gte]=4`
    );
    const suggestions = await search(
      '/api/backoffice/suggestion?fields=*,suggestion_contact.contact_id.*&limit=20&filter[status][_eq]=published&filter[statut][_eq]=VALIDE'
    );
    res.json({
      msg: 'success',
      avis: avis.data,
      suggestions: suggestions.data,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

export { getAvisAndSuggestions };
