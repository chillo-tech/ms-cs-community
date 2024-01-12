import jwtService from '@components/jwt/jwt.service';
import mailingService from '@components/mailing/mailing.service';
import {
  createDirectus,
  createItem,
  deleteItem,
  rest,
  staticToken,
} from '@directus/sdk';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import querystring from 'querystring';
import newsLettersService from './newsletters.service';
import path from 'path';
import { initEnv } from '@utils/initEnvIronementVariables';

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

const registerNewUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    // store user
    const user = await newsLettersService.create({
      name,
      email,
      isActive: true,
    });

    // make external API calls

    const tempObj = {
      name: user.name,
      email: user.email,
      tags: 'newsletter',
    };
    let directusKey = '';

    const client = createDirectus(process.env.DIRECTUS_API_URI || '')
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));
    try {
      const directusRes = await client.request(createItem('contact', tempObj));
      directusKey = `${directusRes.id}`;
    } catch (error) {
      console.log('failed to add a new user', error);
    }

    // send mail to confirm recption

    const token = 'Bearer ' + jwtService.createToken('24h');
    const unsubscribeLink = `http://localhost:9000/api/v1/newsletters/unsubscribe?${querystring.encode(
      {
        name: name as string,
        email,
        directusKey,
        token,
      }
    )}`;

    const template1 = Handlebars.compile(templateMailToUserSubscribe);
    const parsedMail1 = template1({ unsubscribeLink });
    // the send the mail
    mailingService.sendWithNodemailer({
      to: email,
      subject:
        'Nous avons bien reçu votre enregistrement aux newsletters, Merci!',
      html: parsedMail1,
    });

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(templateMailToAdminSubscribe);

    const parsedMail2 = template2({ name, email });
    // SEND EMAIL

    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvel utilisateur pour les newsletters!',
      html: parsedMail2,
    });

    res.json({ msg: 'success', user });
  } catch (e) {
    console.log('Error when trying to register a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { name, email, directusKey } = req.query;
  try {
    // delete user
    await newsLettersService.remove(email as string);

    // make external API calls

    const client = createDirectus(process.env.DIRECTUS_API_URI || '')
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));

    client.request(deleteItem('contact', directusKey as string)).catch(err => {
      console.log('error when deleting a contact', err);
    });

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const template1 = Handlebars.compile(templateMailToUserUnsubscribe);
    const parsedMail1 = template1({});
    // the send the mail
    mailingService.sendWithNodemailer({
      to: email as string,
      subject:
        'Nous avons bien reçu votre desabonnement aux newsletters, Merci!',
      html: parsedMail1,
    });

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(templateMailToAdminUnsubscribe);

    const parsedMail2 = template2({ name, email });
    // SEND EMAIL

    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de ce desabonner aux newsletters!',
      html: parsedMail2,
    });

    // res.json({ msg: 'success', user });
    res.redirect(
      (process.env.FRONTEND_URI || 'https://chillo.tech/') +
        '/newsletters-unsubscribe'
    );
  } catch (e) {
    console.log('error when trying ro unscubscribe a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

const newslettersController = {
  registerNewUser,
  unsubscribe,
};

export default newslettersController;
