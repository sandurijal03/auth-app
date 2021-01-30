import express from 'express';
import consola from 'consola';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';

// importing routes
import userApis from './apis/users';

// import passport middleware
require('./middlewares/passport-middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/users', userApis);

const main = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    consola.success('DATABASE CONNECTED');
    app.listen(process.env.PORT, () =>
      consola.success('server connected on ', process.env.PORT),
    );
  } catch (err) {
    consola.error(`Unable to connect to the server ${err.message}`);
  }
};

main();
