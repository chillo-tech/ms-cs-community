import mailingService from '@components/mailing/mailing.service';
import { add, search } from '@services/queries';
import { AppError } from '@utils/Errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, formationId } = req.body;

  try {
    const mailToUser = readFileSync(
      path.join(
        __dirname,
        '../../views/waiting-list/template-mail-to-user.hbs'
      ),
      'utf-8'
    );
    const mailToAdmin = readFileSync(
      path.join(
        __dirname,
        '../../views/waiting-list/template-mail-to-admin.hbs'
      ),
      'utf-8'
    );

    const formationResponse = await search(
      `/api/backoffice/Formation/${formationId}/?fields=*,attentes.*`
    );

    const formation = formationResponse.data.data;

    const attentes = formation.attentes as { email: string }[];

    if (attentes.find(candidate => candidate.email === email)) {
      throw new AppError('conflict', 'Votre email est deja enregistré', true, {
        ressource: 'email',
      });
    }

    const candidatResponse = await add('/api/backoffice/candidate', {
      lastName: name,
      firstName: '',
      phoneIndex: '',
      phone: '',
      email,
      attente_id: formation.id,
    });
    const candidate = candidatResponse.data.data;

    const templateToUser = Handlebars.compile(mailToUser);
    mailingService.send({
      to: email,
      subject: 'Nous avons bien reçu votre inscription. Merci!',
      html: templateToUser({
        name,
        lien: formation.lien,
        titre: formation.titre,
      }),
    });

    const templateMailToAdmin = Handlebars.compile(mailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: `Nouvelle inscription a la liste d'attente de ${formation.titre}!`,
      html: templateMailToAdmin({
        name,
        lien: formation.lien,
        titre: formation.titre,
      }),
    });

    return res.json({
      msg: 'success',
      candidate,
      formation,
    });
  } catch (error) {
    next(error);
  }
};

const getVideoInfos = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.query;
    if (!(id instanceof String || typeof id === 'string'))
      throw new AppError('invalidInput', "mauvaise entree sur l'id", true);
    const videoResponse = await search(`/api/backoffice/video/${id}`);
    const video = videoResponse.data.data;
    return res.json({ msg: 'succes', video });
  } catch (error) {
    next(error);
  }
};

const getFormation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slug } = req.query;
    if (!(slug instanceof String || typeof slug === 'string'))
      throw new AppError('invalidInput', 'mauvaise entree sur le slug', true, {
        ressource: 'slug',
      });
    const formationResponse = await search(
      `/api/backoffice/Formation/?filter[slug][_eq]=${slug}`
    );
    if (formationResponse.data.data?.length === 0) {
      throw new AppError(
        'notFound',
        "la formation demandée n'existe pas",
        true,
        { ressource: 'formation' }
      );
    }

    const formation = formationResponse.data.data[0];

    console.log('formationResponse', formationResponse);
    console.log('formation', formation);
    return res.json({ msg: 'succes', formation });
  } catch (error) {
    next(error);
  }
};

const waitingListController = {
  subscribe,
  getVideoInfos,
  getFormation,
};

export { waitingListController };
