import passport from 'passport';
import { User } from '../models';
import { ExtractJwt, Strategy } from 'passport-jwt';

const opts = {
  secretOrKey: process.env.APP_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

console.log(opts);

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      let user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return done(null, user.getUserInfo());
    } catch (err) {
      done(null, false);
    }
  }),
);
