const express = require('express');
const router = express.Router();
const pool = require('../db');

// =========================================================================
// ROTA 1: REGISTRAR AULA (Serve para Agendar ou Confirmar presença)
// =========================================================================
router.post('/registrar-aula', async (req, res) => {
    const { professor_id, aluno_id, data_aula, status_presenca, observacao } = req.body;

    try {
        const novaAula = await pool.query(
            `INSERT INTO historico_aulas (professor_id, aluno_id, data_aula, status_presenca, observacao)
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING *`,
            [
                professor_id, 
                aluno_id, 
                data_aula, // O Frontend deve mandar a data com horário (ISO string)
                status_presenca || 'Pendente', // Mudado padrão para 'Pendente' se for agendamento futuro
                observacao
            ]
        );

        res.json({ 
            mensagem: "✅ Aula registrada/agendada com sucesso!", 
            registro: novaAula.rows[0]
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao registrar aula." });
    }
});

// =========================================================================
// ROTA 2: HISTÓRICO INDIVIDUAL (Perfil do Aluno)
// =========================================================================
router.get('/historico/:aluno_id', async (req, res) => {
    const { aluno_id } = req.params;

    try {
        const query = `
            SELECT 
                h.id,
                h.data_aula,
                h.status_presenca,
                h.observacao,
                u.nome AS nome_professor
            FROM historico_aulas h
            JOIN usuarios u ON h.professor_id = u.id
            WHERE h.aluno_id = $1
            ORDER BY h.data_aula DESC
        `;

        const resultado = await pool.query(query, [aluno_id]);
        res.json(resultado.rows);

    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar histórico." });
    }
});

// =========================================================================
// ROTA 3: BUSCAR AGENDA DA SEMANA (Nova!)
// Essa é a rota que o componente React da Agenda vai chamar
// =========================================================================
router.get('/agenda', async (req, res) => {
    // Pegando as datas enviadas pelo React
    const { inicio, fim } = req.query;

    console.log(`🔎 Buscando agenda de: ${inicio} até ${fim}`);

    try {
        const query = `
            SELECT 
                h.id,
                h.data_aula, 
                h.status_presenca as status,
                h.observacao,
                a.nome as aluno,
                u.nome as professor -- Nome do professor vindo da tabela usuarios
            FROM historico_aulas h
            JOIN alunos a ON h.aluno_id = a.id
            LEFT JOIN usuarios u ON h.professor_id = u.id 
            WHERE h.data_aula BETWEEN $1 AND $2
            ORDER BY h.data_aula ASC
        `;

        // Executa a query passando as duas datas
        const resultado = await pool.query(query, [inicio, fim]);
        
        console.log(`✅ Sucesso! Encontradas ${resultado.rows.length} aulas.`);
        res.json(resultado.rows);

    } catch(err) {
        console.error("❌ ERRO NO POSTGRES:", err.message);
        
        res.status(500).json({ 
            erro: "Erro interno no servidor ao buscar agenda.",
            detalhes: err.message 
        });
    }
});

// =========================================================================
// ROTA 4: ATUALIZAR STATUS DA AULA (Confirmar presença, Falta, etc)
// =========================================================================
router.put('/:id/status', async (req, res) => {
    // 1. Pegamos o ID da aula que vem na URL (ex: /aulas/5/status)
    const { id } = req.params; 
    
    // 2. Pegamos o novo status que o React enviou no corpo do pedido
    const { status_presenca } = req.body; 

    try {
        // 3. Mandamos o PostgreSQL atualizar APENAS a linha que tem esse ID
        const atualizacao = await pool.query(
            `UPDATE historico_aulas 
             SET status_presenca = $1 
             WHERE id = $2 
             RETURNING *`,
            [status_presenca, id] // $1 vira o status, $2 vira o ID
        );

        res.json({ 
            mensagem: "Status atualizado com sucesso!", 
            aula: atualizacao.rows[0] 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao atualizar status da aula." });
    }
});


module.exports = router; 