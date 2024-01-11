import { Request, Response } from 'express';
//import { readFileSync } from 'fs';
import suggestionsService from './suggestions.service';
import mailingService from '@components/mailing/mailing.service';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { add } from '@services/queries';

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
      text: template({ name: `${author.name}` }),
    };

    // SEND EMAIL TO AUTHOR
    mailingService.send(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const templateMailToAdmin = fs.readFileSync(path.join(__dirname, '../../views/suggestions/template-mail-to-admin.hbs'),'utf-8'); 
    template = Handlebars.compile(templateMailToAdmin);
    mailOptions = {
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      text: template({title: suggest.title, name: `${author.name}` }),
    };

    mailingService.send(mailOptions);

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'Une erreur est survenues' });
  }
};

const suggestionsController = {
  makeSuggestion,
};

export default suggestionsController;
