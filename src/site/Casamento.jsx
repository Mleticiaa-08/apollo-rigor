import { useEffect } from 'react';
import { Section, Wrap, Eyebrow, Display, sub } from './ui';

export default function Casamento({ go, cliente }) {
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  useEffect(() => { if (!cliente) go('entrar'); }, [cliente, go]);
  if (!cliente) return null;

  return (
    <Section style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
      <Wrap narrow>
        <Eyebrow>Portal do casamento</Eyebrow>
        <Display style={{ marginTop: 18 }}>{cliente.nome}</Display>
        <p style={{ margin: '16px 0 0', fontSize: 14, color: sub }}>Bem-vindo à sua área exclusiva.</p>
      </Wrap>
    </Section>
  );
}