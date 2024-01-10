import { Avis, AvisFrontView } from './avis.model';
import {
  AvisFrontViewType,
  AvisFrontViewUpdateType,
  AvisType,
} from './avis.types';

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

const updateAvisFrontendViewByName = async (
  name: string,
  update: AvisFrontViewUpdateType
) => {
  try {
    const view = await AvisFrontView.findByIdAndUpdate({ name }, update);
    return view?.toJSON();
  } catch (error) {
    throw new Error("Erreur lors de la mise a jour de la vue d'un avis");
  }
};

const deleteAvisFrontendViewByName = async (name: string) => {
  try {
    const view = await AvisFrontView.findByIdAndDelete({ name });
    return view;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de la vue d'un avis");
  }
};

const avisService = {
  createAvis,
  readAvisFrontendViewByName,
  createAvisFrontendView,
  updateAvisFrontendViewByName,
  deleteAvisFrontendViewByName,
};
export { avisService };
