import { check } from 'express-validator';

const name = check('name', 'Name is required').not().isEmpty();

const username = check('username', 'Username is required').not().isEmpty();

const email = check('email', 'Please provide valid email address').isEmail();

const password = check(
  'password',
  'Password is required of min length',
).isLength({
  min: 6,
});

export const RegisterValidations = [name, username, email, password];
export const AuthenticateValidation = [username, password];
