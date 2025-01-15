/* eslint-disable  @typescript-eslint/no-explicit-any */
import { add, patch, search } from '@services/queries';
import Handlebars from 'handlebars';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
/*
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/webinaire/mail-to-admin.hbs'),
  'utf-8'
);
*/

const templateMailToUser = readFileSync(
  path.join(__dirname, '../../views/webinaire/mail-to-user.hbs'),
  'utf-8'
);

const removeEmpty = (obj: any) => {
  Object.keys(obj).forEach(
    k => !obj[k] && obj[k] !== undefined && delete obj[k]
  );
  return obj;
};
const create = async (req: Request, res: Response) => {
  const { webinaire_id,planning_id } = req.params;
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
   console.log('====================================');
   console.log({
    first_name: firstName,
    last_name: lastName,
    phone_index: phoneIndex,
    phone: phoneNumber,
    email: email,
    newsletter,
    channel,
  });
   console.log('====================================');
    add('/api/backoffice/contacts', {
      first_name: firstName,
      last_name: lastName,
      phone_index: phoneIndex,
      phone: phoneNumber,
      email: email
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
    const webinaireResponse = await search(
      `/api/backoffice/webinar/${webinaire_id}?fields=*,company.*`
    );

    patch(`/api/backoffice/webinar/${webinaire_id}`, {
      planings: {
        update: [
          {
            id: planning_id,
            candidates: {
              create: [
                {
                  candidate_id: {
                    first_name: firstName,
                    last_name: lastName,
                    phone_index: phoneIndex,
                    phone: phoneNumber,
                    email: email
                  },
                },
              ],
            },
          },
        ],
      },
    });

    const webinaire = webinaireResponse?.data.data;
    const templateUserMail = Handlebars.compile(templateMailToUser);

    mailingService.send({
      to: email,
      subject: `Nous avons bien recu votre inscription`,
      html: templateUserMail({
        name: `${firstName} ${lastName}`,
        title: webinaire.title,
      }),
    });
/*
    const template = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouvelle reponse au webinaire !`,
      html: template({
        name: `${firstName} ${lastName}`,
        title: webinaire.title,
      }),
    });
*/
    if (webinaire.company?.id) {
      let channel_id = 0;
      if (isNaN(parseInt(channel))) {
        const {
          data: { data: channelData },
        } = await add('/api/backoffice/channel', {
          title: channel,
          description: '',
        });
        channel_id = channelData.id;
      } else {
        channel_id = parseInt(channel);
      }
      add('/api/backoffice/popularity', {
        company_id: webinaire.company?.id,
        channel_id: channel_id,
      });
    }

    res.json({ msg: 'success' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: 'Une erreur est survenue' });
  }
};

const webinaireController = {
  create,
};

export { webinaireController };
