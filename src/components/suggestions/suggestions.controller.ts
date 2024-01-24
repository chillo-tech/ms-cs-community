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
    const suggest = await suggestionsService.create({
      author,
      description,
      title,
    });

    const tempTag = ['tech'];
    if (suggest.author?.tag) {
      tempTag.push(...suggest.author.tag);
    }

    const contact = {
      phoneIndex: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      firstName: suggest.author?.name,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      position: suggest.author?.tag.join(', '),
    };
    const contactToSecondBackoffice = {
      phoneindex: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      name: suggest.author?.name,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      position: suggest.author?.tag.join(', '),
    };

    add('/api/contacts/contact', contactToSecondBackoffice);

    const suggestion = {
      titre: suggest.title,
      description: suggest.description,
      suggestion_contact: [
        {
          contact_id: contact,
        },
      ],
    };

    add('/api/backoffice/suggestion', suggestion);

    const template = Handlebars.compile(mailToUser);
    mailingService.send({
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      html: template({ name: `${author.name}` }),
    });

    const template2 = Handlebars.compile(mailToAdmin);
    const parsedMail2 = template2({
      name: suggest.author?.name || '',
      title: suggest.title,
    });

    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      html: parsedMail2,
    });

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.error('error occured when trying to make a suggestion', e);
    res.status(400).json({ msg: 'Une erreur est survenues' });
  }
};

const suggestionsController = {
  makeSuggestion,
};

export default suggestionsController;
