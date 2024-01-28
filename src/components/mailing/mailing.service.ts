import { transporter } from './mailing.config';

const send = ({
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
      from: `${process.env.OWNER_NAME} <${process.env.OWNER_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('failed to send email', err);
  }
};

const mailingService = {
  send,
};

export default mailingService;
