import mailingService from '@components/mailing/mailing.service';
import { add as BackOfficeAdd, patch } from '@services/queries';
import { initEnv } from '@utils/initEnvIronementVariables';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import newsLettersService from './newsletters.service';
import { contactService } from '@components/contact/contact.services';
import jwtService from '@components/jwt/jwt.service';
import { AxiosResponse } from 'axios';

initEnv();

const templateMailToUserSubscribe = readFileSync(
  path.join(__dirname, '../../views/newsletters/template-mail-to-user.hbs'),
  'utf-8'
);
const templateMailToAdminSubscribe = readFileSync(
  path.join(__dirname, '../../views/newsletters/template-mail-to-admin.hbs'),
  'utf-8'
);
const templateMailToUserUnsubscribe = readFileSync(
  path.join(
    __dirname,
    '../../views/newsletters/template-mail-to-user-unsubscribe.hbs'
  ),
  'utf-8'
);
const templateMailToAdminUnsubscribe = readFileSync(
  path.join(
    __dirname,
    '../../views/newsletters/template-mail-to-admin-unsubscribe.hbs'
  ),
  'utf-8'
);

const add = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await newsLettersService.create({
      firstName,
      lastName,
      email,
      isActive: true,
    });

    contactService.create({
      lastName,
      firstName,
      phone: '',
      phoneIndex: '',
      email,
      position: '',
      tags: 'newsletter',
    });

    let backofficeResponse: AxiosResponse | undefined;
    try {
      backofficeResponse = await BackOfficeAdd('/api/backoffice/contacts', {
        first_name: firstName,
        last_name: lastName,
        tags: 'newsletter',
        newsletter: true,
        email,
      });
    } catch (err) {
      console.log("erreur lors de l'ajour du contact au backoffice", err);
    }

    let contactOfficeResponse: AxiosResponse | undefined;
    try {
      contactOfficeResponse = await BackOfficeAdd('/api/contacts/contact', {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        tags: 'newsletter',
      });
    } catch (err) {
      console.log("erreur lors de l'ajour du contact au backoffice", err);
    }

    const backoffice_contact_id = backofficeResponse?.data.data?.id;
    const contactoffice_contact_id = contactOfficeResponse?.data.data?.id;

    const unsubscribeLink = `${
      process.env.FRONTEND_URL
    }/api/backend/newsletters/unsubscribe?payload=${jwtService.createToken(
      '24h',
      {
        name: `${firstName} ${lastName}` as string,
        email,
        backoffice_contact_id,
        contactoffice_contact_id,
      }
    )}`;

    const template1 = Handlebars.compile(templateMailToUserSubscribe);
    mailingService.send({
      to: email,
      subject:
        'Nous avons bien reçu votre inscription à notre newsletter. Merci!',
      html: template1({ name: `${firstName} ${lastName}`, unsubscribeLink }),
    });

    const template2 = Handlebars.compile(templateMailToAdminSubscribe);

    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvel utilisateur pour la newsletter!',
      html: template2({ name: `${firstName} ${lastName}`, email }),
    });

    res.json({ msg: 'success', user });
  } catch (e) {
    console.error('Error when trying to register a user', e);
    res.status(400).json({ msg: 'Une erreur est survenue' });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const decodedToken = jwtService.decodeToken(req.query.payload as string);
  if (typeof decodedToken === 'string') {
    return res.status(400).json({ msg: 'Invalid token' });
  }
  const { name, email, backoffice_contact_id, contactoffice_contact_id } =
    decodedToken;
  try {
    newsLettersService.remove(email as string);
    try{
    patch(`/api/backoffice/contacts/${backoffice_contact_id}`, {
      newsletter: false,
    });

    patch(`/api/contacts/contact/${contactoffice_contact_id}`, {
      newsletter: false,
    });
  } catch(err){
    console.log('error while trying to unsubcribe!',err)
  }
    const template1 = Handlebars.compile(templateMailToUserUnsubscribe);
    mailingService.send({
      to: email as string,
      subject:
        'Nous avons bien reçu votre désabonnement aux newsletters, Merci!',
      html: template1({}),
    });

    const template2 = Handlebars.compile(templateMailToAdminUnsubscribe);
    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de se désabonner aux newsletters!',
      html: template2({ name, email }),
    });

    res.json({ msg: 'success' });
  } catch (e) {
    console.error('error when trying ro unscubscribe a user', e);
    res.status(400).json({ msg: 'Une erreur est survenue' });
  }
};

export { add, unsubscribe };
