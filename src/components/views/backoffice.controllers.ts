/* eslint-disable @typescript-eslint/no-explicit-any */
import { search } from '@services/queries';
import { AxiosError } from 'axios';
import { Request, Response } from 'express';

const AVIS_LENGTH = 2;
const MAX_AVIS_BODY_LENGTH = 362;

const getAvis = async (req: Request, res: Response) => {
  try {
    const avis = await search(
      `/api/backoffice/avis?fields=*,avis_id.*&limit=50&filter[status][_eq]=published&filter[note][_in]=4,5`
    );


    const preAvis = avis?.data.data?.filter(
      (el: any) => el.text && el.first_name && el.text.length <= MAX_AVIS_BODY_LENGTH
    );
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
    const err = error as AxiosError;

    console.log('error', err.response?.data);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const getSuggestions = async (req: Request, res: Response) => {
  try {
    const suggestions = await search(
      '/api/backoffice/suggestions?fields=*,author.*,author.contact_id.*&limit=20&filter[status][_eq]=published'
    );

    console.log('suggestions', suggestions?.data.data[0].author);

    res.json({
      msg: 'success',
      suggestions: suggestions?.data.data,
    });
  } catch (error) {
    const err = error as AxiosError;
    console.log('error', err.response?.data);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const frontendDataController = {
  getAvis,
  getSuggestions,
};
export { frontendDataController as backofficeController };
