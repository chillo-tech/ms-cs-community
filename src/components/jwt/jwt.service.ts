import jwt from 'jsonwebtoken';
import { privateKey } from './private_key';

const createToken = (duration?: string,) => {
  const token = jwt.sign(
    {
      appName: 'SuggestSystem',
    },
    privateKey,
    { expiresIn: duration || '1y' }
  );

  return token;
};

const jwtService = {
  createToken,
};

export default jwtService;
