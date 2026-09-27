import { useCallback, useEffect, useState } from 'react';
import SiteNav from './SiteNav';
import Home from './Home';
import Colecao from './Colecao';
import Pedido from './Pedido';
import Pacote from './Pacote';
import Entrar from './Entrar';
import Conta from './Conta';
import Casamento from './Casamento';
import ProdutoModal from './ProdutoModal';
import { useAuth } from '../api/useSessao';
import { ScrollTape } from './ui';

const ANCORAS = ['como-funciona', 'atelie'];
const VIEWS = ['home', 'colecao', 'pedido', 'pacote', 'entrar', 'conta', 'casamento'];

function hashToState(hash) {
  const h = (hash || '').replace(/^#/, '');
  if (!h) return { view: 'home', scrollTo: null };
  if (ANCORAS.includes(h)) return { view: 'home', scrollTo: h };
  if (VIEWS.includes(h)) return { view: h, scrollTo: null };
  return { view: 'home', scrollTo: null };
}

export default function Site() {
  const [{ view, scrollTo }, setNav] = useState(() => hashToState(window.location.hash));
  const [arg, setArg] = useState(null);
  const [rascunho, setRascunho] = useState(null);
  const [produtoAberto, setProdutoAberto] = useState(null);
  const { usuario: cliente } = useAuth();

  const go = useCallback((destino, extra) => {
    if (destino === 'como-funciona' || destino === 'atelie') {
      setNav({ view: 'home', scrollTo: destino });
      window.location.hash = destino;
      return;
    }
    setArg(extra ?? null);
    setNav({ view: destino, scrollTo: null });
    window.location.hash = destino === 'home' ? '' : destino;
    if (destino !== 'home') window.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const onHash = () => setNav(hashToState(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const openProduto = useCallback((p) => setProdutoAberto(p), []);
  const continuarPedido = useCallback((payload) => {
    setRascunho(payload);
    setProdutoAberto(null);
    go('pedido');
  }, [go]);

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>
      <ScrollTape />
      <div style={{ paddingLeft: 26 }}>
        <SiteNav view={scrollTo || view} go={go} />
        <main>
          {view === 'home' && <Home go={go} openProduto={openProduto} scrollTo={scrollTo} />}
          {view === 'colecao' && <Colecao openProduto={openProduto} foco={arg} />}
          {view === 'pedido' && <Pedido rascunho={rascunho} go={go} cliente={cliente} />}
          {view === 'pacote' && <Pacote go={go} cliente={cliente} />}
          {view === 'entrar' && <Entrar go={go} />}
          {view === 'conta' && <Conta go={go} arg={arg} />}
          {view === 'casamento' && <Casamento go={go} cliente={cliente} />}
        </main>
      </div>
      {produtoAberto && (<ProdutoModal produto={produtoAberto} onClose={() => setProdutoAberto(null)} onContinuar={continuarPedido} />)}
    </div>
  );
}