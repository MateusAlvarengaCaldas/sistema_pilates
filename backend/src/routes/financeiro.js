const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// =========================================================================
// ROTA 1: PREVISÃO EM TEMPO REAL (DINÂMICA)
// =========================================================================
router.get('/previsao/:professor_id', async (req, res) => {
    const { professor_id } = req.params;

    try {
        const query = await pool.query(
            `SELECT 
                COUNT(*) as total_alunos,
                COALESCE(SUM(p.preco), 0) as faturamento_bruto,
                -- Cálculo dinâmico: Preço * (Comissão do Usuário / 100)
                COALESCE(SUM(p.preco * (u.comissao / 100.0)), 0) as comissao_prevista
             FROM alunos a
             JOIN planos p ON a.plano_id = p.id
             JOIN usuarios u ON a.professor_id = u.id -- JOIN adicionado aqui
             WHERE a.professor_id = $1 
             AND a.ativo = TRUE`, 
            [professor_id]
        );

        res.json(query.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ erro: "Erro ao calcular previsão." });
    }
});

// =========================================================================
// ROTA 2: FECHAR O MÊS (SNAPSHOT)
// Grava o valor calculado com a comissão QUE O USUÁRIO TEM HOJE.
// =========================================================================
router.post('/fechar-mes', async (req, res) => {
    const { professor_id, mes, ano } = req.body;

    try {
        // 1. Verificação de Segurança (Igual ao anterior)
        const check = await pool.query(
            `SELECT * FROM pagamentos_historico 
             WHERE professor_id = $1 AND mes = $2 AND ano = $3 
             AND data_cancelamento IS NULL`, 
            [professor_id, mes, ano]
        );
        
        if (check.rows.length > 0) {
            return res.status(400).json({ erro: "Este mês já está fechado!" });
        }

        // 2. Calcula os valores COM A COMISSÃO DINÂMICA
        const calculo = await pool.query(
            `SELECT 
                COUNT(*) as qtd, 
                COALESCE(SUM(p.preco), 0) as bruto, 
                COALESCE(SUM(p.preco * (u.comissao / 100.0)), 0) as liquido
             FROM alunos a 
             JOIN planos p ON a.plano_id = p.id
             JOIN usuarios u ON a.professor_id = u.id -- JOIN adicionado aqui
             WHERE a.professor_id = $1 AND a.ativo = TRUE`,
            [professor_id]
        );

        const d = calculo.rows[0];

        if (!d.qtd || d.qtd == 0) {
            return res.status(400).json({ erro: "Professor não tem alunos ativos para fechar." });
        }

        // 3. Salva na tabela definitiva (Sem alterações aqui, pois recebe o valor pronto)
        const salvamento = await pool.query(
            `INSERT INTO pagamentos_historico 
             (professor_id, mes, ano, qtd_alunos, total_bruto, valor_pago)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [professor_id, mes, ano, d.qtd, d.bruto, d.liquido]
        );

        res.json({ 
            mensagem: "Fechamento realizado com sucesso!", 
            recibo: salvamento.rows[0] 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao fechar o mês." });
    }
});

// =========================================================================
// ROTA 3: REABRIR MÊS (SOFT DELETE) - Sem alterações
// =========================================================================
router.put('/reabrir-mes', async (req, res) => {
    const { professor_id, mes, ano } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE pagamentos_historico 
             SET data_cancelamento = CURRENT_TIMESTAMP 
             WHERE professor_id = $1 AND mes = $2 AND ano = $3 
             AND data_cancelamento IS NULL`,
            [professor_id, mes, ano]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: "Mês não encontrado ou já estava reaberto." });
        }

        res.json({ mensagem: "Mês reaberto! O registro anterior foi arquivado como cancelado." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao reabrir mês." });
    }
});

// =========================================================================
// ROTA 4: EXTRATO (RELATÓRIO) - Sem alterações
// =========================================================================
router.get('/extrato', async (req, res) => {
    const { professor_id, inicio, fim } = req.query;

    try {
        const extrato = await pool.query(
            `SELECT 
                id, mes, ano, qtd_alunos, total_bruto, valor_pago,
                to_char(data_fechamento, 'DD/MM/YYYY HH24:MI') as data_processamento
             FROM pagamentos_historico
             WHERE professor_id = $1 
             AND make_date(ano, mes, 1) BETWEEN $2::date AND $3::date
             AND data_cancelamento IS NULL
             ORDER BY ano DESC, mes DESC`,
            [professor_id, inicio, fim]
        );

        let totalPeriodo = 0;
        extrato.rows.forEach(r => totalPeriodo += parseFloat(r.valor_pago));

        res.json({
            professor_id,
            total_acumulado: totalPeriodo.toFixed(2),
            registros: extrato.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao gerar extrato." });
    }
});

module.exports = router;