import app, { port } from './appinit';
import { dbInit } from '@components/db/connect';
import dotenv from 'dotenv';

// dotenv.config();
if (process.env && process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env' });
}
app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit();
  if (res) console.log('succesfully connected to mongodb');
});
