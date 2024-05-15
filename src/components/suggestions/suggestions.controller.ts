import { Request, Response } from 'express';
import Handlebars from 'handlebars';
import suggestionsService from './suggestions.service';
import mailingService from '@components/mailing/mailing.service';
import fs from 'fs';
import { add } from '@services/queries';
import path from 'path';
import { contactService } from '@components/contact/contact.services';

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

    contactService.create(author);

    const tempTag = ['tech'];
    if (suggest.author?.tag) {
      tempTag.push(...suggest.author.tag);
    }

    const contact = {
      phone_index: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      first_name: suggest.author?.firstName,
      last_name: suggest.author?.lastName,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      position: suggest.author?.tag.join(', '),
    };

    const contactAddedRes = await add('/api/backoffice/contacts', contact);

    const contactToSecondBackoffice = {
      phoneIndex: suggest.author?.phoneIndex?.toString(),
      phone: suggest.author?.phone?.toString(),
      firstName: suggest.author?.firstName,
      lastName: suggest.author?.lastName,
      email: suggest.author?.email,
      tags: tempTag.join(', '),
      position: suggest.author?.tag.join(', '),
    };

    add('/api/contacts/contact', contactToSecondBackoffice);

    const suggestion = {
      title: suggest.title,
      description: suggest.description,
      author: contactAddedRes.data.data.id,
    };

    add('/api/backoffice/suggestions', suggestion);

    const template = Handlebars.compile(mailToUser);
    mailingService.send({
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      html: template({ name: `${author.name}` }),
    });

    const template2 = Handlebars.compile(mailToAdmin);
    const parsedMail2 = template2({
      name: suggest.author?.firstName || '',
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
