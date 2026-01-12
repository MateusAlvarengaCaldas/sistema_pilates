const express = require('express');
const router = express.Router();
const { Pool } = require('pg');



// Lembre-se: O process.env precisa do pacote 'dotenv' configurado no index.js
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- ROTA DE LOGIN ---
router.post('/login', async (req, res) => {
    console.log("✅ ENTREI NA ROTA DE LOGIN!"); // <--- ADICIONE ISSO AQUI
    console.log("Dados recebidos:", req.body);
    const { email, senha } = req.body;
    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const resultado = await pool.query(query, [email]);

        // CORREÇÃO 1: Pegar de 'resultado', não de 'usuario'
        const usuario = resultado.rows[0];

        // CORREÇÃO 2: Verificar se usuário existe ANTES de checar a senha
        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        // CORREÇÃO 3: 'true' é minúsculo em JS
        if (usuario.aprovado !== true) {
            return res.status(403).json({ erro: 'Seu cadastro ainda está em análise pelo Admin.' });
        }

        res.json({ mensagem: 'Login aceito', usuario: { email: usuario.email, id: usuario.id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno' });
    }
});

// --- ROTA DE REGISTRO ---
router.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const tipo = 'professor';
    try {
        // CORREÇÃO 4: 'RETURNING' escrito corretamente
        const query = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES($1, $2, $3, $4) RETURNING id, nome, email, aprovado';
        
        // CORREÇÃO 5: Sintaxe correta -> pool.query(string, [array])
        const resultado = await pool.query(query, [nome, email, senha, tipo]);

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.log(error);
        // CÓDIGO DE DUPLICIDADE (Email já existe)
        if (error.code === '23505') {
            // CORREÇÃO 6: É res.status, não res.resultado
            return res.status(400).json({ erro: 'Email já cadastrado!' });
        }
        res.status(500).json({ erro: 'Erro ao tentar cadastrar um usuário!' });
    }
});

// --- LISTAR ALUNOS ---
router.get('/alunos', async (req, res) => {
    try {
        const resultado = await pool.query("SELECT * FROM alunos ORDER BY nome");
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro ao buscar alunos' });
    }
});

// --- CADASTRAR ALUNO ---
router.post('/alunos', async (req, res) => {
    // CORREÇÃO 7: É req.body (request), não res.body (response)
    const { nome, cpf, data_nascimento, telefone, plano_id} = req.body;

    try {
        // CORREÇÃO 8: SQL completo com VALUES e RETURNING
        const query = `
            INSERT INTO alunos (nome, cpf, data_nascimento, telefone, plano_id) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;
        const values = [nome, cpf, data_nascimento, telefone, plano_id];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);
    } catch (error) { // CORREÇÃO 9: Declarar o (error)
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
    }
});

// router.get('/usuarios', async (res, req) => {
//     try {
//         const resultado = await pool.query('SELECT * FROM usu')
//     }
// });

router.get('/planos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM planos WHERE ativo = true ORDER BY valor_mensal ASC');
        res.json(resultado.rows);
    } catch (error){
        console.error(error);
        res.status(500).json({erro : 'Erro ao buscar planos!'});
    }
});

router.post('/planos', async(req, res) =>{
    const {nome, valor_mensal, qtde_aulas_mensal} = req.body;
    try{
        const query = 'INSERT into planos (nome, valor_mensal, qtde_aulas_semana, ativo VALUES ($1, $2, $3, $4) RETURNING *';
        const resultado = await pool.query(query, [nome, valor_mensal, qtde_aulas_semana]);
        res.status(201).json(resultado.rows[0]);
    } catch(error){
        res.status(500).json({erro: 'Erro ao tentar criar novo plano!'})
    }
});

module.exports = router;