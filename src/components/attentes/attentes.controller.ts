import mailingService from '@components/mailing/mailing.service';
import { add, search } from '@services/queries';
import { dateFormat } from '@utils/date-format';
import { heureFormat } from '@utils/heure-format';
import { initEnv } from '@utils/initEnvIronementVariables';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
initEnv();

const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/attentes/mail-to-admin.hbs'),
  'utf-8'
);

const create = async (req: Request, res: Response) => {
  try {
    const { sessionId, email, phoneIndex, phoneNumber, message } = req.body;
    add('/api/backoffice/attente_session_formation', {
      email,
      phoneIndex,
      phoneNumber,
      texte: message,
      attente_id: sessionId,
    });

    const sessionResponse = await search(
      `/api/backoffice/Session/${sessionId}/?fields=*,training.*`
    );
    const session = sessionResponse?.data.data;
    const trainingName = session.training.title;
    // send email to admin
    const templateAdmin = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouvelles attentes pour ${trainingName}: Merci 😊  !`,
      html: templateAdmin({
        email,
        formationName: trainingName,
        sessionName: session.titre,
        date: dateFormat(session.date_heure),
        heure: heureFormat(session.date_heure),
      }),
    });
    // Enregistrer le candidat dans contacts avec les tags, candidat, prospect, newsletter
    const contactToContactOffice = {
      phoneindex: phoneIndex,
      phone: phoneNumber,
      name: ``,
      email: email,
      tags: 'devdelopper, tech, newsletter',
      position: 'client',
    };
    add('/api/backoffice/contact', contactToContactOffice);

    const contactToBackoffice = {
      phoneIndex,
      phone: phoneNumber,
      name: ``,
      email: email,
      tags: 'devdelopper, tech, newsletter',
      position: 'client',
    };
    add('/api/backoffice/contact', contactToBackoffice);
    return res.json({ msg: 'success' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ msg: 'something went wrong' });
  }
};

const attentesController = { create };

export { attentesController };
