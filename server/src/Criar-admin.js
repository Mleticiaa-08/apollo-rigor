import 'dotenv/config';
import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { pool } from './db.js';
import { hashSenha } from './auth.js';

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    const nome = (await rl.question('Nome: ')).trim();
    const email = (await rl.question('E-mail: ')).trim().toLowerCase();
    const senha = (await rl.question('Senha (min 6): ')).trim();

    if (nome.length < 3) throw new Error('Nome curto');
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('E-mail inválido');
    if (senha.length < 6) throw new Error('Senha curta');

    const existe = await pool.query(`SELECT 1 FROM usuarios WHERE email=$1`, [email]);
    if (existe.rowCount) throw new Error('E-mail já cadastrado');

    const hash = await hashSenha(senha);
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, papel)
       VALUES ($1,$2,$3,'admin') RETURNING id, nome, email, papel`,
      [nome, email, hash],
    );
    console.log('✔ admin criado:', rows[0]);
  } finally {
    rl.close();
    await pool.end();
  }
}

main().catch((e) => { console.error('✖', e.message); process.exit(1); });