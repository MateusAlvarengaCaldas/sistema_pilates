const express = require('express');
const router = express.Router();
const pool = require('../db'); // Certifique-se que o caminho para seu banco está certo

// =========================================================================
// ROTA 1: PREVISÃO EM TEMPO REAL
// O professor olha isso durante o mês para saber quanto ganharia HOJE.
// Baseado nos alunos ativos no momento.
// =========================================================================
router.get('/previsao/:professor_id', async (req, res) => {
    const { professor_id } = req.params;

    try {
        const query = await pool.query(
            `SELECT 
                COUNT(*) as total_alunos,
                COALESCE(SUM(p.preco), 0) as faturamento_bruto,
                COALESCE(SUM(p.preco * 0.30), 0) as comissao_prevista
             FROM alunos a
             JOIN planos p ON a.plano_id = p.id
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
// Tira uma "foto" dos valores atuais e grava no histórico.
// Bloqueia se já existir um fechamento ATIVO para aquele mês.
// =========================================================================
router.post('/fechar-mes', async (req, res) => {
    const { professor_id, mes, ano } = req.body;

    try {
        // 1. Verificação de Segurança: Já existe fechamento ATIVO (não cancelado)?
        const check = await pool.query(
            `SELECT * FROM pagamentos_historico 
             WHERE professor_id = $1 AND mes = $2 AND ano = $3 
             AND data_cancelamento IS NULL`, 
            [professor_id, mes, ano]
        );
        
        if (check.rows.length > 0) {
            return res.status(400).json({ erro: "Este mês já está fechado!" });
        }

        // 2. Calcula os valores COM BASE NOS ALUNOS DE HOJE
        const calculo = await pool.query(
            `SELECT 
                COUNT(*) as qtd, 
                COALESCE(SUM(p.preco), 0) as bruto, 
                COALESCE(SUM(p.preco * 0.30), 0) as liquido
             FROM alunos a 
             JOIN planos p ON a.plano_id = p.id
             WHERE a.professor_id = $1 AND a.ativo = TRUE`,
            [professor_id]
        );

        const d = calculo.rows[0];

        // Se não tiver alunos ou valor zerado, não fecha (Regra opcional)
        if (!d.qtd || d.qtd == 0) {
            return res.status(400).json({ erro: "Professor não tem alunos ativos para fechar." });
        }

        // 3. Salva na tabela definitiva
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
// ROTA 3: REABRIR MÊS (SOFT DELETE)
// Não apaga o registro, apenas marca como cancelado.
// Permite que o mês seja fechado novamente depois.
// =========================================================================
router.put('/reabrir-mes', async (req, res) => {
    const { professor_id, mes, ano } = req.body;

    try {
        const resultado = await pool.query(
            `UPDATE pagamentos_historico 
             SET data_cancelamento = CURRENT_TIMESTAMP 
             WHERE professor_id = $1 AND mes = $2 AND ano = $3 
             AND data_cancelamento IS NULL`, // Só cancela se estiver ativo
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
// ROTA 4: EXTRATO (RELATÓRIO)
// Lista apenas os pagamentos fechados e VÁLIDOS (ignora os cancelados).
// =========================================================================
router.get('/extrato', async (req, res) => {
    // Recebe query params: ?professor_id=1&inicio=2026-01-01&fim=2026-12-31
    const { professor_id, inicio, fim } = req.query;

    try {
        const extrato = await pool.query(
            `SELECT 
                id, mes, ano, qtd_alunos, total_bruto, valor_pago,
                to_char(data_fechamento, 'DD/MM/YYYY HH24:MI') as data_processamento
             FROM pagamentos_historico
             WHERE professor_id = $1 
             AND make_date(ano, mes, 1) BETWEEN $2::date AND $3::date
             AND data_cancelamento IS NULL -- <--- IMPORTANTE: Ignora os reabertos
             ORDER BY ano DESC, mes DESC`,
            [professor_id, inicio, fim]
        );

        // Calcula o total do período solicitado no Javascript
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