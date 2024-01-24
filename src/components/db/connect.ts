import mongoose from 'mongoose';
export const dbInit = async () => {
  try {
    if (!process.env.DB_URI) {
      return false;
    }
    await mongoose.connect(process.env.DB_URI);
    return true;
  } catch (error) {
    return false;
  }
};
