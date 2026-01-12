require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // Importando o arquivo de rotas

const app = express();

app.use(express.json());
app.use(cors());

// --- ESPIÃO (Middleware de Log) ---
// Isso vai mostrar no terminal QUALQUER pedido que chegar
app.use((req, res, next) => {
    console.log(`👀 RECEBI UM PEDIDO: ${req.method} na rota ${req.url}`);
    next(); // Passa para o próximo passo
});

// Usando as rotas
app.use('/', routes);

const port = 3000;
// O '0.0.0.0' é o segredo aqui 👇
app.listen(port, '0.0.0.0', () => {
    console.log(`🔥 Servidor rodando na porta ${port}`);
    console.log(`🌐 Acesse por: http://127.0.0.1:${port}/login`);
});