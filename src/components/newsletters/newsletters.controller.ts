import jwtService from '@components/jwt/jwt.service';
import mailingService from '@components/mailing/mailing.service';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import querystring from 'querystring';
import newsLettersService from './newsletters.service';
import path from 'path';
import { initEnv } from '@utils/initEnvIronementVariables';
import { add as BackOfficeAdd } from '@services/queries';

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

    // make external API calls

    const tempObj = {
      firstName : user.name,
      name: user.name,
      email: user.email,
      tags: 'newsletter',
      
    };

    await BackOfficeAdd('/api/backoffice/contact', tempObj);
    await BackOfficeAdd('/api/contacts/contact', tempObj);

    // send mail to confirm recption
    const token = 'Bearer ' + jwtService.createToken('24h');
    const unsubscribeLink = `http://localhost:9000/api/v1/newsletters/unsubscribe?${querystring.encode(
      {
        name: name as string,
        email,
        token,
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
    const template1 = Handlebars.compile(templateMailToUserUnsubscribe);
    mailingService.sendWithNodemailer({
      to: email as string,
      subject:
        'Nous avons bien reçu votre desabonnement aux newsletters, Merci!',
      html: template1({}),
    });

    // SEND EMAIL TO OWNER
    const template2 = Handlebars.compile(templateMailToAdminUnsubscribe);
    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de ce desabonner aux newsletters!',
      html: template2({ name, email }),
    });

    res.redirect(
      (process.env.FRONTEND_URI || 'https://chillo.tech/') +
        '/newsletters/unsubscribe'
    );
  } catch (e) {
    console.log('error when trying ro unscubscribe a user', e);
    res.status(400).json({ msg: 'something went wrong' });
  }
};

export { add, unsubscribe };
