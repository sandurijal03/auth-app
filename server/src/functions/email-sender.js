import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.API_KEY);

const sendMail = async (email, subject, text, html) => {
  try {
    const msg = {
      from: process.env.API_HOST_EMAIL,
      to: email,
      subject,
      text,
      html,
    };
    console.log(msg);
    await sgMail.send(msg);
    console.log('mail sent');
  } catch (err) {
    console.log('ERROR MAILING: ', err.response.body.errors);
  } finally {
    return;
  }
};

export default sendMail;
