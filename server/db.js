import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pkg

const pool = new Pool({
  user: process.env.DB_USER,       // e.g., 'postgres'
  host: process.env.DB_HOST,       // e.g., 'localhost'
  database: process.env.DB_NAME,   // your database name
  password: process.env.DB_PASS,   // your PostgreSQL password
  port: 5432,                      // default PostgreSQL port
})

export default pool
