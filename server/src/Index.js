import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db.js';
import auth from './routes/auth.js';

const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS agora');
    res.json({ ok: true, db: 'ok', agora: rows[0].agora });
  } catch (e) {
    res.status(500).json({ ok: false, db: 'erro', erro: e.message });
  }
});

app.use('/api/auth', auth);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.name === 'ZodError') {
    return res.status(400).json({ erro: 'Dados inválidos', detalhes: err.errors });
  }
  res.status(err.status || 500).json({ erro: err.message || 'Erro interno' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`→ API em http://localhost:${PORT}`));