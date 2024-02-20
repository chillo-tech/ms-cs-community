import { Schema } from 'mongoose';

export const slugSchema = new Schema({
  slug: String,
  video: String,
  formationSlug: String,
  sessionSlug: String,
});

export const waitingListUserSchema = new Schema({
  name: String,
  email: String,
  slug: String,
});
