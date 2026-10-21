import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if present
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length > 0) {
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/cortes_relativos';

async function seedDatabase() {
  console.log('--- Insertando datos de prueba en Cortes Relativos ---');
  console.log(`Conectando a: ${connectionString.replace(/:[^:]*@/, ':****@')}`);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    const seedSqlPath = path.resolve(__dirname, 'seed.sql');
    const sql = fs.readFileSync(seedSqlPath, 'utf8');

    console.log('Ejecutando scripts/seed.sql...');
    await pool.query(sql);

    console.log('✅ Datos de prueba insertados exitosamente:');
    console.log('   - 6 servicios oficiales provisorios ($0)');
    console.log('   - 2 peluqueros de demostración');
    console.log('   - 2 clientes de demostración');
    console.log('   - Turnos de prueba cumpliendo anticipación de 10hs');
    console.log('   - Registro en lista de espera de prueba');
  } catch (error) {
    console.error('❌ Error al insertar datos de prueba:', error.message);
    console.log('\nTip: Asegurate de haber ejecutado antes `npm run db:init` y de que DATABASE_URL sea correcta.');
  } finally {
    await pool.end();
  }
}

seedDatabase();
