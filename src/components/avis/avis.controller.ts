import { Request, Response } from 'express';
import { avisService } from './avis.services';
import { readFileSync } from 'fs';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';

const confirmationTemplate = readFileSync(
  path.join(__dirname, '../../views/avis/template-mail-to-user.hbs'),
  'utf-8'
);

const giveAvis = async (req: Request, res: Response) => {
  const { message, email, impression, subject } = req.body;
  try {
    // store avis to db
    const avis = await avisService.createAvis({
      subject,
      message,
      email,
      impression,
    });

    // store avis to cms

    // send mail to user
    const template = Handlebars.compile(confirmationTemplate);
    mailingService.sendWithNodemailer({
      to: email,
      html: template({ subject }),
      subject: 'Votre avis a ete recu',
    });

    return res.json({ msg: 'success', avis });
  } catch (err) {
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const getAvisView = async (req: Request, res: Response) => {
  const { name } = req.query;
  try {
    const view = await avisService.readAvisFrontendViewByName(name as string);
    res.json({ msg: 'success', view });
  } catch (error) {
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};


const avisController = {
  giveAvis,
  getAvisView,
};

export { avisController };
