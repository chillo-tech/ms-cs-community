import { Request, Response } from 'express';
import { avisService } from './avis.services';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';
import mailingService from '@components/mailing/mailing.service';
import { add, search } from '@services/queries';

const confirmationTemplate = readFileSync(
  path.join(__dirname, '../../views/avis/template-mail-to-user.hbs'),
  'utf-8'
);

const giveAvis = async (req: Request, res: Response) => {
  const { message, nom, email, note, slug, session_id } = req.body;
  console.log('sessionId', session_id);
  let slugId = 0;
  try {
    if (typeof slug !== 'string' || slug === '') {
      throw new Error('invalid slug');
    }

    const id = parseInt(slug.split('-').at(-1) || '');
    if (!id || isNaN(id)) {
      throw new Error('invalid slug');
    }
    slugId = id;
  } catch {
    return res.status(400).json({ msg: 'invalid slug' });
  }

  try {
    const formation = await search(`/api/backoffice/Formation/${slugId}`);
    const subject = formation.data.titre;
    // store avis to db
    const avis = await avisService.createAvis({
      nom,
      subject,
      message,
      email,
      note,
    });

    // store avis to cms
    add('/api/backoffice/avis', {
      texte: message,
      email,
      nom,
      note,
      avis_id: session_id,
    });

    // send mail to user
    const template = Handlebars.compile(confirmationTemplate);
    mailingService.sendWithNodemailer({
      to: email,
      html: template({ subject, nom }),
      subject: 'Votre avis a ete recu',
    });

    return res.json({ msg: 'success', avis });
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const getAvisFormation = async (req: Request, res: Response) => {
  const { slug } = req.query;
  // let slugId = 0;
  try {
    if (typeof slug !== 'string' || slug === '') {
      throw new Error('invalid slug');
    }

    const id = parseInt(slug.split('-').at(-1) || '');
    if (!id || isNaN(id)) {
      throw new Error('invalid slug');
    }
    // slugId = id;
  } catch {
    return res.status(400).json({ msg: 'invalid slug' });
  }
  try {
    const formation = await search(
      `/api/backoffice/Formation?fields=*,sessions.*&filter[slug][_eq]=${slug}`
    );
    if (!formation) return res.status(404).json({ msg: 'view not found' });
    // const sessionId = formation.data.sessions[0]?.Session_id;
    res.json({ msg: 'success', formation: formation.data.data });
  } catch (error) {
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const avisController = {
  giveAvis,
  getAvisFormation,
};

export { avisController };
