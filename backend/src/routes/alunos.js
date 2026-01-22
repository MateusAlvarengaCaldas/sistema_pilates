const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa a conexão que criamos no passo 1

// LISTAR ALUNOS (GET /)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT 
                alunos.*, 
                usuarios.nome AS nome_professor, 
                planos.nome AS nome_plano
            FROM alunos
            LEFT JOIN usuarios ON alunos.professor_id = usuarios.id
            LEFT JOIN planos ON alunos.plano_id = planos.id
            ORDER BY alunos.nome ASC
        `;
        const resultado = await pool.query(query);
        res.json(resultado.rows);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
});

// CADASTRAR ALUNO (POST /)
router.post('/', async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, plano_id, professor_id } = req.body;

    try {
        const query = `
            INSERT INTO alunos (nome, cpf, data_nascimento, telefone, plano_id, professor_id, "Status") 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;
        // Status padrão true
        const values = [nome, cpf, data_nascimento, telefone, plano_id, professor_id, true];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
    }
});

// ATUALIZAR STATUS (PUT /:id/status)
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const query = `UPDATE alunos SET "Status" = $1 WHERE id = $2 RETURNING *`;
        const { rows } = await pool.query(query, [status, id]);
        
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ erro: 'Erro ao atualizar status' });
    }
});

module.exports = router;