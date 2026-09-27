-- ── Usuários (auth real) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    senha_hash TEXT NOT NULL,
    nome TEXT NOT NULL,
    papel TEXT NOT NULL DEFAULT 'admin' CHECK (papel IN ('admin', 'cliente')),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Catálogo (Módulo 1) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    colecao TEXT NOT NULL,
    tecido TEXT NOT NULL,
    cor TEXT NOT NULL,
    linha TEXT NOT NULL,
    aluguel NUMERIC(10, 2) NOT NULL DEFAULT 0,
    venda NUMERIC(10, 2) NOT NULL DEFAULT 0,
    foto TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- grade de tamanhos de cada modelo
CREATE TABLE IF NOT EXISTS variantes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos (id) ON DELETE CASCADE,
    tam TEXT NOT NULL,
    qtd INTEGER NOT NULL DEFAULT 0 CHECK (qtd >= 0),
    UNIQUE (produto_id, tam)
);

-- ── Transações: venda | locação avulsa | locação padronizada ──
CREATE TABLE IF NOT EXISTS transacoes (
    id SERIAL PRIMARY KEY,
    tipo TEXT NOT NULL CHECK (
        tipo IN (
            'venda',
            'locacao_avulsa',
            'locacao_padronizada'
        )
    ),
    produto_id INTEGER REFERENCES produtos (id),
    tam_pedido TEXT,
    tam_entregue TEXT,
    cliente TEXT NOT NULL,
    tel TEXT,
    documento TEXT,
    retirada DATE,
    devolucao DATE,
    valor NUMERIC(10, 2) NOT NULL DEFAULT 0,
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    devolvido BOOLEAN, -- NULL p/ venda, FALSE/TRUE p/ locação
    avarias TEXT DEFAULT '',
    contrato TEXT DEFAULT 'Rascunho' CHECK (
        contrato IN (
            'Rascunho',
            'Aguardando assinatura loja',
            'Aguardando assinatura cliente',
            'Confirmado'
        )
    ),
    noivos TEXT DEFAULT '',
    data_evento DATE,
    data_fechamento DATE,
    limite_comparecimento DATE,
    traje_confidencial BOOLEAN NOT NULL DEFAULT FALSE,
    senha_revelacao TEXT,
    padronizacao JSONB
);

-- integrantes de um pacote padronizado
CREATE TABLE IF NOT EXISTS integrantes (
    id SERIAL PRIMARY KEY,
    transacao_id INTEGER NOT NULL REFERENCES transacoes (id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    documento TEXT,
    produto_id INTEGER REFERENCES produtos (id),
    tam TEXT,
    tam_entregue TEXT,
    papel TEXT,
    numero_contrato TEXT,
    preco_negociado NUMERIC(10, 2) DEFAULT 0,
    excecao_preco TEXT DEFAULT '',
    pagamento TEXT DEFAULT 'Pendente' CHECK (
        pagamento IN (
            'Pendente',
            'Parcial',
            'Pago',
            'Incluso no pacote'
        )
    ),
    devolvido BOOLEAN DEFAULT FALSE,
    avarias TEXT DEFAULT ''
);

-- ── Ateliê ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ajustes (
    id SERIAL PRIMARY KEY,
    produto_id INTEGER NOT NULL REFERENCES produtos (id),
    transacao_id INTEGER REFERENCES transacoes (id) ON DELETE SET NULL,
    descricao TEXT NOT NULL,
    tam_original TEXT,
    tam_entregue TEXT,
    entrega DATE,
    status TEXT NOT NULL DEFAULT 'Pendente' CHECK (
        status IN (
            'Pendente',
            'Em costura',
            'Concluído'
        )
    ),
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Pedidos (ponte site → sistema) ────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id              TEXT PRIMARY KEY,
  protocolo       TEXT UNIQUE NOT NULL,
  criado_em       BIGINT NOT NULL,               -- epoch ms (igual ao front)
  status          TEXT NOT NULL DEFAULT 'Novo'
                  CHECK (status IN ('Novo','Em análise','Aprovado','Recusado')),
  tipo            TEXT NOT NULL,
  trans_id        INTEGER REFERENCES transacoes(id),
  motivo_recusa   TEXT DEFAULT '',
  cliente         JSONB NOT NULL,
  payload         JSONB NOT NULL,
  historico       JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- ── Índices ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_var_produto ON variantes (produto_id);

CREATE INDEX IF NOT EXISTS idx_int_trans ON integrantes (transacao_id);

CREATE INDEX IF NOT EXISTS idx_aj_produto ON ajustes (produto_id);

CREATE INDEX IF NOT EXISTS idx_tx_tipo ON transacoes (tipo);

CREATE INDEX IF NOT EXISTS idx_pedidos_st ON pedidos (status);

-- ── Refresh tokens ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,        -- SHA-256 do token (nunca guardar cru)
  expira_em   TIMESTAMPTZ NOT NULL,
  revogado    BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_usuario ON refresh_tokens(usuario_id);