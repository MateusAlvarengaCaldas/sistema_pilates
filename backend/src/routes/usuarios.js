const express = require('express');
const router = express.Router();
const pool = require('../db'); // Importa a conexão com o banco

// =========================================
// ROTA DE LOGIN
// =========================================
router.post('/login', async (req, res) => {
    console.log("✅ TENTATIVA DE LOGIN RECEBIDA");
    const { email, senha } = req.body;

    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const resultado = await pool.query(query, [email]);
        const usuario = resultado.rows[0];

        // 1. Verifica se o usuário existe e se a senha bate
        if (!usuario || usuario.senha !== senha) {
            return res.status(401).json({ erro: 'Email ou senha incorretos' });
        }

        // 2. Verifica se o cadastro foi aprovado pelo Admin
        if (usuario.aprovado !== true) {
            return res.status(403).json({ erro: 'Seu cadastro ainda está em análise pelo Admin.' });
        }

        // Sucesso
        res.json({ 
            mensagem: 'Login aceito', 
            usuario: { 
                id: usuario.id, 
                nome: usuario.nome, 
                email: usuario.email,
                tipo: usuario.tipo 
            } 
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ erro: 'Erro interno no servidor' });
    }
});

// =========================================
// ROTA DE REGISTRO
// =========================================
router.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const tipo = 'professor'; // Padrão

    try {
        const query = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES($1, $2, $3, $4) RETURNING id, nome, email, aprovado';
        const resultado = await pool.query(query, [nome, email, senha, tipo]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Erro no registro:", error);
        
        // Código de erro do Postgres para "Email duplicado"
        if (error.code === '23505') {
            return res.status(400).json({ erro: 'Email já cadastrado!' });
        }
        res.status(500).json({ erro: 'Erro ao tentar cadastrar usuário!' });
    }
});

// =========================================
// LISTAR PROFESSORES (Para o Select do Cadastro)
// =========================================
// OBS: Mantivemos '/usuarios' aqui porque no index.js vamos carregar este arquivo na raiz '/'
router.get('/usuarios', async (req, res) => {
    try {
        const query = `
            SELECT id, nome, email, tipo, aprovado 
            FROM usuarios 
            WHERE tipo = 'professor' 
            ORDER BY nome
        `;
        
        const resultado = await pool.query(query);
        res.json(resultado.rows);

    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ erro: 'Erro ao buscar lista de usuários' });
    }
});

module.exports = router;