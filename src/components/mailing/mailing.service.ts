import * as SibApiV3Sdk from '@getbrevo/brevo';
import { SmallMailOptions } from '@entities/mails';

const send = (mailOptions: SmallMailOptions, params?: any) => {
  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  apiInstance.setApiKey(
    SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY || ''
  );

  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
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
    function (data) {
      console.log('API called successfully.');
    },
    function (error) {
      console.error(error);
    }
  );
};

const mailingService = {
  send,
};

export default mailingService;
