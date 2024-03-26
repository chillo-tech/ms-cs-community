import { add } from '@services/queries';
import Handlebars from 'handlebars';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/webinaire/mail-to-admin.hbs'),
  'utf-8'
);

const create = async (req: Request, res: Response) => {
  const {
    nom,
    prenom,
    numero_telephone,
    consentement_marketing,
    connaissance_webinaire,
    adresse_mail,
    date_inscription,
  } = req.body;
  try {
    add('/api/backoffice/Webinaire', {
      nom,
      prenom,
      numero_telephone,
      consentement_marketing,
      connaissance_webinaire,
      adresse_mail,
      date_inscription,
      ...req.body,
    });

    const template = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouvelle reponse au webinaire !`,
      html: template({
        name: `${nom} ${prenom}`,
      }),
    });

    return res.json({ msg: 'success' });
  } catch (err) {
    return res.status(500).json({ msg: 'something went wrong' });
  }
};

const webinaireController = {
  create,
};

export { webinaireController };
