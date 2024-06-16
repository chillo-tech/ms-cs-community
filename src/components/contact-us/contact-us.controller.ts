import { Request, Response } from 'express';
import { contactUsService } from './contact-us.service';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import mailingService from '@components/mailing/mailing.service';
import path from 'path';

const templateMailToUser = readFileSync(
  path.join(__dirname, '../../views/contact-us/template-mail-to-user.hbs'),
  'utf-8'
);
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/contact-us/template-mail-to-admin.hbs'),
  'utf-8'
);

const handleContact = async (req: Request, res: Response) => {
  try {
    const { data, appName } = req.body;
    const referrer = req.headers.referrer || req.headers.referer;
    await contactUsService.create({ ...data, appName, referrer });
    const template1 = Handlebars.compile(templateMailToUser);
    mailingService.send({
      to: data.email,
      subject: 'Nous avons recu votre message. Merci!',
      html: template1({}),
    });

    const template2 = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouveau message depuis ${appName}`,
      html: template2({
        email: data.email,
        appName,
        message: data.message,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        phoneIndex: data.phoneIndex,
      }),
    });

    res.status(201).json({
      msg: 'success',
    });
  } catch (error) {
    res.status(400).json({ msg: ' Une erreur est survenue!' });
  }
};

const contactUsController = {
  handle: handleContact,
};

export { contactUsController };
