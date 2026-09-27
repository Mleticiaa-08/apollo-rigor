// Dados e textos da vitrine. O catálogo reaproveita PRODUTOS_INIT do sistema —
// mesma fonte de verdade que o estoque interno.
import { PRODUTOS_INIT, fmt } from '../constants';

export const CATALOGO = PRODUTOS_INIT;

export const money = (v) => `R$ ${fmt(v)}`;

// tamanhos cadastrados para um modelo, na ordem da grade
export const tamanhosDe = (p) => (p.variantes || []).map((v) => v.tam);

// menor preço de aluguel do catálogo, para a chamada "a partir de"
export const aluguelMinimo = () => Math.min(...CATALOGO.map((p) => p.aluguel));

// A vitrine agrupa por finalidade, não por categoria de estoque — é assim que
// o cliente pensa ("vou a um casamento", "sou padrinho").
export const VITRINES = [
  { id: 'noivo', titulo: 'Para o noivo', desc: 'Ternos e smokings de cerimônia, com ajuste de ateliê incluso.', filtro: (p) => p.categoria === 'Terno' && (p.colecao === 'Noivos Premium' || p.colecao === 'Black Tie') },
  { id: 'padrinhos', titulo: 'Padrinhos e pais', desc: 'Modelos padronizados para vestir o grupo inteiro na mesma linha.', filtro: (p) => p.linha === 'Padronizada' && p.categoria === 'Terno' },
  { id: 'convidado', titulo: 'Convidado', desc: 'Um traje certo para a festa sem precisar comprar.', filtro: (p) => p.categoria === 'Terno' && p.colecao === 'Clássica' },
  { id: 'acessorios', titulo: 'Sapatos e acessórios', desc: 'Fecham o traje: verniz, gravata de seda, camisaria.', filtro: (p) => ['Sapato', 'Gravata', 'Camisa', 'Acessório'].includes(p.categoria) },
];

export const PASSOS = [
  { n: '01', t: 'Escolha o traje', d: 'Navegue pela coleção e monte seu pedido — locação, compra ou pacote para o grupo do casamento.' },
  { n: '02', t: 'Deixe suas medidas', d: 'No pedido você informa o tamanho de referência. A peça sai da prateleira já reservada no seu nome.' },
  { n: '03', t: 'Prova no ateliê', d: 'Você marca a prova e nossa equipe faz os ajustes de barra, cintura e ombro sem custo adicional.' },
  { n: '04', t: 'Retirada e devolução', d: 'Retira na data combinada e devolve após o evento. Nos pacotes, cada integrante retira o seu.' },
];

export const ATELIE = {
  cidade: 'São Paulo',
  endereco: 'R. Augusta, 1442 — Consolação',
  horario: 'Seg a sex 10h–19h · sáb 10h–16h',
  email: 'atelie@apollorigor.com.br',
  tel: '(11) 3255-0140',
};

// validação leve de formulário, reutilizada nos dois fluxos de pedido
export const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
export const telOk = (v) => String(v || '').replace(/\D/g, '').length >= 10;
