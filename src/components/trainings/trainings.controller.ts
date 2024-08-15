/* eslint-disable  @typescript-eslint/no-explicit-any */
import { add, search } from '@services/queries';
import Handlebars from 'handlebars';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/trainings/mail-to-admin.hbs'),
  'utf-8'
);

const templateMailToUser = readFileSync(
  path.join(__dirname, '../../views/trainings/mail-to-user.hbs'),
  'utf-8'
);

const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach(
    k => !obj[k] && obj[k] !== undefined && delete obj[k]
  );
  return obj;
};
const create = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const data = removeEmpty(req.body);
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      newsletter,
      phoneIndex,
      channel,
    } = data;
    // add candidate
    /*
    add('/api/backoffice/candidate', {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_index: phoneIndex,
      phone: phoneNumber,
      newsletter,
      channel,
    });
    */
    add('/api/backoffice/contacts', {
      first_name: firstName,
      last_name: lastName,
      phone_index: phoneIndex,
      phone: phoneNumber,
      email: email,
      newsletter,
      channel,
    });
    add('/api/contacts/contact', {
      firstName,
      lastName,
      phoneindex: phoneIndex,
      phone: phoneNumber,
      email: email,
      tags: `devdelopper, tech${newsletter ? ', ' + newsletter : ''}`,
      position: 'client',
    });
    const response = await search(
      `/api/backoffice/trainings/${id}?fields=id,title,programs.*`
    );

    const training = response?.data.data;
    const {programs = []} = training;
    const templateUserMail = Handlebars.compile(templateMailToUser);
    mailingService.send({
      to: email,
      subject: `chillo.tech - programme de la formation ${training.title}`,
      html: templateUserMail({
        name: `${firstName} ${lastName}`,
        title: training.title,
        link: programs[0].file,
        linkLabel: "Télécharger le programme"

      }),
    });

    const template = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouveau téléchargement de la formation ${training.title}`,
      html: template({
        name: `${firstName} ${lastName}`,
        title: training.title,
        phone: `${phoneIndex}${phoneNumber}`,
        email: email,
      }),
    });

    res.json({ msg: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Une erreur est survenue' });
  }
};

const trainingController = {
  create,
};

export { trainingController };
