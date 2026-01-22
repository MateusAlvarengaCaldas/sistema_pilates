# 🧘‍♀️ Studio Pilates Flow

> Sistema completo de gestão para estúdios de Pilates, focado no controle de alunos, planos de aula e automação financeira de comissões.

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-orange)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![Postgres](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 📋 Sobre o Projeto

O **Studio Pilates Flow** é uma aplicação Full Stack desenvolvida para resolver a desconexão entre a gestão de alunos e o controle financeiro em estúdios de Pilates. O sistema centraliza o cadastro de matrículas, gerencia o status dos alunos em tempo real e calcula automaticamente a comissão dos professores com base nas mensalidades ativas.

### 🚀 Principais Funcionalidades

* **Autenticação e Segurança:** Login com validação de credenciais e status de aprovação do professor.
* **Gestão de Alunos (CRUD):** Cadastro completo, listagem com junção de dados (Planos/Professores) e alteração rápida de status (Ativo/Inativo).
* **Dashboard Interativo:** Navegação SPA (Single Page Application) com renderização condicional de componentes.
* **Automação Financeira:** Algoritmo que calcula comissões personalizadas por professor, considerando apenas alunos ativos no mês.
* **Integridade de Dados:** Uso de UUIDs e Chaves Estrangeiras (Foreign Keys) para garantir consistência no banco de dados.

---

## 🛠️ Tecnologias Utilizadas

O projeto segue uma arquitetura modular, separando responsabilidades entre Cliente, Servidor e Banco de Dados.

### Front-end
* **React.js (Vite):** Para construção de uma interface rápida e reativa.
* **Hooks Personalizados:** Uso de `useState` e `useEffect` para gerenciamento de estado e ciclo de vida.
* **CSS Modules:** Estilização componentizada para evitar conflitos visuais.
* **Fetch API:** Camada de serviço para comunicação assíncrona com o Backend.

### Back-end
* **Node.js & Express:** API RESTful.
* **PostgreSQL:** Banco de dados relacional.
* **node-postgres (pg):** Driver de conexão otimizado.
* **Middleware Personalizado:** Logs de requisições e tratamento de erros.

---

## 🗄️ Modelagem do Banco de Dados

O sistema utiliza PostgreSQL. Abaixo, a estrutura das principais tabelas:

```sql
-- Tabela de Usuários (Professores e Admins)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) DEFAULT 'professor',
    comissao NUMERIC(5,2) DEFAULT 30.00, -- % de comissão
    aprovado BOOLEAN DEFAULT false
);

-- Tabela de Planos
CREATE TABLE planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    valor_mensal NUMERIC(10,2) NOT NULL,
    qtde_aulas_semana INTEGER,
    ativo BOOLEAN DEFAULT true
);

-- Tabela de Alunos
CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14),
    telefone VARCHAR(20),
    data_nascimento DATE,
    professor_id UUID REFERENCES usuarios(id),
    plano_id INTEGER REFERENCES planos(id),
    "Status" BOOLEAN DEFAULT true
);




Como Executar o Projeto
Pré-requisitos
Node.js (v14+)

PostgreSQL instalado e rodando

# Clone o repositório
git clone [https://github.com/SEU-USUARIO/studio-pilates-flow.git](https://github.com/SEU-USUARIO/studio-pilates-flow.git)

# Entre na pasta do servidor
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz com suas configurações
# Exemplo: DATABASE_URL=postgres://user:senha@localhost:5432/pilatesdb

# Inicie o servidor
node index.js

O servidor rodará em: http://localhost:3000




2. Configuração do Front-end

# Em outro terminal, entre na pasta do front
cd frontend

# Instale as dependências
npm install

# Inicie o React
npm run dev



Documentação da API
Principais rotas disponíveis na API:

Método,Endpoint,Descrição
POST,/login,Autentica o usuário no sistema.
GET,/alunos,Lista alunos com dados populados (LEFT JOIN).
POST,/alunos,Cadastra um novo aluno.
PUT,/alunos/:id/status,Alterna status (Ativo/Inativo).
GET,/financeiro/comissoes,Relatório de faturamento por professor.
GET,/planos,Lista os planos de aula disponíveis.



Estrutura de Pastas
src/
├── assets/          # Recursos estáticos (Imagens, CSS global)
├── components/      # Componentes reutilizáveis (Logo, Botões)
├── pages/           # Páginas da Aplicação
│   ├── Login/       # Tela de Acesso
│   ├── Dashboard/   # Layout Principal (Sidebar + Conteúdo)
│   ├── Alunos/      # Listagem e Cadastro de Alunos
│   └── Financeiro/  # Relatórios de Comissão
├── services/        # Configuração de chamadas à API
└── App.jsx          # Controle de Rotas e Sessão