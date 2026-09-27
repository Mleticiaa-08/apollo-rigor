import { useEffect, useState } from 'react';
import { Section, Wrap, Eyebrow, H2, Lead, Button, Field, TextInput, Tape, ink, sub, muted, line, card, brass } from './ui';
import { useAuth } from '../api/useSessao';
import { limparSessao, api } from '../api';
import { emailOk, telOk } from './siteData';
import { IconCheck } from './icons';

const mono = 'var(--font-mono)';

export default function Conta({ go }) {
  const { usuario, logado } = useAuth();
  const [saindo, setSaindo] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0 }); }, []);
  if (!logado || !usuario) return null;
  const sairAgora = async () => { setSaindo(true); try { await api.auth.logout(); } catch {} limparSessao(); go('home'); };

  return (
    <Section style={{ paddingTop: 'clamp(2.5rem, 6vw, 4rem)' }}>
      <Wrap>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Área do cliente</Eyebrow>
            <H2 style={{ marginTop: 14 }}>Olá, {usuario.nome.split(' ')[0]}.</H2>
            <Lead style={{ marginTop: 14 }}>{usuario.papel} · {usuario.email}</Lead>
          </div>
          <button onClick={sairAgora} disabled={saindo} style={{ background: 'transparent', border: `1px solid ${line}`, borderRadius: 2, cursor: 'pointer', padding: '9px 16px', fontFamily: mono, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: sub }}>{saindo ? 'Saindo…' : 'Sair'}</button>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
          <Button onClick={() => go('colecao')}>Abrir novo pedido</Button>
          <Button variant="ghost" onClick={() => go('pacote')}>Montar pacote de casamento</Button>
        </div>

        <div style={{ marginTop: 32 }}>
          <EditarPerfil usuario={usuario} />
        </div>
      </Wrap>
    </Section>
  );
}

function EditarPerfil({ usuario }) {
  const base = { nome: usuario.nome || '', email: usuario.email || '', tel: usuario.tel || '', documento: usuario.documento || '' };
  const [form, setForm] = useState(base);
  const [erros, setErros] = useState({});
  const [salvo, setSalvo] = useState(false);
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setSalvo(false); };
  const sujo = ['nome', 'email', 'tel', 'documento'].some((k) => form[k] !== base[k]);

  const salvar = (e) => {
    e.preventDefault();
    const er = {};
    if (form.nome.trim().length < 3) er.nome = 'Informe seu nome completo.';
    if (!emailOk(form.email)) er.email = 'E-mail inválido.';
    if (form.tel.trim() && !telOk(form.tel)) er.tel = 'Telefone com DDD.';
    setErros(er);
    if (Object.keys(er).length) return;
    setSalvo(true);
  };

  return (
    <form onSubmit={salvar} style={{ border: `1px solid ${line}`, background: card, maxWidth: 540 }}>
      <Tape height={8} style={{ opacity: 0.5 }} />
      <div style={{ padding: 'clamp(1.4rem, 4vw, 2rem)' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: ink }}>Dados da conta</p>
        <p style={{ margin: '8px 0 22px', fontSize: 13, color: sub, lineHeight: 1.6, maxWidth: '48ch' }}>Usados para preencher seus pedidos e para o ateliê entrar em contato.</p>

        <Field label="Nome completo" error={erros.nome}>
          <TextInput value={form.nome} onChange={set('nome')} autoComplete="name" placeholder="Como está no documento" />
        </Field>
        <Field label="E-mail" error={erros.email}>
          <TextInput type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="voce@email.com" disabled />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Telefone / WhatsApp" error={erros.tel}>
            <TextInput value={form.tel} onChange={set('tel')} placeholder="(11) 90000-0000" />
          </Field>
          <Field label="CPF" hint="Opcional — necessário na retirada.">
            <TextInput value={form.documento} onChange={set('documento')} placeholder="000.000.000-00" />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginTop: 6 }}>
          <Button type="submit" disabled={!sujo}>Salvar alterações</Button>
          {sujo && (<Button type="button" variant="ghost" onClick={() => { setForm(base); setErros({}); setSalvo(false); }}>Descartar</Button>)}
          {salvo && !sujo && (<span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--status-green-fg)', fontFamily: mono, display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconCheck size={13} /> Dados atualizados</span>)}
        </div>
      </div>
    </form>
  );
}