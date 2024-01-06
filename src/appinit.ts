import 'module-alias/register';
import jwtRouter from '@components/jwt/jwt.routes';
import newslettersRouter from '@components/newsletters/newsletters.routes';
import suggestionsRouter from '@components/suggestions/suggestions.routes';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

// dotenv.config();
if (process.env && process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}

export const port = process.env.PORT || 9000;
const app = express();
app
  .use(
    cors({
      origin: '*',
    })
  )
  .use(express.json());

app.use('/api/v1/suggest', suggestionsRouter);
app.use('/api/v1/newsletters', newslettersRouter);
app.use('/api/v1/tokens', jwtRouter);
// Do your logic here

export default app;
