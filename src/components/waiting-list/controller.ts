import mailingService from '@components/mailing/mailing.service';
import { add, search } from '@services/queries';
import { AppError } from '@utils/Errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, videoId } = req.body;

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

    const candidatResponse = await add('/api/backoffice/candidate', {
      lastName: name,
      firstName: '',
      phoneIndex: '',
      phone: '',
      email,
    });
    const candidate = candidatResponse.data.data;

    // recherche de la video
    const videoResponse = await search(`/api/backoffice/video/${videoId}`);
    const video = videoResponse.data.data;

    // association de la video et du candidat
    await add(`/api/backoffice/video_candidate`, {
      video_id: videoId,
      candidate_id: candidate.id,
    });

    const templateToUser = Handlebars.compile(mailToUser);
    mailingService.send({
      to: email,
      subject: 'Nous avons bien reçu votre inscription. Merci!',
      html: templateToUser({ name, lien: video.lien, video: video.titre }),
    });

    const templateMailToAdmin = Handlebars.compile(mailToAdmin);
    mailingService.send({
      to: process.env.OWNER_EMAIL || 'acceuil@chillo.tech',
      subject: `Nouvelle inscription a la liste d'attente de ${video.titre}!`,
      html: templateMailToAdmin({
        name,
        lien: video.lien,
        video: video.titre || 'chillo.tech',
      }),
    });

    return res.json({
      msg: 'success',
      candidate,
      video,
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

const waitingListController = {
  subscribe,
  getVideoInfos,
};

export { waitingListController };
