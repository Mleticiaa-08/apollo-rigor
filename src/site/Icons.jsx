const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconClose({ size = 16, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M6 6l12 12M18 6l-12 12" /></svg>);
}

export function IconCheck({ size = 14, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M4 12.5l5 5L20 6.5" /></svg>);
}

export function IconLock({ size = 14, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
}

export function IconArrowLeft({ size = 16, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M14 6l-6 6 6 6" /></svg>);
}

export function IconArrowRight({ size = 16, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M10 6l6 6-6 6" /></svg>);
}

export function IconArrowUp({ size = 12, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>);
}

export function IconArrowDown({ size = 12, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M12 5v14M5 12l7 7 7-7" /></svg>);
}

export function IconSearch({ size = 14, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>);
}

export function IconGrid({ size = 15, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>);
}

export function IconList({ size = 15, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16" /></svg>);
}

export function IconHome({ size = 14, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M4 11l8-7 8 7" /><path d="M6 10v9h12v-9" /></svg>);
}

export function IconSquare({ size = 14, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><rect x="5" y="5" width="14" height="14" rx="1" /></svg>);
}

export function IconUser({ size = 12, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" /></svg>);
}

export function IconSpark({ size = 22, ...p }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base} {...p}><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" /></svg>);
}

export function IconDot({ size = 6, ...p }) {
  return (<svg viewBox="0 0 8 8" width={size} height={size} aria-hidden="true" {...p}><circle cx="4" cy="4" r="3" fill="currentColor" /></svg>);
}