const express = require('express');
const cors = require('cors');
const app = express();


const rotasAlunos = require('./routes/alunos');
const rotasPlanos = require('./routes/planos');
const rotasUsuarios = require('./routes/usuarios');


app.use(express.json());
app.use(cors());

// app.use((req, res, next)=>{
//     console.log(`requisicoes: ${req.method} ${req.url}`);

//     next();
// });

// --- CONFIGURAÇÃO DAS ROTAS ---

// 1. Alunos
app.use('/alunos', rotasAlunos);

// 2. Planos
app.use('/planos', rotasPlanos);

// 3. Usuários/Auth
app.use('/', rotasUsuarios);

// Rota de teste
app.get('/', (req, res) => {
    res.send('🚀 Servidor Studio Pilates Flow rodando!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando na porta ${PORT}`);
});