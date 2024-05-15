import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
// import Transport from 'nodemailer-brevo-transport';

config();

// export const transporter = createTransport(
//   new Transport({ apiKey: process.env.BREVO_API_KEY || '' })
// );

export const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'brightkyefoo@gmail.com',
    pass: process.env.GMAIL_PWD,
  },
});
