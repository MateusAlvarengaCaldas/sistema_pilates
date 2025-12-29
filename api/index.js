// console.log('--- DIAGNÓSTICO ---');
// console.log('Estou rodando na pasta:', process.cwd());
// const fs = require('fs');
// try {
//     const arquivos = fs.readdirSync('.');
//     console.log('Arquivos que eu vejo aqui:', arquivos);
// } catch (e) {
//     console.log('Erro ao ler pasta');
// }
// console.log('-------------------');

// ... aqui continua seu require('dotenv')...

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(cors()); // <--- AQUI ERA O ERRO (Corrigido)

// Configuração do Banco
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- O QUE FALTAVA (O Teste e o Start) ---

// 1. Rota de teste (pra ver no navegador)
app.get('/', (req, res) => {
    res.send('API do Studio de Pilates está rodando!');
});

// 2. Testar conexão com o banco (pra ver no terminal)
pool.connect((err) => {
    if (err) {
        console.error('ERRO ao conectar no banco:', err);
    } else {
        console.log('SUCESSO: Conectado ao Banco de Dados!');
    }
});

// 3. Ligar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});