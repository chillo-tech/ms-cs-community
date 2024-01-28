import { Avis } from './avis.model';
import {
  AvisType
} from './avis.types';

const createAvis = async (submittedAvis: AvisType) => {
  try {
    const avis = await Avis.create(submittedAvis);
    return avis.toJSON();
  } catch (error) {
    console.error("Erreur lors de la creation d'un avis");
  }
};

const avisService = {
  create: createAvis,
};
export { avisService };

