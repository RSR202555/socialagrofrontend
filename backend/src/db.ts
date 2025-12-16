import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export const testConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL conectado com sucesso.");
  } catch (error) {
    console.error("Erro ao conectar no PostgreSQL:", error);
  }
};
