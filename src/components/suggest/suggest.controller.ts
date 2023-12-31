import {
  createDirectus,
  createItem,
  rest,
  staticToken
} from '@directus/sdk';
import { Request, Response } from 'express';
import mailingService from '../mailing/mailing.service';
import suggestService from './suggest.service';
import { msg1, msg2 } from '../../constants/mail/mailsTemplates';



const makeSuggestion = async (req: Request, res: Response) => {
  const { author, description, title } = req.body;
  try {
    // store suggestion
    const suggest = await suggestService.create({
      author,
      description,
      title,
    });

    console.log('suggest', suggest);

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

    const client = createDirectus(
      process.env.DIRECTUS_API_URI || 'https://contacts.chillo.fr'
    )
      .with(rest())
      .with(staticToken(process.env.DIRECTUS_API_KEY || ''));

    client
      .request(createItem('contact', tempObj))
      .then(res => {
        console.log('res', res);
      })
      .catch(err => {
        console.log('err', err.errors[0].extensions);
      });

    // send mail to confirm recption
    // first configure mailingOptions Obj
    const mailOptions = {
      to: author.email,
      subject: 'Nous avons bien reçu votre suggestion de contenu. Merci!',
      text: msg1,
    };

    // the send the mail
    // console.log('mailingOptions', mailOptions);
    mailingService.send(mailOptions);

    // SEND EMAIL TO OWNER
    // CONFIGURE EMAIL
    const mailingOptions2 = {
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: 'Nouvelle suggestion de contenu!',
      text: msg2(suggest.author?.name, suggest.title),
    };
    // SEND EMAIL
    mailingService.send(mailingOptions2);

    res.json({ msg: 'success', suggest });
  } catch (e) {
    console.log('e', e);
    res.json({ msg: 'something went wrong' });
  }
};

const suggestController = {
  makeSuggestion,
};

export default suggestController;
