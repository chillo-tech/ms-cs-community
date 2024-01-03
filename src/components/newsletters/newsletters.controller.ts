import {
  createDirectus,
  createItem,
  deleteItem,
  rest,
  staticToken,
} from '@directus/sdk';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import newsLettersService from './newsletters.service';
import mailingService from '@components/mailing/mailing.service';

const templateMailToUserSubscribe = readFileSync(
  'src/constants/mail/newsletters/template-mail-to-user-subscribe.html'
);
const templateMailToAdminSubscribe = readFileSync(
  'src/constants/mail/newsletters/template-mail-to-admin-subscribe.html'
);
const templateMailToUserUnsubscribe = readFileSync(
  'src/constants/mail/newsletters/template-mail-to-user-unsubscribe.html'
);
const templateMailToAdminUnsubscribe = readFileSync(
  'src/constants/mail/newsletters/template-mail-to-admin-unsubscribe.html'
);

const registerNewUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    // store user
    const user = await newsLettersService.create({
      name,
      email,
    });

    // make external API calls

    const tempObj = {
      name: user.name,
      email: user.email,
    };

    const client = createDirectus(process.env.DIRECTUS_API_URI || '')
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));
    let directusKey: string = '';
    try {
      const directusRes = await client.request(
        createItem('newslettersUser', tempObj)
      );
      directusKey += directusRes.id;
    } catch (error) {
      console.log('failed to add a new user');
    }

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const mailOptions = {
      to: email,
      subject:
        'Nous avons bien reçu votre enregistrement aux newsletters, Merci!',
      text: templateMailToUserSubscribe.toString(),
    };
    const unsubscribeLink = `http://localhost:9000/newsletters/unsubscribe?name=${name}&email=${email}&directusKey=${directusKey}`;
    const mailParams1 = {
      unsubscribeLink,
    };

    // the send the mail
    // console.log('mailingOptions', mailOptions);
    mailingService.send(mailOptions, mailParams1);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const mailingOptions2 = {
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvel utilisateur pour les newsletters!',
      text: templateMailToAdminSubscribe.toString(),
    };

    // SEND EMAIL
    const mailParams2 = {
      name,
      email,
    };

    mailingService.send(mailingOptions2, mailParams2);

    res.json({ msg: 'success', user });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'something went wrong' });
  }
};

const unsubscribe = async (req: Request, res: Response) => {
  const { name, email, directusKey } = req.query;
  try {
    // delete user
    const user = await newsLettersService.remove(email);

    // make external API calls

    const client = createDirectus(process.env.DIRECTUS_API_URI || '')
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));

    client
      .request(deleteItem('newslettersUser', directusKey))
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
      });

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const mailOptions = {
      to: email,
      subject:
        'Nous avons bien reçu votre desabonnement aux newsletters, Merci!',
      text: templateMailToUserUnsubscribe.toString(),
    };

    // the send the mail
    // console.log('mailingOptions', mailOptions);
    mailingService.send(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const mailingOptions2 = {
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Un utilisateur vient de ce desabonner aux newsletters!',
      text: templateMailToAdminUnsubscribe.toString(),
    };

    // SEND EMAIL
    const mailParams2 = {
      name,
      email,
    };

    mailingService.send(mailingOptions2, mailParams2);

    res.json({ msg: 'success', user });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'something went wrong' });
  }
};

const newslettersController = {
  registerNewUser,
  unsubscribe,
};

export default newslettersController;
