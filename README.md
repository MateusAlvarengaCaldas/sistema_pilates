# 🧘 Sistema de Gestão - Pilates Flow

Uma aplicação Full Stack desenvolvida para automatizar a gestão de alunos, organizar horários e calcular comissões em estúdios de saúde e bem-estar, eliminando furos e encavalamentos na agenda.

> 🚧 **Projeto em Desenvolvimento:** Este sistema é um laboratório de estudos práticos de Engenharia de Software.

### 📸 Demonstração
<img width="1890" height="855" alt="image" src="https://github.com/user-attachments/assets/48e0d020-9c20-4762-9f1d-7ba336659bbb" />

<img width="1887" height="852" alt="image" src="https://github.com/user-attachments/assets/dbacbb31-a4a6-40ae-86ea-8bbc7c453e3d" />


https://github.com/user-attachments/assets/8aad34a1-9a27-4a07-a26c-2ab5764f8eee


<video controls src="AGENDA.mp4" title="Title"></video>

---

## 🧠 Arquitetura e Regra de Negócio

O grande diferencial deste projeto é a separação clara entre a operação diária e o fechamento financeiro, garantindo integridade dos dados:

* **Fluxo Operacional (`historico_aulas`):** Gerencia a agenda, horários e presença. Toda aula é criada com o status padrão de "Pendente".
* **Fluxo Financeiro (`aulas`):** Focada no faturamento. O sistema é programado para que o cálculo de comissionamento do professor e a geração de valor só ocorram quando o status operacional da aula é atualizado para "Concluído".

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React, Axios.
* **Backend:** Node.js, Express.
* **Banco de Dados:** PostgreSQL.

---

## 🚀 Como Rodar o Projeto Localmente

**1. Clone este repositório:**
\`\`\`bash
git clone https://github.com/MateusAlvarengaCaldas
\`\`\`

**2. Iniciando o Backend (API):**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

**3. Iniciando o Frontend (Interface):**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---
*Desenvolvido com dedicação por Mateus Alvarenga.*
