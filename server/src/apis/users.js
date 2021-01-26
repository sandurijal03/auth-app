import { Router } from 'express';
import { RegisterValidations } from '../validators';
import { User } from '../models';
import Validator from '../middlewares/validator-middleware';
import { randomBytes } from 'crypto';
import sendMail from '../functions/email-sender';

const router = Router();

router.post(
  '/api/register',
  RegisterValidations,
  Validator,
  async (req, res) => {
    try {
      let { email, username } = req.body;
      // check if username is taken or not
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      // check if email is registered
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message:
            'Email is already taken.  Did you forget the password. Try Forget Password.',
        });
      }

      user = new User({
        ...req.body,
        verificationCode: randomBytes(20).toString('hex'),
      });
      await user.save();
      console.log(user);
      // send email to user with verification link
      let html = `
      <h1>Hello ${user.username}</h1>
      <p>Please click the link to verify your account</p>
      <a href="/${process.env.DOMAIN}users/verify-now/${user.userVerificationCode}"> </a>
      `;
      sendMail(
        'sandurijal03@hotmail',
        'Verify Account',
        'Please verify account',
        html,
      );
      return res.status(201).json({
        success: true,
        message: 'Your account is created, please verify your email address',
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: 'An error occurred',
      });
    }
  },
);

export default router;
