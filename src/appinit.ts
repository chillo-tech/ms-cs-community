import 'module-alias/register';
import jwtRouter from '@components/jwt/jwt.routes';
import newslettersRouter from '@components/newsletters/newsletters.routes';
import suggestionsRouter from '@components/suggestions/suggestions.routes';
import { router as avisRouter } from '@components/avis';
import { initEnv } from '@utils/initEnvIronementVariables';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
const PREFIX = 'api';
const VERSION = 'v1';
initEnv();

export const port = process.env.PORT || 9000;
const app = express();

app
  .use(
    cors({
      origin: '*',
    })
  )
  .use(morgan('tiny'))
  .use(express.json());

app.use(`/${PREFIX}/${VERSION}/suggestions`, suggestionsRouter);
app.use(`/${PREFIX}/${VERSION}/newsletters`, newslettersRouter);
app.use(`/${PREFIX}/${VERSION}/tokens`, jwtRouter);
app.use(`/${PREFIX}/${VERSION}/avis`, avisRouter);
// Do your logic here

export default app;
