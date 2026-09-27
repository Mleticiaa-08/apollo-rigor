import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { pool } from './db.js';

const ACCESS_TTL  = '15m';
const REFRESH_DIAS = 30;

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET não definida no .env');
  return s;
}

// ── senhas ────────────────────────────────────────────────────
export function hashSenha(senha) {
  return bcrypt.hash(senha, 10);
}
export function conferirSenha(senha, hash) {
  return bcrypt.compare(senha, hash);
}

// ── tokens ────────────────────────────────────────────────────
export function gerarAccessToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, papel: usuario.papel, nome: usuario.nome },
    secret(),
    { expiresIn: ACCESS_TTL },
  );
}

export function verificarAccessToken(token) {
  return jwt.verify(token, secret());   // lança se inválido/expirado
}

// Refresh token é opaco (aleatório), não JWT: guardamos só o hash no banco.
function hashRefresh(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function criarRefreshToken(usuarioId) {
  const token = crypto.randomBytes(48).toString('base64url');
  const expira = new Date(Date.now() + REFRESH_DIAS * 24 * 60 * 60 * 1000);
  await pool.query(
    `INSERT INTO refresh_tokens (usuario_id, token_hash, expira_em) VALUES ($1,$2,$3)`,
    [usuarioId, hashRefresh(token), expira],
  );
  return { token, expira };
}

// valida e devolve a linha; retorna null se inválido/expirado/revogado
export async function acharRefreshValido(token) {
  const { rows } = await pool.query(
    `SELECT * FROM refresh_tokens
      WHERE token_hash=$1 AND revogado=FALSE AND expira_em > NOW()`,
    [hashRefresh(token)],
  );
  return rows[0] || null;
}

export async function revogarRefresh(token) {
  await pool.query(`UPDATE refresh_tokens SET revogado=TRUE WHERE token_hash=$1`, [hashRefresh(token)]);
}

export async function revogarTodosDoUsuario(usuarioId) {
  await pool.query(`UPDATE refresh_tokens SET revogado=TRUE WHERE usuario_id=$1`, [usuarioId]);
}