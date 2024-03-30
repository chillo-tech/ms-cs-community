import { add, search } from '@services/queries';
import Handlebars from 'handlebars';
import { Request, Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
const templateMailToAdmin = readFileSync(
  path.join(__dirname, '../../views/webinaire/mail-to-admin.hbs'),
  'utf-8'
);

const create = async (req: Request, res: Response) => {
  const { planning_id, webinaire_id } = req.params;

  const {
    firstName,
    lastName,
    email,
    phoneNumber = '',
    newsletter,
    phoneIndex = '',
    channel,
  } = req.body;
  try {
    // add candidate
    add('/api/backoffice/candidate', {
      firstName,
      lastName,
      email,
      phoneIndex,
      phone: phoneNumber,
      plannings: {
        create: [
          {
            candidate_id: '+',
            planning_id: {
              id: planning_id,
            },
          },
        ],
        update: [],
        delete: [],
      },
    });

    add('/api/backoffice/contact', {
      phoneIndex,
      phone: phoneNumber,
      name: `${firstName} ${lastName}`,
      email: email,
      tags: `devdelopper, tech${newsletter ? ', ' + newsletter : ''}`,
      position: 'client',
    });

    add('/api/contacts/contact', {
      phoneindex: phoneIndex,
      phone: phoneNumber,
      name: `${firstName} ${lastName}`,
      email: email,
      tags: `devdelopper, tech${newsletter ? ', ' + newsletter : ''}`,
      position: 'client',
    });

    const template = Handlebars.compile(templateMailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || '',
      subject: `Nouvelle reponse au webinaire !`,
      html: template({
        name: `${firstName} ${lastName}`,
      }),
    });

    const {
      data: { data: webinaire },
    } = await search(
      `/api/backoffice/webinaire/${webinaire_id}?fields=*,company.*`
    );

    console.log('company', webinaire.company?.id);

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
    return res.status(500).json({ msg: 'something went wrong' });
  }
};

const webinaireController = {
  create,
};

export { webinaireController };
