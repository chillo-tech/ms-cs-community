/* eslint-disable @typescript-eslint/ban-ts-comment */
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { privateKey } from '../components/jwt/private_key';

export const authToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader && !req.query.token) {
    const message = "veillez generer un jeton d'authentification.";
    return res.status(401).json({ message });
  }

  if (req.query.token && typeof req.query.token !== 'string') {
    const message = "veillez generer un jeton d'authentification.";
    return res.status(401).json({ message });
  }
  const token =
    req.query.token?.split(' ')[1] || authorizationHeader?.split(' ')[1] || '';

  jwt.verify(token, privateKey, (error, decodedtoken) => {
    if (error) {
      const message =
        "l'utilisateur n'est pas autorisé à acceder à la ressouce.";
      return res.status(401).json({ message });
    }

    if (
      decodedtoken &&
      (decodedtoken as JwtPayload)?.appName !== 'SuggestSystem'
    ) {
      return res.status(401).json({ message: 'non autorise' });
    }
    
    next();
  });
};
