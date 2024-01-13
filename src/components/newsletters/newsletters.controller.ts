import mailingService from '@components/mailing/mailing.service';
import { add as queryAdd } from '@services/queries';
import { initEnv } from '@utils/initEnvIronementVariables';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import querystring from 'querystring';
import newsLettersService from './newsletters.service';

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
    // save user
    const user = await newsLettersService.create({
      name,
      email,
      isActive: true,
    });

    await queryAdd('/api/backoffice/contact', { name, email });

    const unsubscribeLink = `http://localhost:9000/api/v1/newsletters/unsubscribe?${querystring.encode(
      {
        name: name as string,
        email,
      }
    )}`;

    const template1 = Handlebars.compile(templateMailToUserSubscribe);
    // the send the mail
    mailingService.sendWithNodemailer({
      to: email,
      subject:
        'Nous avons bien reçu votre inscription à notre newsletter. Merci!',
      html: template1({ name: `${name}`, unsubscribeLink }),
    });

    // SEND EMAIL TO AUTHOR

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(templateMailToAdminSubscribe);
    // SEND EMAIL

    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvel utilisateur pour la newsletter!',
      html: template2({ name, email }),
    });

    res.json({ msg: 'success', user });
  } catch (e) {
    console.log('Error when trying to register a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { name, email } = req.query;
  try {
    // delete user
    await newsLettersService.remove(email as string);

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const template1 = Handlebars.compile(templateMailToUserUnsubscribe);
    // the send the mail
    mailingService.sendWithNodemailer({
      to: email as string,
      subject:
        'Nous avons bien reçu votre desabonnement aux newsletters, Merci!',
      html: template1({}),
    });

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(templateMailToAdminUnsubscribe);

    // SEND EMAIL

    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de ce desabonner aux newsletters!',
      html: template2({ name, email }),
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

export { add, unsubscribe };

