// Kit visual da vitrine. Mesma paleta e tipografia do sistema (variáveis de
// index.css), porém em escala editorial: tipos display maiores, muito respiro,
// e a fita métrica do alfaiate como elemento estrutural recorrente.
import { useEffect, useRef, useState } from 'react';

export const ink = 'var(--text)';
export const sub = 'var(--text-sub)';
export const muted = 'var(--text-muted)';
export const brass = 'var(--gold-text)';
export const line = 'var(--border)';
export const paper = 'var(--bg)';
export const card = 'var(--card)';

const display = "var(--font-display)";
const sans = "var(--font-sans)";
const mono = "var(--font-mono)";
const MONO = { fontFamily: mono, fontFeatureSettings: "'tnum' 1, 'zero' 1" };

// fallback para fotos de catálogo que não carregam (URLs externas)
export const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400'%3E%3Crect width='300' height='400' fill='%23ECE7DA'/%3E%3Cg fill='none' stroke='%23A79D84' stroke-width='1'%3E%3Cpath d='M0 60h300M0 120h300M0 180h300M0 240h300M0 300h300M0 360h300'/%3E%3C/g%3E%3Ctext x='150' y='205' font-family='monospace' font-size='13' fill='%236B6453' text-anchor='middle' letter-spacing='2'%3EFOTO EM BREVE%3C/text%3E%3C/svg%3E";

export function onImgError(e) {
  if (e.currentTarget.src !== FALLBACK_IMG) e.currentTarget.src = FALLBACK_IMG;
}

// ── Fita métrica horizontal — marcações a cada 1 e 5 unidades ──────────────────
export function Tape({ height = 12, opacity = 0.5, style }) {
  return (
    <div aria-hidden="true" style={{
      height, width: '100%',
      backgroundImage:
        `repeating-linear-gradient(90deg, ${sub} 0 1px, transparent 1px 40px),` +
        `repeating-linear-gradient(90deg, ${muted} 0 1px, transparent 1px 8px)`,
      backgroundPosition: 'left bottom, left bottom',
      backgroundSize: '100% 100%, 100% 52%',
      backgroundRepeat: 'repeat-x',
      opacity, ...style,
    }} />
  );
}

// eyebrow: rótulo mono com um traço-guia à esquerda, como marca de giz do alfaiate
export function Eyebrow({ children, style }) {
  return (
    <p style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, margin: 0,
      fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
      color: brass, fontWeight: 600, ...MONO, ...style,
    }}>
      <span style={{ width: 26, height: 1, background: 'currentColor', opacity: 0.6 }} />
      {children}
    </p>
  );
}

export function Display({ children, size = 'clamp(2.4rem, 6vw, 4.6rem)', style }) {
  return (
    <h1 style={{
      fontFamily: display, fontWeight: 500, fontSize: size, lineHeight: 1.04,
      letterSpacing: '-0.02em', color: ink, margin: 0, ...style,
    }}>
      {children}
    </h1>
  );
}

export function H2({ children, style }) {
  return (
    <h2 style={{
      fontFamily: display, fontWeight: 500, fontSize: 'clamp(1.7rem, 3.4vw, 2.7rem)',
      lineHeight: 1.1, letterSpacing: '-0.015em', color: ink, margin: 0, ...style,
    }}>
      {children}
    </h2>
  );
}

export function Lead({ children, style }) {
  return (
    <p style={{
      fontFamily: sans, fontSize: 'clamp(1rem, 1.5vw, 1.18rem)', lineHeight: 1.6,
      color: sub, margin: 0, maxWidth: '46ch', ...style,
    }}>
      {children}
    </p>
  );
}

export function Money({ children, prefix, style }) {
  return <span style={{ ...MONO, ...style }}>{prefix}{children}</span>;
}

// ── Botão ─────────────────────────────────────────────────────────────────────
export function Button({ children, onClick, href, variant = 'solid', type, disabled, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
    padding: '13px 26px', borderRadius: 2, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: sans, fontSize: 13.5, fontWeight: 600, letterSpacing: '0.04em',
    textTransform: 'uppercase', textDecoration: 'none', transition: 'background .16s, color .16s, border-color .16s',
    border: '1px solid transparent', opacity: disabled ? 0.5 : 1, ...style,
  };
  const skins = {
    solid: { background: 'var(--gold)', color: 'var(--accent-ink)', borderColor: 'var(--gold)' },
    ghost: { background: 'transparent', color: ink, borderColor: line },
    dark: { background: 'var(--sidebar)', color: 'var(--sidebar-text)', borderColor: 'var(--sidebar)' },
  };
  const props = {
    onClick: disabled ? undefined : onClick,
    style: { ...base, ...skins[variant] },
    onMouseEnter: (e) => { if (!disabled && variant === 'ghost') e.currentTarget.style.borderColor = 'var(--gold)'; },
    onMouseLeave: (e) => { if (variant === 'ghost') e.currentTarget.style.borderColor = line; },
  };
  if (href) return <a href={href} {...props}>{children}</a>;
  return <button type={type || 'button'} disabled={disabled} {...props}>{children}</button>;
}

// ── Seção ─────────────────────────────────────────────────────────────────────
export function Section({ children, id, style, bleed }) {
  return (
    <section id={id} style={{
      padding: bleed ? '0' : 'clamp(3.5rem, 8vw, 7rem) 0',
      ...style,
    }}>
      {children}
    </section>
  );
}

export function Wrap({ children, narrow, style }) {
  return (
    <div style={{
      width: '100%', maxWidth: narrow ? 720 : 1180, margin: '0 auto',
      padding: '0 clamp(1.25rem, 4vw, 2.5rem)', ...style,
    }}>
      {children}
    </div>
  );
}

// ── Campos de formulário ──────────────────────────────────────────────────────
const fieldBox = {
  width: '100%', padding: '12px 14px', background: 'var(--input-bg)',
  border: `1px solid ${line}`, borderRadius: 2, color: ink, fontSize: 14,
  fontFamily: sans, outline: 'none',
};

export function Label({ children }) {
  return (
    <span style={{
      display: 'block', marginBottom: 7, fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.14em', textTransform: 'uppercase', color: sub, ...MONO,
    }}>
      {children}
    </span>
  );
}

export function Field({ label, hint, error, children, style }) {
  return (
    <label style={{ display: 'block', marginBottom: 18, ...style }}>
      {label && <Label>{label}</Label>}
      {children}
      {hint && !error && <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: muted }}>{hint}</span>}
      {error && <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--status-red-fg)' }}>{error}</span>}
    </label>
  );
}

export function TextInput(props) {
  return <input {...props} style={{ ...fieldBox, ...props.style }} />;
}

export function TextArea(props) {
  return <textarea {...props} style={{ ...fieldBox, minHeight: 90, resize: 'vertical', ...props.style }} />;
}

export function Select({ options, placeholder = 'Selecione…', ...props }) {
  return (
    <select {...props} style={{ ...fieldBox, cursor: 'pointer', appearance: 'none', ...props.style }}>
      <option value="">{placeholder}</option>
      {options.map((o) => {
        const v = o.value ?? o;
        const l = o.label ?? o;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  );
}

// grupo de opções em "fichas" — usado para modalidade e tamanho
export function ChipGroup({ value, onChange, options, columns }) {
  return (
    <div style={{
      display: 'grid', gap: 8,
      gridTemplateColumns: columns ? `repeat(${columns}, 1fr)` : 'repeat(auto-fill, minmax(84px, 1fr))',
    }}>
      {options.map((o) => {
        const v = o.value ?? o;
        const l = o.label ?? o;
        const on = value === v;
        return (
          <button key={v} type="button" onClick={() => onChange(v)} style={{
            padding: '11px 12px', borderRadius: 2, cursor: 'pointer', textAlign: 'left',
            fontFamily: sans, fontSize: 13, fontWeight: on ? 600 : 500,
            background: on ? 'var(--gold-dim)' : 'transparent',
            color: on ? 'var(--gold-strong)' : ink,
            border: `1px solid ${on ? 'var(--gold)' : line}`,
          }}>
            {l}
            {o.sub && <span style={{ display: 'block', marginTop: 3, fontSize: 11, fontWeight: 500, color: sub }}>{o.sub}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Assinatura: fita métrica vertical que preenche conforme a rolagem ──────────
export function ScrollTape() {
  const [pct, setPct] = useState(0);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(1, window.scrollY / h) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 26, zIndex: 30,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      borderRight: `1px solid ${line}`, background: paper,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-linear-gradient(180deg, ${muted} 0 1px, transparent 1px 9px)`,
        opacity: 0.5,
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0,
        height: `${(reduce.current ? 0 : pct) * 100}%`,
        background: 'var(--gold-dim)',
        borderBottom: `2px solid var(--gold)`,
        transition: reduce.current ? 'none' : 'height .1s linear',
      }} />
      <span style={{
        position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%) rotate(180deg)',
        writingMode: 'vertical-rl', fontSize: 8.5, letterSpacing: '0.3em',
        color: muted, ...MONO,
      }}>
        APOLLO RIGOR
      </span>
    </div>
  );
}

// cartão de produto da vitrine
export function ProdutoCard({ produto, onOpen }) {
  return (
    <button onClick={() => onOpen(produto)} style={{
      display: 'block', textAlign: 'left', width: '100%', cursor: 'pointer',
      background: 'transparent', border: 'none', padding: 0, fontFamily: sans,
    }}>
      <div style={{
        aspectRatio: '3 / 4', overflow: 'hidden', background: card,
        border: `1px solid ${line}`, marginBottom: 12,
      }}>
        <img
          src={produto.foto}
          alt={produto.nome}
          loading="lazy"
          onError={onImgError}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .5s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      </div>
      <p style={{ margin: 0, fontFamily: display, fontSize: 18, fontWeight: 500, color: ink, letterSpacing: '-0.01em' }}>
        {produto.nome}
      </p>
      <p style={{ margin: '3px 0 0', fontSize: 12.5, color: sub }}>{produto.cor} · {produto.tecido}</p>
      <p style={{ margin: '9px 0 0', fontSize: 12, color: muted, ...MONO }}>
        Aluguel <span style={{ color: brass, fontWeight: 600 }}>R$ {produto.aluguel}</span>
        <span style={{ margin: '0 8px' }}>·</span>
        Compra <span style={{ color: ink }}>R$ {produto.venda}</span>
      </p>
    </button>
  );
}
