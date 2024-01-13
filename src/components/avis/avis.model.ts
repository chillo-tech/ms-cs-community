import { model } from 'mongoose';
import { avisFrontViewSchema, avisSchema } from './avis.schemas';

const Avis = model('Avis', avisSchema);
const AvisFrontView = model('AvisFrontView', avisFrontViewSchema);
export { Avis, AvisFrontView };
