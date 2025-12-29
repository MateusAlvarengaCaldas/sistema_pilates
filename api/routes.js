const express = require('express');
const router = express.Router();
const {Pool} = require('pg');

const pool = new Pool({
    connectionString : process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
});

router.post('/alunos', async(req, res)=>{
    const {email, senha} = req.body;
    try{
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const resultado = await pool.query(query, [email]);

        const usuario = usuario.rows[0];

    if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }
    if(usuario.aprovado !== TRUE){
        return res.status(403).json({erro: 'Seu cadastro ainda está em análise pelo Admin.'});
    }
    res.json({ mensagem: 'Login aceito', usuario: { email: usuario.email, id: usuario.id } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro interno' });
    }
});

router.post('/alunos', async(req, res)=> {
    const {email, senha} = req.body;
    try{
        const query = 'INSERT INTO usuarios (email, senha) VALUES($1, $2) RETUNING ID, email, aprovado';
        const resultado = await pool.query[query, (email, senha)];

        res.status(201).json(resultado.rows[0])
    } catch(error){
        console.log(error)
        //CÓDIGO DE DUPLICIDADE
        if(error.code === '23505'){
            return res.resultado(400).json{erro:'Email já cadastrado!'}
        }
        res.status(500).json({erro: 'Erro ao tentar cadastrar um usuário!'})
    }
});

//Listando alunos

router.get('/alunos', async(req, res)=>{
    try{
        const resultado = await pool.query("SELECT * FROM alunos ORDER BY nome");
        res.json(resultado.rows)
    } catch (error){
        console.error(error);
        res.status(500).json({erro: 'Erro ao buscar alunos'});
    }
})

//Cadastrar alunos

router.post('/aluno', async (req, res) =>{
    const  {nome, cpf, data_nascimento, telefone} = res.body;

    try {
        const query = 'INSERT INTO alunos (nome, cpf, data_nascimento, telefone)'
        const values = [nome, cpf, data_nascimento, telefone]

        const resultado = await pool.query(query, values);
        res.status(201).json(resultado.rows[0]);
    } catch{
        console.error(error);
        res.status(500).json({ erro: 'Erro ao cadastrar aluno.'});
    }
});

module.exports = router;