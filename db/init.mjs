import fs from 'node:fs/promises';
import postgres from 'postgres';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL mancante');
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
const schema = await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8');
await sql.unsafe(schema);
await sql.end();
console.log('BUYGO database inizializzato. Nessun dato demo inserito.');
