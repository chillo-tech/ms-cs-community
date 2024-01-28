/* eslint-disable @typescript-eslint/no-explicit-any */
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

const create = async (req: Request, res: Response) => {
  const { message, nom, email, note, slug, session_id } = req.body;
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
    const avis = await avisService.create({
      nom,
      subject,
      message,
      email,
      note,
    });

    add('/api/backoffice/avis', {
      texte: message,
      email,
      nom,
      note,
      avis_id: session_id,
    });

    const template = Handlebars.compile(confirmationTemplate);
    mailingService.send({
      to: email,
      html: template({ subject, nom }),
      subject: 'Votre avis a ete recu',
    });

    return res.json({ msg: 'success', avis });
  } catch (err) {
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const searchAvisFormation = async (req: Request, res: Response) => {
  const { formationSlug, sessionSlug } = req.query;
  try {
    if (
      typeof formationSlug !== 'string' ||
      formationSlug === '' ||
      typeof sessionSlug !== 'string' ||
      sessionSlug === ''
    ) {
      throw new Error('invalid slug');
    }

    const id = parseInt(formationSlug.split('-').at(-1) || '');
    const session_id = parseInt(sessionSlug.split('-').at(-1) || '');
    if (!id || isNaN(id) || !session_id || isNaN(session_id)) {
      throw new Error('invalid slug');
    }
  } catch (err) {
    console.log('error', err);
    return res.status(400).json({ msg: 'invalid slug' });
  }
  try {
    const formation = await search(
      `/api/backoffice/Formation?fields=*,Sessions.*&filter[slug][_eq]=${formationSlug}`
    );
    if (!formation) return res.status(404).json({ msg: 'view not found' });
    const session = formation.data.data[0].Sessions.find(
      (el: any) => el.slug === sessionSlug
    );
    if (!session) return res.status(404).json({ msg: 'view not found' });
    res.json({ msg: 'success', formation: formation.data.data, session });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const avisController = {
  create,
  searchAvisFormation,
};

export { avisController };
