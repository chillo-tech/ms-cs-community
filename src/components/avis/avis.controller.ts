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
  const {
    message,
    lastName,
    firstName,
    email,
    note,
    subject: formSubject,
    training_slug,
    session_slug,
  } = req.body;
  let training: Record<string, any> | null = null;
  if (training_slug) {
    const trainingResponse = await search(
      `/api/backoffice/trainings/${training_slug
        .split('-')
        .at(-1)}/?fields=*,sessions.session_id.*`
    );
    if (trainingResponse) {
      training = trainingResponse.data.data;
    }
  }

  let session: Record<string, any> | null = null;

  if (session_slug) {
    if (training) {
      session =
        training.sessions.find((s: any) => s.session_id.slug === session_slug)
          ?.session_id || null;
    }
  }

  try {
    const subject = session
      ? `Avis sur la session ${session.title} de la formation ${training?.title}`
      : training
      ? `Avis sur la formation ${training.title}`
      : formSubject;
    const avis = await avisService.create({
      firstName,
      lastName,
      subject,
      message,
      email,
      note,
    });

    add('/api/backoffice/avis', {
      text: message,
      email,
      first_name: firstName,
      last_name: lastName,
      note,
      subject,
      session: session?.id,
      training: training?.id,
    });

    const template = Handlebars.compile(confirmationTemplate);
    mailingService.send({
      to: email,
      html: template({
        subject,
        nom: `${firstName.toUpperCase()} ${lastName}`,
      }),
      subject: 'Votre avis a ete recu',
    });

    return res.json({ msg: 'success', avis });
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ msg: 'quelque chose a mal tourne' });
  }
};

const searchAvisFormation = async (req: Request, res: Response) => {
  const { formationSlug, sessionSlug } = req.query as Record<
    string,
    string | undefined
  >;
  const id = parseInt(formationSlug?.split('-').at(-1) || '0');
  const session_id = parseInt(sessionSlug?.split('-').at(-1) || '0');
  if (isNaN(id) || isNaN(session_id)) {
    return res.status(400).json({ msg: 'invalid slug' });
  }
  try {
    const formation = await search(
      `/api/backoffice/trainings?fields=*,sessions.session_id.*&filter[slug][_eq]=${formationSlug}`
    );
    const session = formation?.data.data[0]?.sessions?.find(
      (el: any) => el.session_id.slug === sessionSlug
    )?.session_id;
    res.json({ msg: 'success', trainings: formation?.data.data, session });
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
