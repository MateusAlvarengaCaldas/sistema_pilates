const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configuração do Banco de Dados
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// =========================================
// ROTA DE LOGIN (Autenticação)
// =========================================
router.post('/login', async (req, res) => {
    console.log("✅ TENTATIVA DE LOGIN RECEBIDA");
    const { email, senha } = req.body;

    try {
        // Busca o usuário pelo email (aqui precisamos da senha para conferir)
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

        // Sucesso: Retorna dados básicos (sem a senha)
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
// ROTA DE REGISTRO (Criar Conta)
// =========================================
router.post('/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    const tipo = 'professor'; // Padrão para novos cadastros

    try {
        const query = 'INSERT INTO usuarios (nome, email, senha, tipo) VALUES($1, $2, $3, $4) RETURNING id, nome, email, aprovado';
        const resultado = await pool.query(query, [nome, email, senha, tipo]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Erro no registro:", error);
        // Código de erro do Postgres para "Violação de Unicidade" (Email duplicado)
        if (error.code === '23505') {
            return res.status(400).json({ erro: 'Email já cadastrado!' });
        }
        res.status(500).json({ erro: 'Erro ao tentar cadastrar usuário!' });
    }
});

// =========================================
// ROTA DE LISTAR USUÁRIOS 
// =========================================
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

// =========================================
// ROTAS DE ALUNOS (CORRIGIDA)
// =========================================
router.get('/alunos', async (req, res) => {
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

router.post('/alunos', async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, plano_id, professor_id} = req.body;

    try {
        const query = `
            INSERT INTO alunos (nome, cpf, data_nascimento, telefone, plano_id, professor_id) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        const values = [nome, cpf, data_nascimento, telefone, plano_id, professor_id];

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        res.status(500).json({ erro: 'Erro ao cadastrar aluno.' });
    }
});

// =========================================
// ROTAS DE PLANOS
// =========================================
router.get('/planos', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM planos WHERE ativo = true ORDER BY valor_mensal ASC');
        res.json(resultado.rows);
    } catch (error){
        console.error("Erro ao buscar planos:", error);
        res.status(500).json({erro : 'Erro ao buscar planos!'});
    }
});

// =========================================
// ROTA DE REGISTRO (Planos)
// =========================================
router.post('/planos', async(req, res) =>{

    const { nome, valor_mensal, qtde_aulas_semana, ativo } = req.body;
    
    // Se 'ativo' não for enviado, define como true
    const statusAtivo = (ativo !== undefined) ? ativo : true;

    try{
        // CORRIGIDO: Adicionado parêntese que faltava antes do VALUES
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

// =========================================
// ROTA DE Atualização de alunos (Ativar/ inativar)
// =========================================

router.put('/alunos/:id/status', async (req, res) => {
    const { id } = req.params;   // Pega o ID da URL (ex: /alunos/5/status)
    const { status } = req.body; // Pega o novo status (true ou false) do corpo

    try {
        // Atualiza a coluna "Status" apenas onde o id for igual ao informado
        // O $1 e $2 são preenchidos pelas variáveis no array logo depois
        const query = `UPDATE alunos SET "Status" = $1 WHERE id = $2`;
        
        await pool.query(query, [status, id]);

        res.status(200).json({ message: "Status atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        res.status(500).json({ erro: 'Erro ao atualizar status' });
    }
});

module.exports = router;