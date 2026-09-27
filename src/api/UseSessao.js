import { useEffect, useState } from 'react';
import { getUser, getAccess } from '../api.js';

export function useAuth() {
  const [usuario, setUsuario] = useState(() => getUser());
  useEffect(() => {
    const sync = () => setUsuario(getUser());
    window.addEventListener('apollo-auth', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('apollo-auth', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  const logado = !!getAccess() && !!usuario;
  return { usuario, logado };
}