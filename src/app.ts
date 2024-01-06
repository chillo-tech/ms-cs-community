import 'module-alias/register';
import { initEnv } from '@utils/initEnvIronementVariables';
import app, { port } from './appinit';
import { dbInit } from '@components/db/connect';

initEnv();

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit();
  if (res) console.log('succesfully connected to mongodb');
});
