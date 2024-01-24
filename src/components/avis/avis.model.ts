import { model } from 'mongoose';
import { avisSchema } from './avis.schemas';

const Avis = model('Avis', avisSchema);
export { Avis };
