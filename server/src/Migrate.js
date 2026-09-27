import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { pool } from './db.js';

const __dir = dirname(fileURLToPath(import.meta.url));

async function main() {
    const sql = readFileSync(join(__dir, '..', 'schema.sql'), 'utf8');
    console.log('→ aplicando schema…');
    await pool.query(sql);
    console.log('✔ schema aplicado');
    await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });