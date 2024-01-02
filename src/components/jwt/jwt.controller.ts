import { Request, Response } from 'express';
import jwtService from './jwt.service';

const createToken = (_: Request, res: Response) => {
  const token = jwtService.createToken();
  res.json({ msg: 'succes', token: `Bearer ${token}` });
};

const jwtController = {
  createToken,
};

export default jwtController;
