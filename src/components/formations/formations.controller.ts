import mailingService from '@components/mailing/mailing.service';
import { add, patch, search } from '@services/queries';
import { dateFormat } from '@utils/date-format';
import { heureFormat } from '@utils/heure-format';
import { initEnv } from '@utils/initEnvIronementVariables';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
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
    const sessionResponse = await search(
      `/api/backoffice/Session/${req.body.data.payload.Session_id}/?fields=*,formation.*`
    );

    const attentesLink = `${process.env.FRONTEND_URL}/${sessionResponse.data.data.formation.slug}/${sessionResponse.data.data.slug}/attentes/`;

    const session = sessionResponse.data.data;

    const candidate = req.body.data.payload.candidate_id;
    // envoyer le mail au candidat
    const templateCandidate = Handlebars.compile(templateMailToCandidate);
    mailingService.send({
      to: candidate.email,
      subject: `Nous avons bien enregistré votre inscription pour ${candidate.training}: Merci 😊  !`,
      html: templateCandidate({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        training: candidate.training,
        attentesLink: attentesLink,
        sessionName: session.titre,
        heure: heureFormat(session.date_heure),
        date: dateFormat(session.date_heure),
      }),
    });
    // le envoyer le mail à l'admin
    const templateAdmin = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: candidate.email,
      subject: `Nous avons bien enregistré votre inscription pour ${candidate.training}: Merci 😊  !`,
      html: templateAdmin({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        formationName: candidate.training,
        sessionName: session.titre,
        date: dateFormat(session.date_heure),
        heure: heureFormat(session.date_heure),
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

const inscrire = async (req: Request, res: Response, next: NextFunction) => {
  const { session_id, candidats } = req.body;
  try {
    const sessionResponse = await search(
      `/api/backoffice/Session/${session_id}/?fields=*,formation.*,candidat_inscrit,candidats`
    );
    console.log('candidats', sessionResponse.data.data.candidat_inscrit);
    await patch(`/api/backoffice/Session/${session_id}`, {
      candidats,
    });
    res.status(201).json({ msg: 'success' });
  } catch (error) {
    next(error);
  }
};
const inscriptionController = { notifyAll, inscrire };

export { inscriptionController };
