import * as SibApiV3Sdk from '@getbrevo/brevo';
import { SmallMailOptions } from '@entities/mails';
import { transporter } from './mailing.config';

type TokenData = {
  [key: string]: string | null | undefined;
};
const send = (mailOptions: SmallMailOptions, params?: TokenData) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ''
  );

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = mailOptions.subject;
  sendSmtpEmail.htmlContent = mailOptions.text;
  sendSmtpEmail.sender = {
    name: process.env.OWNER_NAME || 'Achille',
    email: process.env.OWNER_EMAIL || '',
  };
  sendSmtpEmail.to = [{ email: mailOptions.to }];
  sendSmtpEmail.replyTo = {
    email: process.env.OWNER_EMAIL || '',
    name: process.env.OWNER_NAME || 'Achille de chillo.tech',
  };

  sendSmtpEmail.params = params;

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function () {
      console.log('API called successfully.');
    },
    function (error) {
      console.error(error);
    }
  );
};

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
    console.log('email sent succesfully');
  } catch (err) {
    console.log('failed to send email', err);
  }
};

const mailingService = {
  send,
  sendWithNodemailer,
};

export default mailingService;
