import mailingService from '@components/mailing/mailing.service';
import Handlebars from 'handlebars';
import { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { add, search } from '@services/queries';
import { initEnv } from '@utils/initEnvIronementVariables';
initEnv();

const templateMailToCandidate = readFileSync(
  path.join(__dirname, '../../views/formations/mail-to-candidate.hbs'),
  'utf-8'
);
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/formations/mail-to-admin.hbs'),
  'utf-8'
);
const notifyAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('req.body', req.body);

    const sessionResponse = await search(
      `/api/backoffice/Session/${req.body.data.payload.Session_id}/?fields=*,formation.*`
    );

    const attentesLink = `${process.env.FRONTEND_URL}/${sessionResponse.data.data.formation.slug}/${sessionResponse.data.data.slug}/attentes/`;

    const session = sessionResponse.data.data;

    const candidate = req.body.data.payload.candidate_id;
    console.log('candidate', candidate);
    console.log('session', session);
    // envoyer le mail au candidat
    const templateCandidate = Handlebars.compile(templateMailToCandidate);
    const startDate = new Date(session.date_heure);
    mailingService.send({
      to: candidate.email,
      subject: `Nous avons bien enregistré votre inscription pour ${candidate.training}: Merci 😊  !`,
      html: templateCandidate({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        training: candidate.training,
        attentesLink: attentesLink,
        sessionName: session.titre,
        heure: startDate.getHours() + ':' + startDate.getMinutes(),
        date: `${startDate.getDate()} / ${
          startDate.getMonth() + 1
        } / ${startDate.getFullYear()}`,
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
        date: `${startDate.getDate()} / ${
          startDate.getMonth() + 1
        } / ${startDate.getFullYear()}`,
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
