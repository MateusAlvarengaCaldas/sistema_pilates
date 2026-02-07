const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa a conexão

// LISTAR PLANOS (GET /)
router.get('/', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM planos WHERE ativo = true ORDER BY valor_mensal ASC');
        res.json(resultado.rows);
    } catch (error){
        console.error("Erro ao buscar planos:", error);
        res.status(500).json({erro : 'Erro ao buscar planos!'});
    }
});

// CRIAR PLANO (POST /)
router.post('/', async(req, res) => {
    const { nome, valor_mensal, qtde_aulas_semana, ativo } = req.body;
    
    const statusAtivo = (ativo !== undefined) ? ativo : true;

    try{
        const query = `
            INSERT INTO planos (nome, valor_mensal, qtde_aulas_semana, ativo) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        
        const resultado = await pool.query(query, [nome, valor_mensal, qtde_aulas_semana, statusAtivo]);
        res.status(201).json(resultado.rows[0]);

    } catch(error){
        console.error("Erro ao criar plano:", error);
        res.status(500).json({erro: 'Erro ao tentar criar novo plano!'})
    }
});

router.put('/:id/ativo', async(req, res)=>{
    const {id} = req.params;
    const {ativo} = req.body;

    try{
        const query = `UPDATE planos SET "ativo" = $1 WHERE id = $2 RETURNING*`;
        const {rows} = await pool.query(query, [ativo, id]);

        res.status(200).json(rows[0]);
    } catch(error){
        console.error("Erro ao atualizar o Status", error);
        res.status(500).json({erro: 'Erro ao atualizar o status.'})
    }
});

module.exports = router;