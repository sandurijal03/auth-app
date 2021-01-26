const { PORT, DB_URI, DB_NAME, APP_DOMAIN, API_KEY, APP_SECRET } = process.env;

module.exports = {
  PORT: process.env.PORT || PORT,
  DB_URI,
  DB_NAME,
  DOMAIN: APP_DOMAIN,
  PORT,
  API_KEY,
  SECRET: APP_SECRET,
};
