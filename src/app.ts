import 'module-alias/register';
import app, { port } from './appinit';
import { dbInit } from '@components/db/connect';
import { initEnv } from '@utils/initEnvIronementVariables';
import { isAxiosError } from 'axios';

initEnv();

app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);
  const res = await dbInit();
  if (res) console.log('succesfully connected to mongodb');
});

process.on('unhandledRejection', err => {
  if (isAxiosError(err)) {
    console.error(err.message , `${err.config?.baseURL}${err.config?.url}`);
    
    console.error('Axios Request Failed', err.response?.data);
  } else {
    console.error('unhanledRejection', err);
  }
});

process.on('uncaughtException', err => {
  console.error('uncaughtException', err);
});
