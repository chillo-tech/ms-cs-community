import { Avis, AvisFrontView } from './avis.model';
import { AvisFrontViewType, AvisType } from './avis.types';

const createAvis = async (submittedAvis: AvisType) => {
  try {
    const avis = await Avis.create(submittedAvis);
    return avis.toJSON();
  } catch (error) {
    throw new Error("Erreur lors de la creation d'un avis");
  }
};

const readAvisFrontendViewByName = async (name: string) => {
  try {
    const view = await AvisFrontView.findOne({ name });

    return view?.toJSON();
  } catch (error) {
    throw new Error("Erreur lors de la lecture de la vue d'un avis");
  }
};

const createAvisFrontendView = async (avisFrontendView: AvisFrontViewType) => {
  try {
    const view = await AvisFrontView.create(avisFrontendView);
    return view.toJSON();
  } catch (error) {
    throw new Error("Erreur lors de la creation de la vue d'un avis");
  }
};

const avisService = {
  createAvis,
  readAvisFrontendViewByName,
  createAvisFrontendView,
};
export { avisService };
