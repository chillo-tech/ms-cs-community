import { Request, Response } from 'express';
import Handlebars from 'handlebars';
import suggestionsService from './suggestions.service';
import mailingService from '@components/mailing/mailing.service';
import fs from 'fs';
import { add } from '@services/queries';
import path from 'path';

const mailToUser = fs.readFileSync(
  path.join(__dirname, '../../views/suggestions/template-mail-to-user.hbs'),
  'utf-8'
);

const mailToAdmin = fs.readFileSync(
  path.join(__dirname, '../../views/suggestions/template-mail-to-admin.hbs'),
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
    const suggestion = {
      lastName: suggest.author?.name,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      phoneIndex: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      title: suggest.title,
      description: suggest.description,
    };
    await add('/api/backoffice/contact', suggestion);
    const templateMailToUser = fs.readFileSync(path.join(__dirname, '../../views/suggestions/template-mail-to-user.hbs'),'utf-8');
    let template = Handlebars.compile(templateMailToUser);
    let mailOptions = {
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      html: template({ name: `${author.name}` }),
    };

    // the send the mail
    mailingService.sendWithNodemailer(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const template2 = Handlebars.compile(mailToAdmin);

    const parsedMail2 = template2({
      name: suggest.author?.name || '',
      title: suggest.title,
    });
    // SEND EMAIL

    mailingService.sendWithNodemailer({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      html: parsedMail2,
    });

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.log('error occured when trying to make a suggestion', e);
    res.status(400).json({ msg: 'Une erreur est survenues' });
  }
};

const suggestionsController = {
  makeSuggestion,
};

export default suggestionsController;
