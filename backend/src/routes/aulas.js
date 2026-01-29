const express = require('express');
const router = express.Router();
const pool = require('../db');

//AUDITORIA (REGISTRAR AULA)

router.post( '/registrar-aula', async (req, res) => {
    const { professor_id, aluno_id, data_aula, status_presenca, observacao} = req.body;
    try{
        const novaAula = await pool.query(
            `INSERT INTO historico-aulas (professor_id, aluno_id, data_aula, status_presenca, observacao)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [professor_id, aluno_id, data_aula || new Date(), status_presenca || 'Presente', observacao] 
        );
        res.json({ mensagem: "Presença registrada", registro: novaAula.rows[0]});
    } catch(err) {
        res.status(500).json({erro: "Erro ao registrar presença."})
    }
});

router.get('/historico/:aluno_id', async (req, res) => {
    const {aluno_id} = req.params;
    try{

    } catch(err){
        res.status(500).json({erro: "Erro ao buscar historico."});
    }
});

module.exports = router;