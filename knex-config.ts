import * as dotenv from 'dotenv';
dotenv.config();

export const knexConfig = {
  config: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_ROOT_USER,
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      pool: {
        min: 2,
        max: 100,
      },
      // timezone: 'UTC',
      dateStrings: true,
      // requestTimeout: 1200000,
    },
  },
};
