import postgres from 'postgres';

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL non configurato');
  if (!globalForDb.sql) globalForDb.sql = postgres(process.env.DATABASE_URL, { max: 10, idle_timeout: 20 });
  return globalForDb.sql;
}
