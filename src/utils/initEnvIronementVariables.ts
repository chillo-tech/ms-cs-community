import dotenv from 'dotenv';

const initEnv = () => {
  dotenv.config({ path: '.env' });
  dotenv.config({ path: '.env.local' });
};

export { initEnv };
