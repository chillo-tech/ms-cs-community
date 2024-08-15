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

const templateMailToAdminItem = readFileSync(
  path.join(__dirname, '../../views/attentes/mail-to-admin-item.hbs'),
  'utf-8'
);

const create = async (req: Request, res: Response) => {
  try {
    const {
      sessionId,
      itemSlug,
      firstName,
      lastName,
      email,
      phoneIndex,
      phone: phoneNumber,
      message,
      appName,
    } = req.body;
    const itemresponse = await search(
      `/api/backoffice/item?filter[slug][_eq]=${itemSlug}`
    );
    const item = itemresponse?.data.data[0];
    /*
    if (itemSlug && !item)
      throw new Error(`No item found for slug ${itemSlug}`);
*/
    if (itemSlug) {
      add('/api/backoffice/attentes', {
        email,
        phoneIndex,
        phone: phoneNumber,
        message,
        firstName,
        lastName,
        item_id: item?.id,
      });
      const templateAdmin = Handlebars.compile(templateMailToAdminItem);
      mailingService.send({
        to: process.env.OWNER_EMAIL || '',
        subject: `Nouvelles attentes pour ${item.label}: Merci 😊  !`,
        html: templateAdmin({
          email,
          label: item.title,
          message,
          appName,
        }),
      });
    } else {
      add('/api/backoffice/attentes_sessions', {
        email,
        phoneIndex,
        phoneNumber,
        texte: message,
        attente_id: sessionId,
        item_id: item?.id,
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
    }

    // Enregistrer le candidat dans contacts avec les tags, candidat, prospect, newsletter
    const contactToContactOffice = {
      phoneindex: phoneIndex,
      phone: phoneNumber,
      firstName,
      lastName,
      email: email,
      tags: 'devdelopper, tech, newsletter',
      position: 'client',
    };
    add('/api/contacts/contact', contactToContactOffice);

    const contactToBackoffice = {
      phoneIndex,
      phone: phoneNumber,
      firstName,
      lastName,
      email: email,
      tags: 'devdelopper, tech, newsletter',
      position: 'client',
    };
    add('/api/backoffice/contacts', contactToBackoffice);
    return res.json({ msg: 'success' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ msg: 'Une erreur est survenue' });
  }
};

const attentesController = { create };

export { attentesController };
