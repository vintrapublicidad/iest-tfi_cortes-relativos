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

async function initDatabase() {
  console.log('--- Inicializando base de datos Cortes Relativos ---');
  console.log(`Conectando a: ${connectionString.replace(/:[^:]*@/, ':****@')}`);

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
  });

  try {
    const schemaSqlPath = path.resolve(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaSqlPath, 'utf8');

    console.log('Ejecutando scripts/schema.sql...');
    await pool.query(sql);

    console.log('✅ Esquema creado exitosamente:');
    console.log('   - clientes');
    console.log('   - servicios');
    console.log('   - peluqueros');
    console.log('   - turnos');
    console.log('   - lista_espera');
    console.log('   - índices y restricciones de integridad');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    console.log('\nTip: Asegurate de tener PostgreSQL corriendo y de configurar DATABASE_URL en tu archivo .env.local.');
  } finally {
    await pool.end();
  }
}

initDatabase();
