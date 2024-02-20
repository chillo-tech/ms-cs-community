import { model } from 'mongoose';
import { waitingListUserSchema, slugSchema } from './schema';

const WaitingListUser = model('WaitingListUser', waitingListUserSchema);
const WaitingListSlug = model('WaitingList', slugSchema);

export { WaitingListSlug, WaitingListUser };
