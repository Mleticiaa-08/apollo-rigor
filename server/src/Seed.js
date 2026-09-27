import 'dotenv/config';
import { pool, tx } from './db.js';
import { PRODUTOS_INIT, TRANS_INIT, AJUSTES_INIT } from '../../src/constants.js';

async function main() {
  await tx(async (client) => {
    await client.query(`TRUNCATE ajustes, integrantes, transacoes, variantes, produtos RESTART IDENTITY CASCADE`);
    console.log('→ tabelas limpas');

    const produtosMap = new Map();
    for (const p of PRODUTOS_INIT) {
      const { rows } = await client.query(
        `INSERT INTO produtos (nome,categoria,colecao,tecido,cor,linha,aluguel,venda,foto)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
        [p.nome,p.categoria,p.colecao,p.tecido,p.cor,p.linha,p.aluguel,p.venda,p.foto || null],
      );
      const pid = rows[0].id;
      produtosMap.set(p.id, pid);
      for (const v of p.variantes || []) {
        await client.query(`INSERT INTO variantes (produto_id,tam,qtd) VALUES ($1,$2,$3)`, [pid, v.tam, v.qtd]);
      }
    }
    console.log(`→ ${PRODUTOS_INIT.length} produtos`);

    for (const t of TRANS_INIT) {
      const { rows } = await client.query(
        `INSERT INTO transacoes
          (tipo,produto_id,tam_pedido,tam_entregue,cliente,tel,documento,
           retirada,devolucao,valor,data,devolvido,avarias,contrato,
           noivos,data_evento,data_fechamento,limite_comparecimento,
           traje_confidencial,senha_revelacao,padronizacao)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
         RETURNING id`,
        [
          t.tipo,
          t.produtoId ? produtosMap.get(t.produtoId) : null,
          t.tamPedido || null, t.tamEntregue || null,
          t.cliente, t.tel || null, t.documento || null,
          t.retirada || null, t.devolucao || null,
          t.valor, t.data,
          t.devolvido === null || t.devolvido === undefined ? null : t.devolvido,
          t.avarias || '', t.contrato || 'Rascunho',
          t.noivos || '', t.dataEvento || null,
          t.dataFechamento || null, t.limiteComparecimento || null,
          !!t.trajeConfidencial, t.senhaRevelacao || null,
          t.padronizacao ? JSON.stringify(t.padronizacao) : null,
        ],
      );
      const tid = rows[0].id;
      for (const i of t.integrantes || []) {
        await client.query(
          `INSERT INTO integrantes
            (transacao_id,nome,documento,produto_id,tam,tam_entregue,papel,
             numero_contrato,preco_negociado,excecao_preco,pagamento,devolvido,avarias)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
          [
            tid, i.nome, i.documento || null,
            i.produtoId ? produtosMap.get(i.produtoId) : null,
            i.tam || null, i.tamEntregue || null, i.papel || null,
            i.numeroContrato || '', i.precoNegociado ?? 0,
            i.excecaoPreco || '', i.pagamento || 'Pendente',
            !!i.devolvido, i.avarias || '',
          ],
        );
      }
    }
    console.log(`→ ${TRANS_INIT.length} transações`);

    for (const a of AJUSTES_INIT) {
      await client.query(
        `INSERT INTO ajustes (produto_id,transacao_id,descricao,tam_original,tam_entregue,entrega,status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [produtosMap.get(a.produtoId), a.transId || null, a.desc, a.tamOriginal || null, a.tamEntregue || null, a.entrega || null, a.status],
      );
    }
    console.log(`→ ${AJUSTES_INIT.length} ajustes`);
  });
  console.log('✔ seed completo');
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });