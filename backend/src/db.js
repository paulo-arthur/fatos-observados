import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Validação preventiva para garantir que a variável existe no Render
if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO CRÍTICO: A variável DATABASE_URL não foi encontrada em process.env!");
}

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para a ligação SSL com o Neon
  }
});