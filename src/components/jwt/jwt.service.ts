import jwt from 'jsonwebtoken';
import { privateKey } from './private_key';

const createToken = (duration?: string, payload: object = {}) => {
  const token = jwt.sign(
    {
      appName: 'SuggestSystem',
      ...payload,
    },
    privateKey,
    { expiresIn: duration || '1y' }
  );

  return token;
};

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, privateKey);
    return decoded;
  } catch (e) {
    return 'Invalid token';
  }
};

const jwtService = {
  createToken,
  decodeToken,
};

export default jwtService;
