import mailingService from '@components/mailing/mailing.service';
import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';
import { initEnv } from '@utils/initEnvIronementVariables';
import { Request, Response } from 'express';
//import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import suggestionsService from './suggestions.service';
import mailingService from '@components/mailing/mailing.service';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
//const templateMailToUser = readFileSync('@constants/mail/template-mail-to-user.html');
//const templateMailToAdmin = readFileSync('@constants/mail/template-mail-to-admin.html');
const confirmationTemplate = fs.readFileSync(
  path.join(__dirname, '../../views/all/confirmation.hbs'),
  'utf-8'
);

const makeSuggestion = async (req: Request, res: Response) => {
  const { author, description, title } = req.body;
  try {
    // store suggestion
    const suggest = await suggestionsService.create({
      author,
      description,
      title,
    });

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
    const template = Handlebars.compile(confirmationTemplate);

    const mailOptions = {
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      text: template({}),
    };

    // the send the mail
    // console.log('mailingOptions', mailOptions);
    mailingService.send(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(templateMailToAdmin);

    const parsedMail2 = template2({
      name: suggest.author?.name || '',
      title: suggest.title,
    });
    // SEND EMAIL

    mailingService.send2({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      text: template({}),
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
    res.status(400).json({ msg: 'something went wrong' });
  }
};

const suggestionsController = {
  makeSuggestion,
};

export default suggestionsController;
