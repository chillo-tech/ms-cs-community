import 'module-alias/register';
import app, { port } from './appinit';
import { dbInit } from '@components/db/connect';
import { initEnv } from '@utils/initEnvIronementVariables';

initEnv();

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit();
  if (res) console.log('succesfully connected to mongodb');

  console.log(`----------------------`);
  console.log(JSON.stringify(process.env, null, 2));
  console.log(`----------------------`);
});

process.on('unhandledRejection', err => {
  console.log('unhanledRejection', err);
  // process.exit(1);
});

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  // process.exit(1);
});
