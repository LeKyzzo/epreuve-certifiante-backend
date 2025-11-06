import { Pool } from 'pg';

import env from './env';

const pool = new Pool({
  host: env.postgres.host,
  port: env.postgres.port,
  user: env.postgres.user,
  password: env.postgres.password,
  database: env.postgres.database
});

export default pool;
