/* eslint-disable @typescript-eslint/no-explicit-any */
import { search } from '@services/queries';
import { Request, Response } from 'express';

const AVIS_LENGTH = 2;

const getAvis = async (req: Request, res: Response) => {
  try {
    const avis = await search(
      `/api/backoffice/avis?fields=*,avis_id.*&limit=10&filter[status][_eq]=published&filter[note][_gte]=4`
    );

    const preAvis = avis.data.data?.filter((el: any) => el.texte && el.nom);
    const finalAvis: any[] = [];
    const selectedIndex: number[] = [];
    if (preAvis.length <= AVIS_LENGTH) {
      finalAvis.push(...preAvis);
    } else {
      for (let i = 0; i < AVIS_LENGTH; i++) {
        let actualIndex = Math.floor(Math.random() * preAvis.length);
        while (selectedIndex.includes(actualIndex)) {
          actualIndex = Math.floor(Math.random() * preAvis.length);
        }
        selectedIndex.push(actualIndex);
        finalAvis.push(preAvis[actualIndex]);
      }
    }

    res.json({
      msg: 'success',
      avis: finalAvis,
    });
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await search(
      '/api/backoffice/suggestion?fields=*,suggestion_contact.contact_id.*&limit=20&filter[status][_eq]=published&filter[statut][_eq]=VALIDE'
    );
    res.json({
      msg: 'success',
      suggestions: suggestions.data.data,
    });
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const frontendDataController = {
  getAvis,
  getSuggestions
}
export { frontendDataController as backofficeController };
