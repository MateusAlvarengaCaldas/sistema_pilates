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
    // O frontend vai mandar: ?professor_id=1&inicio=2024-02-19&fim=2024-02-25
    const { professor_id, inicio, fim } = req.query;

    try {
        const query = `
            SELECT 
                h.id,
                h.data_aula, -- O Frontend precisa disso para saber em qual dia/hora plotar o card
                h.status_presenca as status, -- Alias para bater com o frontend
                h.observacao,
                a.nome as aluno -- Precisamos do nome do aluno para exibir no card
            FROM historico_aulas h
            JOIN alunos a ON h.aluno_id = a.id -- JOIN com a tabela de alunos
            WHERE h.professor_id = $1
            AND h.data_aula BETWEEN $2 AND $3
            ORDER BY h.data_aula ASC
        `;

        const resultado = await pool.query(query, [professor_id, inicio, fim]);
        
        // Retorna array de aulas encontradas naquelas datas
        res.json(resultado.rows);

    } catch(err) {
        console.error(err);
        res.status(500).json({ erro: "Erro ao buscar agenda semanal." });
    }
});

module.exports = router;