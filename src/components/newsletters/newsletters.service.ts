import { User } from '@entities/Newsletters';
import NewslettersUser from './newsletters.model';

const create = async (user: User) => {
  try {
    const newUser = await NewslettersUser.create(user);
    return newUser.toJSON();
  } catch (err) {
    console.error('Une erreur est survenue when creating a new User', err);
    throw new Error('Une erreur est survenue when creating a new User');
  }
};

const remove = async (email: string) => {
  try {
    const deletedUser = await NewslettersUser.findOneAndUpdate(
      { email },
      { isActive: false }
    );
    return deletedUser?.toJSON();
  } catch (err) {
    console.error('Une erreur est survenue when creating a new User', err);
    throw new Error('Une erreur est survenue when creating a new User');
  }
};

const newsLettersService = {
  create,
  remove,
};

export default newsLettersService;
