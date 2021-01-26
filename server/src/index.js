import express from 'express';
import consola from 'consola';
import cors from 'cors';
import mongoose from 'mongoose';

// importing constants
import { DB_NAME, DB_URI, DOMAIN, PORT } from './constants';

// importing routes
import UserApis from './apis/users';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', UserApis);

const main = async () => {
  try {
    await mongoose.connect(`${DB_URI}/${DB_NAME}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    consola.success('DATABASE CONNECTED');
    app.listen(PORT, () => consola.success('server connected on ', DOMAIN));
  } catch (err) {
    consola.error(`Unable to connect to the server ${err.message}`);
  }
};

main();
