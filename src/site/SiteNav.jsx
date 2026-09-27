import { useEffect, useState } from 'react';
import { Tape, ink, sub, line, paper } from './ui';
import { ThemeToggle } from '../components/UI';
import { useAuth } from '../api/useSessao';

const mono = "var(--font-mono)";

export default function SiteNav({ view, go }) {
  const [solid, setSolid] = useState(false);
  const { usuario: cliente } = useAuth();
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { key: 'colecao', label: 'Coleção' },
    { key: 'como-funciona', label: 'Como funciona' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, background: paper, borderBottom: `1px solid ${solid ? line : 'transparent'}`, transition: 'border-color .2s' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 clamp(1.25rem, 4vw, 2.5rem)', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <button onClick={() => go('home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: 'var(--gold-text)', letterSpacing: '0.01em' }}>Apollo Rigor</span>
          <span style={{ display: 'block', fontSize: 8, letterSpacing: '0.34em', color: sub, fontFamily: mono, marginTop: 2 }}>ATELIÊ DE CERIMÔNIA</span>
        </button>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className="site-nav-links" style={{ display: 'flex', gap: 26 }}>
            {links.map((l) => (
              <button key={l.key} onClick={() => go(l.key)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: view === l.key ? 'var(--gold-text)' : ink, borderBottom: `1px solid ${view === l.key ? 'var(--gold)' : 'transparent'}` }}>{l.label}</button>
            ))}
          </div>

          <ThemeToggle variant="minimal" />

          <button onClick={() => go('pacote')} style={{ padding: '10px 18px', borderRadius: 2, cursor: 'pointer', border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--accent-ink)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Montar pacote</button>

          <button onClick={() => go(cliente ? 'conta' : 'entrar')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0 4px 20px', marginLeft: 4, borderLeft: `1px solid ${line}`, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: (view === 'entrar' || view === 'conta') ? 'var(--gold-text)' : ink }}>
            <span aria-hidden="true" style={{ width: 20, height: 20, borderRadius: '50%', border: `1px solid ${line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: mono, color: sub }}>
              {cliente ? cliente.nome.trim().charAt(0).toUpperCase() : '↪'}
            </span>
            {cliente ? cliente.nome.split(' ')[0] : 'Entrar'}
          </button>
        </nav>
      </div>
      <Tape height={7} opacity={solid ? 0.4 : 0} style={{ transition: 'opacity .2s' }} />
    </header>
  );
}