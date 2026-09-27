import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db.js';
import {
  hashSenha, conferirSenha,
  gerarAccessToken,
  criarRefreshToken, acharRefreshValido, revogarRefresh,
} from '../auth.js';
import { requireAuth } from '../middleware.js';

const r = Router();

const esquemaRegistro = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
});

// ── POST /api/auth/registrar — cria cliente ──────────────────
r.post('/registrar', async (req, res, next) => {
  try {
    const dados = esquemaRegistro.parse(req.body);
    const existe = await pool.query(`SELECT 1 FROM usuarios WHERE email=$1`, [dados.email.toLowerCase()]);
    if (existe.rowCount) return res.status(409).json({ erro: 'E-mail já cadastrado' });

    const hash = await hashSenha(dados.senha);
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash, papel)
       VALUES ($1,$2,$3,'cliente') RETURNING id, nome, email, papel`,
      [dados.nome, dados.email.toLowerCase(), hash],
    );
    const usuario = rows[0];

    const access = gerarAccessToken(usuario);
    const { token: refresh } = await criarRefreshToken(usuario.id);
    res.status(201).json({ usuario, access, refresh });
  } catch (e) { next(e); }
});

// ── POST /api/auth/login ─────────────────────────────────────
const esquemaLogin = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
});

r.post('/login', async (req, res, next) => {
  try {
    const dados = esquemaLogin.parse(req.body);
    const { rows } = await pool.query(
      `SELECT * FROM usuarios WHERE email=$1`, [dados.email.toLowerCase()],
    );
    if (!rows.length) return res.status(401).json({ erro: 'Credenciais inválidas' });
    const u = rows[0];

    const ok = await conferirSenha(dados.senha, u.senha_hash);
    if (!ok) return res.status(401).json({ erro: 'Credenciais inválidas' });

    const access = gerarAccessToken(u);
    const { token: refresh } = await criarRefreshToken(u.id);
    res.json({
      usuario: { id: u.id, nome: u.nome, email: u.email, papel: u.papel },
      access,
      refresh,
    });
  } catch (e) { next(e); }
});

// ── POST /api/auth/refresh ───────────────────────────────────
r.post('/refresh', async (req, res, next) => {
  try {
    const { refresh } = req.body;
    if (!refresh) return res.status(400).json({ erro: 'refresh ausente' });

    const linha = await acharRefreshValido(refresh);
    if (!linha) return res.status(401).json({ erro: 'Refresh inválido ou expirado' });

    const { rows } = await pool.query(`SELECT * FROM usuarios WHERE id=$1`, [linha.usuario_id]);
    if (!rows.length) return res.status(401).json({ erro: 'Usuário não encontrado' });
    const u = rows[0];

    // rotaciona: revoga o antigo, emite novo par
    await revogarRefresh(refresh);
    const access = gerarAccessToken(u);
    const { token: novoRefresh } = await criarRefreshToken(u.id);
    res.json({
      usuario: { id: u.id, nome: u.nome, email: u.email, papel: u.papel },
      access,
      refresh: novoRefresh,
    });
  } catch (e) { next(e); }
});

// ── POST /api/auth/logout ────────────────────────────────────
r.post('/logout', async (req, res, next) => {
  try {
    const { refresh } = req.body;
    if (refresh) await revogarRefresh(refresh);
    res.status(204).end();
  } catch (e) { next(e); }
});

// ── GET /api/auth/eu — quem está logado ──────────────────────
r.get('/eu', requireAuth, (req, res) => res.json({ usuario: req.user }));

export default r;