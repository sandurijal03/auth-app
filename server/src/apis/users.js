import { Router } from 'express';
import { AuthenticateValidation, RegisterValidation } from '../validators';
import { User } from '../models';
import Validator from '../middlewares/validator-middleware';
import { randomBytes } from 'crypto';
import sendMail from '../functions/email-sender';
import { join } from 'path';

const router = Router();

/**
 * @description to create a new User Account
 * @api /users/api/register
 * @access  Public
 * @type  POST
 */

router.post(
  '/api/register',
  RegisterValidation,
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
      <div>
        <h1>Hello ${user.username}</h1>
        <p>Please click the link to verify your account</p>
        <a href=${process.env.APP_DOMAIN}users/verify-now/${user.verificationCode}>Verify </a>
      </div>
      `;
      await sendMail(
        user.email,
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

/**
 * @description to verify a new user's account
 * @api /users/verify-now/verificationCode
 * @access  Public <only via email>
 * @type  GET
 */
router.get('/verify-now/:verificationCode', async (req, res) => {
  try {
    let { verificationCode } = req.params;
    let user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Invalid verification code',
      });
    }
    user.verified = true;
    user.verificationCode = undefined;
    await user.save();
    return res.sendFile(
      join(__dirname, '../templates/verification-success.html'),
    );
  } catch (err) {
    return res.send(join(__dirname, '../templates/errors.html'));
  }
});

/**
 * @description to authenticate a user and get authenticate token
 * @api /users/api/authenticate
 * @access  Public
 * @type  POST
 */
router.post(
  '/api/authenticate',
  AuthenticateValidation,
  Validator,
  async (req, res) => {
    try {
      let { username, password } = req.body;
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Username not found',
        });
      }

      if (!(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect Password',
        });
      }
      let token = await user.generateJWT();
      return res.status(200).json({
        success: true,
        user: user.getUserInfo(),
        token: `Bearer ${token}`,
        message: 'You are now logged in',
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
