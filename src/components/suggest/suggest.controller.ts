import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import mailingService from '../mailing/mailing.service';
import suggestService from './suggest.service';

const templateMailToUser = readFileSync('./src/constants/mail/template-mail-to-user.html');
const templateMailToAdmin = readFileSync('./src/constants/mail/template-mail-to-admin.html');

const makeSuggestion = async (req: Request, res: Response) => {
  const { author, description, title } = req.body;
  try {
    // store suggestion
    const suggest = await suggestService.create({
      author,
      description,
      title,
    });

    console.log('suggest', suggest);

    // make external API calls
    const tempTag = ['tech'];
    if (suggest.author?.tag) {
      tempTag.push(...suggest.author.tag);
    }
    const tempObj = {
      name: suggest.author?.name,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      phoneindex: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      title: suggest.title,
      description: suggest.description,
    };

    const client = createDirectus(process.env.DIRECTUS_API_URI || '')
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));

    client
      .request(createItem('contact', tempObj))
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err);
      });

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const mailOptions = {
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      text: templateMailToUser.toString(),
    };

    // the send the mail
    // console.log('mailingOptions', mailOptions);
    mailingService.send(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const mailingOptions2 = {
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      text: templateMailToAdmin.toString(),
    };

    // SEND EMAIL
    const mailParams = {
      name: suggest.author?.name || '',
      title: suggest.title,
    };

    mailingService.send(mailingOptions2, mailParams);

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'something went wrong' });
  }
};

const suggestController = {
  makeSuggestion,
};

export default suggestController;
