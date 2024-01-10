import { Request, Response } from 'express';
import { avisService } from './avis.services';

const giveAvis = async (req: Request, res: Response) => {
  const { message, email, impression } = req.body;
  try {
    // store avis to db
    const avis = await avisService.createAvis({
      message,
      email,
      impression,
    });

    // store avis to cms

    // send mail to user
  } catch (err) {
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const avisController = {
  giveAvis,
};

export { avisController };
