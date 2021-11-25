import { config, } from 'dotenv';

config();

export default {
  baseUrl: process.env.BASE_URL,
};
