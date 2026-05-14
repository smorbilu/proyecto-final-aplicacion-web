import { Sequelize } from 'sequelize';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env['DB_NAME'] || 'taskflow_db';
const DB_USER = process.env['DB_USER'] || 'postgres';
const DB_PASSWORD = process.env['DB_PASSWORD'] || 'Admin1234';
const DB_HOST = process.env['DB_HOST'] || 'localhost';
const DB_PORT = Number(process.env['DB_PORT']) || 5432;

export async function createDatabaseIfNotExists(): Promise<void> {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
  });

  try {
    await client.connect();
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Base de datos "${DB_NAME}" creada exitosamente.`);
    }
  } finally {
    await client.end();
  }
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: false,
});

export default sequelize;
