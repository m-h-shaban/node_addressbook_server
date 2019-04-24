const dotenv = require("dotenv");
dotenv.config();

const env = process.env.NODE_ENV;

const dev = {
  PORT: process.env.DEV_PORT,
  ENV: process.env.NODE_ENV
};
const production = {
  PORT: process.env.PRODUCTION_PORT,
  ENV: process.env.NODE_ENV
};

const config = {
  dev,
  production
};

module.exports = config[env];
