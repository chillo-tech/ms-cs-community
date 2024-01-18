import { Request, Response } from 'express';
import { avisService } from './avis.services';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
import { add } from '@services/queries';

const confirmationTemplate = readFileSync(
  path.join(__dirname, '../../views/avis/template-mail-to-user.hbs'),
  'utf-8'
);

const giveAvis = async (req: Request, res: Response) => {
  const { message, email, note, subject } = req.body;
  try {
    // store avis to db
    const avis = await avisService.createAvis({
      subject,
      message,
      email,
      note,
    });

    // store avis to cms
    await add('/api/backoffice/contact', {
      message,
      email,
      note,
      subject,
    });

    // send mail to user
    const template = Handlebars.compile(confirmationTemplate);
    mailingService.sendWithNodemailer({
      to: email,
      html: template({ subject }),
      subject: 'Votre avis a ete recu',
    });

    return res.json({ msg: 'success', avis });
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const getAvisView = async (req: Request, res: Response) => {
  const { slug } = req.query;
  try {
    const view = await avisService.readAvisFrontendViewBySlug(slug as string);
    if (!view) return res.status(404).json({ msg: 'view not found' });
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
