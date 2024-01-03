import 'module-alias/register';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { dbInit } from '@components/db/connect';
import jwtRouter from '@components/jwt/jwt.routes';
import suggestionsRouter from '@components/suggestions/suggestions.routes';

dotenv.config();

const port = process.env.PORT || 9000;
const app = express();
app
  .use(
    cors({
      origin: '*',
    })
  )
  .use(express.json());

app.use('/api/v1/suggest', suggestionsRouter);
app.use('/api/v1/tokens', jwtRouter);
// Do your logic here

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit();
  if (res) console.log('succesfully connected to mongodb');
});
