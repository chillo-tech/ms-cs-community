import mailingService from '@components/mailing/mailing.service';
import Handlebars from 'handlebars';
import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { add } from '@services/queries';

const templateMailToCandidate = readFileSync(
  path.join(__dirname, '../../views/inscriptions/mail-to-candidate.hbs'),
  'utf-8'
);
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/inscriptions/mail-to-admin.hbs'),
  'utf-8'
);
const notifyAll = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.body', req.body);
    const { candidate, session } = req.body;
    // envoyer le mail au candidat
    const templateCandidate = Handlebars.compile(templateMailToCandidate);
    mailingService.send({
      to: candidate.email,
      subject: `Nous avons bien enregistré votre inscription pour ${candidate.training}: Merci 😊  !`,
      html: templateCandidate({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        training: candidate.training,
        attentesLink: candidate.link,
      }),
    });
    // le envoyer le mail à l'admin
    const templateAdmin = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: candidate.email,
      subject: `Nous avons bien enregistré votre inscription pour ${candidate.training}: Merci 😊  !`,
      html: templateAdmin({
        name: `${candidate.firstName} ${candidate.lastName}`,
        formationName: candidate.training,
        sessionName: session.titre,
      }),
    });
    // Enregistrer le candidat dans contacts avec les tags, candidat, prospect, newsletter
    const contactToContactOffice = {
      phoneindex: candidate.phoneIndex,
      phone: candidate.phone,
      name: `${candidate.firstName} ${candidate.lastName}`,
      email: candidate.email,
      tags: 'devdelopper, tech, newsletter',
      position: 'client',
    };
    add('/api/contacts/contact', contactToContactOffice);
    res.json({ msg: 'success' });
  } catch (error) {
    next(error);
  }
};

const inscriptionController = { notifyAll };

export { inscriptionController };
