import { verificarAccessToken } from './auth.js';

export function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ erro: 'Token ausente' });
  try {
    req.user = verificarAccessToken(token);
    next();
  } catch {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.papel !== 'admin') return res.status(403).json({ erro: 'Somente admin' });
  next();
}