import { createDirectus, createItem, rest, staticToken } from '@directus/sdk';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import suggestionsService from './suggestions.service';
import mailingService from '@components/mailing/mailing.service';
import dotenv from 'dotenv';
import Handlebars from 'handlebars';

if (process.env && process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}

const templateMailToUser = readFileSync(
  process.env.PATH_TO_MAILS_TEMPLATES + 'suggestions/template-mail-to-user.hbs',
  'utf-8'
);
const templateMailToAdmin = readFileSync(
  process.env.PATH_TO_MAILS_TEMPLATES +
    'suggestions/template-mail-to-admin.hbs',
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
    const template1 = Handlebars.compile(templateMailToUser);
    const parsedMail1 = template1({});

    // the send the mail
    mailingService.send2({
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      html: parsedMail1,
    });

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
      html: parsedMail2,
    });

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'something went wrong' });
  }
};

const suggestionsController = {
  makeSuggestion,
};

export default suggestionsController;
