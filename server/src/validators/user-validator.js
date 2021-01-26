import { check, param } from 'express-validator';

const name = check('name', 'Name is required').not().isEmpty();

const username = check('username', 'Username is required').not().isEmpty();

const email = check('name', 'Please provide vaalid email address')
  .not()
  .isEmail()
  .isEmpty();

const password = check('password', 'Password is required of min length')
  .not()
  .isLength({
    min: 6,
  });

export const RegisterValidations = [name, username, email, password];
export const AuthenticationValidation = [username, password];
