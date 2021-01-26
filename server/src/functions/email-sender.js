import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.API_KEY);

const sendMail = async (email, subject, text, html) => {
  try {
    const msg = {
      to: email,
      from: process.env.API_HOST_EMAIL,
      subject,
      text,
      html,
    };
    console.log(msg);
    await sgMail.send(msg);
    console.log('mail sent');
  } catch (err) {
    console.log('ERROR MAILING: ', err.messag);
  } finally {
    return;
  }
};

export default sendMail;
