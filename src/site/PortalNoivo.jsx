import { useState } from 'react';
import { Tape, onImgError, ink, sub, muted, line, card, brass } from './ui';
import { IconCheck, IconLock, IconSpark } from './icons';
import { comparecimentoPacote, integranteCompareceu, integrantePago, pagamentosPacote } from '../logic';
import { CATALOGO } from './siteData';
import { fmtDate, PAGAMENTO_MAP } from '../constants';

const mono = 'var(--font-mono)';
const MONO_FEAT = { fontFamily: mono, fontFeatureSettings: "'tnum' 1, 'zero' 1" };
const hojeISO = () => new Date().toISOString().slice(0, 10);

function categoriasDoGrupo(integrantes) {
  const vistos = new Set();
  const lista = [];
  integrantes.forEach((i) => { if (vistos.has(i.papel)) return; vistos.add(i.papel); lista.push({ papel: i.papel, produto: CATALOGO.find((p) => p.id === i.produtoId) }); });
  return lista;
}

const FILTROS = [{ key: 'todos', label: 'Todos' }, { key: 'retirados', label: 'Retirados' }, { key: 'aguardando', label: 'Aguardando' }, { key: 'pagar', label: 'A pagar' }];

function casaFiltro(i, filtro) {
  if (filtro === 'retirados') return integranteCompareceu(i);
  if (filtro === 'aguardando') return !integranteCompareceu(i);
  if (filtro === 'pagar') return !integrantePago(i);
  return true;
}

export default function PortalNoivo({ pacote }) {
  const integrantes = pacote.integrantes || [];
  const { total, compareceram, faltam } = comparecimentoPacote(pacote);
  const { pagos, aPagar } = pagamentosPacote(pacote);
  const atrasado = faltam > 0 && pacote.limiteComparecimento && hojeISO() > pacote.limiteComparecimento;
  const categorias = categoriasDoGrupo(integrantes);
  const confidencial = !!pacote.trajeConfidencial;
  const [revelado, setRevelado] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const revelarTraje = () => setRevelado(true);
  const noivoOculto = confidencial && !revelado;
  const pctRetirada = total ? Math.round((compareceram / total) * 100) : 0;
  const visiveis = integrantes.filter((i) => casaFiltro(i, filtro));

  return (
    <div>
      <div style={{ border: `1px solid ${line}`, background: card }}>
        <Tape height={8} style={{ opacity: 0.5 }} />
        <div style={{ padding: '22px 24px' }}>
          <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>Seu pacote</p>
          <p style={{ margin: '10px 0 2px', fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.4vw, 2.1rem)', fontWeight: 500, color: ink, letterSpacing: '-0.01em' }}>{pacote.noivos}</p>
          <p style={{ margin: 0, fontSize: 13, color: sub }}>Evento em {fmtDate(pacote.dataEvento)}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px', marginTop: 12 }}>
            <RefItem k="Janela de retirada" v={`${fmtDate(pacote.retirada)} – ${fmtDate(pacote.devolucao)}`} />
            <RefItem k="Pacote fechado em" v={fmtDate(pacote.dataFechamento)} />
            <RefItem k="Contrato" v={pacote.contrato} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 18 }}>
            <Metric v={total} l="participantes" />
            <Metric v={compareceram} l="já retiraram" />
            <Metric v={faltam} l="ainda faltam" />
          </div>
        </div>
      </div>

      {atrasado && (
        <div style={{ margin: '16px 0', padding: '14px 16px', border: `1px solid var(--status-orange-border)`, background: 'var(--status-orange-bg)' }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--status-orange-fg)', lineHeight: 1.5 }}><b>A data-limite chegou.</b> Ainda falta{faltam > 1 ? 'm' : ''} {faltam} integrante{faltam > 1 ? 's' : ''} comparecer{faltam > 1 ? 'em' : ''} ao ateliê para retirar o traje.</p>
        </div>
      )}

      <div style={{ border: `1px solid ${line}`, background: card, marginTop: 16, padding: '22px 24px' }}>
        <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>Roupas do casamento</p>
        <p style={{ margin: '8px 0 18px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: ink }}>Padronização escolhida</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
          {categorias.map((c) => (<CategoriaCard key={c.papel} categoria={c} detalhes={pacote.padronizacao?.[c.papel]} oculto={noivoOculto && String(c.papel).toLowerCase().startsWith('noivo')} />))}
        </div>
        {confidencial && (<RevelarTraje revelado={revelado} senha={pacote.senhaRevelacao} onRevelar={revelarTraje} />)}
      </div>

      <div style={{ border: `1px solid ${line}`, background: card, marginTop: 16, padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: brass, fontFamily: mono, fontWeight: 600 }}>Acompanhamento</p>
            <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, color: ink }}>Seu grupo</p>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: sub, fontFamily: mono }}>Limite p/ retirada: {fmtDate(pacote.limiteComparecimento)}</p>
        </div>

        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: sub, marginBottom: 8, ...MONO_FEAT }}>
            <span>Progresso da retirada</span>
            <b style={{ color: brass, fontWeight: 600 }}>{pctRetirada}%</b>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'var(--border-soft)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pctRetirada}%`, background: 'var(--gold)', borderRadius: 999, transition: 'width .6s ease' }} />
          </div>
          <p style={{ margin: '8px 0 0', fontSize: 11.5, color: muted, ...MONO_FEAT }}>{pagos} de {total} com pagamento quitado{aPagar > 0 ? ` · ${aPagar} a acertar` : ''}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '18px 0 4px' }}>
          {FILTROS.map((f) => {
            const on = filtro === f.key;
            return (<button key={f.key} onClick={() => setFiltro(f.key)} style={{ padding: '6px 13px', borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: on ? 600 : 500, background: on ? 'var(--gold-dim)' : 'transparent', color: on ? 'var(--gold-strong)' : sub, border: `1px solid ${on ? 'var(--gold)' : line}` }}>{f.label}</button>);
          })}
        </div>

        <div style={{ marginTop: 8 }}>
          {visiveis.length === 0 && (<p style={{ fontSize: 12.5, color: muted, padding: '14px 0' }}>Nenhum integrante neste filtro.</p>)}
          {visiveis.map((i, idx) => {
            const compareceu = integranteCompareceu(i);
            const selo = compareceu ? `Contrato ${i.numeroContrato}` : i.nome.split(' ')[0].toUpperCase();
            const pag = PAGAMENTO_MAP[i.pagamento] || PAGAMENTO_MAP['Pendente'];
            return (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: idx < visiveis.length - 1 ? `1px solid var(--border-soft)` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                  <span style={{ flexShrink: 0, minWidth: 90, textAlign: 'center', padding: '6px 10px', borderRadius: 2, fontSize: 10.5, fontWeight: 700, ...MONO_FEAT, background: compareceu ? 'var(--gold)' : 'transparent', color: compareceu ? 'var(--accent-ink)' : muted, border: compareceu ? '1px solid var(--gold)' : `1px dashed ${line}` }}>{compareceu ? selo : 'Aguardando'}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: ink }}>{i.nome}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: sub }}>{i.papel}</p>
                  </div>
                </div>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 2, fontSize: 10.5, fontWeight: 600, ...MONO_FEAT, background: compareceu ? 'var(--status-green-bg)' : 'var(--status-orange-bg)', color: compareceu ? 'var(--status-green-fg)' : 'var(--status-orange-fg)', border: `1px solid ${compareceu ? 'var(--status-green-border)' : 'var(--status-orange-border)'}` }}>{compareceu ? 'Retirou' : 'Ainda precisa ir'}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: pag.color, ...MONO_FEAT }}>{i.pagamento === 'Pago' ? '● Pago' : i.pagamento === 'Incluso no pacote' ? '● Incluso no pacote' : i.pagamento === 'Parcial' ? '● Pagamento parcial' : '● Pagamento em aberto'}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 18, paddingTop: 16, borderTop: `1px solid var(--border-soft)`, fontSize: 11.5, color: muted }}>
          <Legenda cor="var(--status-green-fg)" texto="Traje já retirado" />
          <Legenda cor="var(--status-orange-fg)" texto="Pago, aguardando retirada" />
          <Legenda cor="var(--status-red-fg)" texto="Pagamento em aberto" />
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: 11.5, color: muted, margin: '20px 0 0' }}>Este portal mostra somente o pacote de {pacote.noivos}. Alterações devem ser solicitadas ao ateliê.</p>
    </div>
  );
}

function RefItem({ k, v }) {
  return (<span style={{ fontSize: 11.5, color: sub }}><span style={{ color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, ...MONO_FEAT }}>{k}: </span><b style={{ color: ink, fontWeight: 500 }}>{v}</b></span>);
}

function Legenda({ cor, texto }) {
  return (<span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: cor }} />{texto}</span>);
}

function Metric({ v, l }) {
  return (<div style={{ background: 'var(--bg-elevated)', border: `1px solid ${line}`, padding: '14px 16px' }}><p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: brass, ...MONO_FEAT }}>{v}</p><p style={{ margin: '2px 0 0', fontSize: 11.5, color: sub }}>{l}</p></div>);
}

function CategoriaCard({ categoria: c, detalhes, oculto }) {
  return (
    <div style={{ border: `1px solid ${oculto ? 'var(--gold-dim)' : line}`, overflow: 'hidden' }}>
      <div style={{ aspectRatio: '4 / 3', overflow: 'hidden', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {oculto || !c.produto?.foto ? (<IconSpark size={26} style={{ color: brass, opacity: 0.7 }} />) : (<img src={c.produto.foto} alt={c.produto.nome} loading="lazy" onError={onImgError} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />)}
      </div>
      <div style={{ padding: '11px 13px' }}>
        <p style={{ margin: 0, fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em', color: brass, fontFamily: mono }}>{String(c.papel).toUpperCase()}</p>
        <p style={{ margin: '4px 0 2px', fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: ink }}>{oculto ? 'Surpresa do noivo' : (c.produto?.nome || 'Modelo a definir')}</p>
        <p style={{ margin: 0, fontSize: 10.5, color: sub }}>{oculto ? 'Mantido confidencial' : [c.produto?.tecido, c.produto?.cor].filter(Boolean).join(' · ') || [c.produto?.linha, c.produto?.colecao].filter(Boolean).join(' · ')}</p>
        {!oculto && detalhes && (<div style={{ margin: '10px 0 0', paddingTop: 9, borderTop: `1px solid var(--border-soft)`, fontSize: 10.5, color: muted, lineHeight: 1.6 }}>{[detalhes.corte, detalhes.colete, detalhes.gravata, detalhes.lenco].filter(Boolean).join(' · ')}{detalhes.nota && (<p style={{ margin: '6px 0 0', color: sub, fontStyle: 'italic' }}>{detalhes.nota}</p>)}</div>)}
        {oculto && (<p style={{ margin: '10px 0 0', fontSize: 10, color: muted, fontFamily: mono, display: 'inline-flex', alignItems: 'center', gap: 5 }}><IconLock size={10} /> revele com a senha abaixo</p>)}
      </div>
    </div>
  );
}

function RevelarTraje({ revelado, senha, onRevelar }) {
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState(false);
  if (revelado) { return (<p style={{ margin: '16px 0 0', fontSize: 12, color: 'var(--status-green-fg)', fontFamily: mono, display: 'inline-flex', alignItems: 'center', gap: 6 }}><IconCheck size={12} /> Traje do noivo revelado nesta visita — some ao sair do portal.</p>); }
  const enviar = (e) => { e.preventDefault(); const ok = String(valor).trim().toLowerCase() === String(senha || '').trim().toLowerCase(); if (ok) { onRevelar(); return; } setErro(true); };
  return (
    <div style={{ margin: '16px 0 0', padding: '14px 16px', border: `1px dashed var(--gold-dim)`, background: 'var(--bg-elevated)' }}>
      {!aberto ? (
        <button onClick={() => setAberto(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, fontFamily: mono, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: brass, display: 'inline-flex', alignItems: 'center', gap: 7 }}><IconLock size={13} /> Revelar o traje do noivo</button>
      ) : (
        <form onSubmit={enviar} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: sub, width: '100%' }}>Só o casal tem a senha — combinada com o ateliê no fechamento do pacote.</span>
          <input type="password" value={valor} onChange={(e) => { setValor(e.target.value); setErro(false); }} placeholder="Senha do casal" autoComplete="off" style={{ flex: '1 1 180px', padding: '10px 12px', background: 'var(--input-bg)', border: `1px solid ${erro ? 'var(--status-red-border)' : line}`, borderRadius: 2, color: ink, fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }} />
          <button type="submit" style={{ padding: '10px 18px', borderRadius: 2, cursor: 'pointer', border: '1px solid var(--gold)', background: 'var(--gold)', color: 'var(--accent-ink)', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Revelar</button>
          {erro && <span style={{ width: '100%', fontSize: 11.5, color: 'var(--status-red-fg)' }}>Senha incorreta. Confira com o ateliê.</span>}
        </form>
      )}
    </div>
  );
}