import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
// import Transport from 'nodemailer-brevo-transport';

config();

// export const transporter = createTransport(
//   new Transport({ apiKey: process.env.BREVO_API_KEY || '' })
// );

export const transporter = createTransport({
  host: 'smtp-relay.brevo.com',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});
