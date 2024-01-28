import { createTransport } from 'nodemailer';
import { config } from 'dotenv';
import Transport from 'nodemailer-brevo-transport';

config();

export const transporter = createTransport(
  new Transport({ apiKey: process.env.BREVO_API_KEY || '' })
);

