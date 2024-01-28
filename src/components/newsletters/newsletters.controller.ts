import jwtService from '@components/jwt/jwt.service';
import mailingService from '@components/mailing/mailing.service';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import querystring from 'querystring';
import newsLettersService from './newsletters.service';
import path from 'path';
import { initEnv } from '@utils/initEnvIronementVariables';
import { add as BackOfficeAdd, patch } from '@services/queries';

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
  path.join(__dirname, '../../views/newsletters/template-mail-to-user.hbs'),
  'utf-8'
);
const templateMailToAdminUnsubscribe = readFileSync(
  path.join(__dirname, '../../views/newsletters/template-mail-to-admin.hbs'),
  'utf-8'
);

const add = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await newsLettersService.create({
      name,
      email,
      isActive: true,
    });

    const tempObj = {
      firstName: user.name,
      name: user.name,
      email: user.email,
      tags: 'newsletter',
      newsletter: true,
    };

    const backofficeResponse = await BackOfficeAdd(
      '/api/backoffice/contact',
      tempObj
    );
    const contactOfficeResponse = await BackOfficeAdd(
      '/api/contacts/contact',
      tempObj
    );

    const backoffice_contact_id = backofficeResponse.data.data?.id;
    const contactoffice_contact_id = contactOfficeResponse.data.data?.id;

    const unsubscribeLink = `${
      process.env.FRONTEND_URL
    }/api/backend/newsletters/unsubscribe?${querystring.encode({
      name: name as string,
      email,
      backoffice_contact_id,
      contactoffice_contact_id,
    })}`;

    const template1 = Handlebars.compile(templateMailToUserSubscribe);
    mailingService.send({
      to: email,
      subject:
        'Nous avons bien reçu votre inscription à notre newsletter. Merci!',
      html: template1({ name: `${name}`, unsubscribeLink }),
    });

    const template2 = Handlebars.compile(templateMailToAdminSubscribe);

    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvel utilisateur pour la newsletter!',
      html: template2({ name, email }),
    });

    res.json({ msg: 'success', user });
  } catch (e) {
    console.error('Error when trying to register a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { name, email, backoffice_contact_id, contactoffice_contact_id } =
    req.query;
  try {
    newsLettersService.remove(email as string);
    patch(`/api/backoffice/contact/${backoffice_contact_id}`, {
      newsletter: false,
    });

    patch(`/api/contacts/contact/${contactoffice_contact_id}`, {
      newsletter: false,
    });
    const template1 = Handlebars.compile(templateMailToUserUnsubscribe);
    mailingService.send({
      to: email as string,
      subject:
        'Nous avons bien reçu votre desabonnement aux newsletters, Merci!',
      html: template1({}),
    });

    const template2 = Handlebars.compile(templateMailToAdminUnsubscribe);
    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de ce desabonner aux newsletters!',
      html: template2({ name, email }),
    });

    res.redirect(
      (process.env.FRONTEND_URL || 'https://chillo.tech/') +
        '/newsletters/unsubscribe'
    );
  } catch (e) {
    console.error('error when trying ro unscubscribe a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

export { add, unsubscribe };
