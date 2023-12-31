import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import favicon from 'serve-favicon';
import { dbInit } from './components/db/connect';
import jwtRouter from './components/jwt/jwt.routes';
import suggestRouter from './components/suggestions/suggestions.routes';

dotenv.config();

const port = process.env.PORT || 9000;
const app = express();
app
  .use(
    cors({
      origin: '*',
    })
  )
  .use(express.json())
  .use(morgan('dev'));

app
  .use('/public', express.static('assets'))
  .use(favicon('./assets/images/favicon.ico'));

app.get('/', (req, res) => {
  res.send('it works. Done by BrightkyEfoo');
});

app.use('/api/v1/suggest',suggestRouter)
app.use('/api/v1/tokens', jwtRouter)
// Do your logic here

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit()
  if(res) console.log('succesfully connected to mongodb')
});
