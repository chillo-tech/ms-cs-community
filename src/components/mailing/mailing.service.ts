import { transporter } from './mailing.config';

const sendWithNodemailer = ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.log('failed to send email', err);
  }
};

const mailingService = {
  sendWithNodemailer,
};

export default mailingService;
