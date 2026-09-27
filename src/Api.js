const BASE = import.meta.env.VITE_API_URL || '';

const K_ACCESS = 'apollo-access';
const K_REFRESH = 'apollo-refresh';
const K_USER = 'apollo-user';

export const getAccess  = () => localStorage.getItem(K_ACCESS);
export const getRefresh = () => localStorage.getItem(K_REFRESH);
export const getUser    = () => {
  try { return JSON.parse(localStorage.getItem(K_USER) || 'null'); }
  catch { return null; }
};

export function salvarSessao({ access, refresh, usuario }) {
  if (access)  localStorage.setItem(K_ACCESS, access);
  if (refresh) localStorage.setItem(K_REFRESH, refresh);
  if (usuario) localStorage.setItem(K_USER, JSON.stringify(usuario));
  window.dispatchEvent(new CustomEvent('apollo-auth'));
}

export function limparSessao() {
  localStorage.removeItem(K_ACCESS);
  localStorage.removeItem(K_REFRESH);
  localStorage.removeItem(K_USER);
  window.dispatchEvent(new CustomEvent('apollo-auth'));
}

let refreshing = null;
async function tentarRefresh() {
  if (refreshing) return refreshing;
  const refresh = getRefresh();
  if (!refresh) return false;
  refreshing = (async () => {
    try {
      const res = await fetch(`${BASE}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (!res.ok) { limparSessao(); return false; }
      salvarSessao(await res.json());
      return true;
    } catch { limparSessao(); return false; }
    finally { refreshing = null; }
  })();
  return refreshing;
}

async function req(path, { method = 'GET', body, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const access = getAccess();
  if (access) headers.Authorization = `Bearer ${access}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401 && retry && getRefresh()) {
    if (await tentarRefresh()) return req(path, { method, body, retry: false });
    limparSessao();
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.erro || `HTTP ${res.status}`);
  return data;
}

export const api = {
  auth: {
    login:     (email, senha) => req('/api/auth/login', { method: 'POST', body: { email, senha } }),
    registrar: (nome, email, senha) => req('/api/auth/registrar', { method: 'POST', body: { nome, email, senha } }),
    logout:    () => req('/api/auth/logout', { method: 'POST', body: { refresh: getRefresh() } }).catch(() => {}),
    eu:        () => req('/api/auth/eu'),
  },
  produtos: {
    list:   () => req('/api/produtos'),
    create: (p) => req('/api/produtos', { method: 'POST', body: p }),
    update: (id, p) => req(`/api/produtos/${id}`, { method: 'PUT', body: p }),
    remove: (id) => req(`/api/produtos/${id}`, { method: 'DELETE' }),
  },
};