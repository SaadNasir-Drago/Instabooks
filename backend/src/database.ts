import { Pool } from 'pg';

const sql = new Pool({
  user: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  password: 'root'
})

export const query = (text: string, params?: any[]) => sql.query(text, params);