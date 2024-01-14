import { User } from '@entities/Newsletters';
import NewslettersUser from './newsletters.model';

const create = async (user: User) => {
  try {
    const newUser = await NewslettersUser.create(user);
    return newUser.toJSON();
  } catch (err) {
    throw new Error('something went wrong went creating a new User');
  }
};

const remove = async (email: string) => {
  try {
    const deletedUser = await NewslettersUser.findOneAndDelete({ email });
    return deletedUser?.toJSON();
  } catch (err) {
    throw new Error('something went wrong went creating a new User');
  }
};

const newsLettersService = {
  create,
  remove,
};

export default newsLettersService;
