import { useEffect, useState } from 'react';
import { Section, Wrap, Eyebrow, H2, Lead, Button, Field, TextInput, Tape, ink, sub, muted, line, card, brass } from './ui';
import { api, salvarSessao } from '../api';

const mono = 'var(--font-mono)';

export default function Entrar({ go }) {
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const entrar = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const dados = await api.auth.login(email, senha);
      console.log('LOGIN OK', dados);
      salvarSessao(dados);
      if (dados.usuario.papel === 'admin') {
        window.location.href = '/sistema';
      } else {
        go('conta');
      }
    } catch (err) {
      setErro(err.message || 'E-mail ou senha incorretos');
    } finally {
      setCarregando(false);
    }
  };

  const registrar = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const dados = await api.auth.registrar(nome, email, senha);
      salvarSessao(dados);
      go('conta');
    } catch (err) {
      setErro(err.message || 'Erro ao criar conta');
    } finally {
      setCarregando(false);
    }
  };

  const ehLogin = modo === 'login';

  return (
    <Section style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
      <Wrap narrow style={{ maxWidth: 460 }}>
        <Eyebrow>Acesso</Eyebrow>
        <H2 style={{ marginTop: 14 }}>{ehLogin ? 'Entrar' : 'Criar conta'}</H2>
        <Lead style={{ marginTop: 16 }}>
          {ehLogin ? 'Acesse o painel do ateliê ou a sua área de cliente.' : 'Crie sua conta para acompanhar pedidos.'}
        </Lead>

        <div style={{ border: `1px solid ${line}`, background: card, marginTop: 30 }}>
          <Tape height={8} style={{ opacity: 0.5 }} />
          <form onSubmit={ehLogin ? entrar : registrar} style={{ padding: 'clamp(1.4rem, 4vw, 2rem)' }}>
            {!ehLogin && (
              <Field label="Nome completo">
                <TextInput value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como está no documento" autoComplete="name" required minLength={3} />
              </Field>
            )}

            <Field label="E-mail">
              <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" required />
            </Field>

            <Field label="Senha" style={{ marginBottom: 12 }}>
              <div style={{ position: 'relative' }}>
                <TextInput
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={ehLogin ? 'current-password' : 'new-password'}
                  style={{ paddingRight: 68 }}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  style={{
                    position: 'absolute', top: 0, right: 0, height: '100%', padding: '0 12px',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    fontFamily: mono, fontSize: 10.5, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: sub,
                  }}
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </Field>

            {erro && (
              <p style={{ margin: '0 0 14px', fontSize: 12.5, color: 'var(--status-red-fg)' }}>
                {erro}
              </p>
            )}

            <div style={{ display: 'grid', gap: 10 }}>
              <Button type="submit" disabled={carregando}>
                {carregando ? 'Aguarde…' : (ehLogin ? 'Entrar' : 'Criar conta')}
              </Button>
            </div>

            <p style={{ margin: '18px 0 0', fontSize: 12.5, color: sub, textAlign: 'center' }}>
              {ehLogin ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
              <button
                type="button"
                onClick={() => { setModo(ehLogin ? 'registrar' : 'login'); setErro(''); }}
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: brass, fontFamily: 'var(--font-sans)', fontSize: 12.5, textDecoration: 'underline' }}
              >
                {ehLogin ? 'Criar agora' : 'Entrar'}
              </button>
            </p>
          </form>
        </div>
      </Wrap>
    </Section>
  );
}