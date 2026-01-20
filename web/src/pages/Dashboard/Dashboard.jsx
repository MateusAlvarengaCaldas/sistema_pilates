import { useState } from 'react';
import './Dashboard.css';
import LogoPilates from '../../components/LogoPilates'; // Reutilizando sua logo

// Importe suas telas aqui
import GerenciarAlunos from '../Alunos/GerenciarAlunos';
// import CadastroPlanos from './CadastroPlanos'; (Exemplo futuro)

function Dashboard({ onLogout }) {
    // Estado para controlar qual tela está visível. Começa 'home' (vazia)
    const [paginaAtual, setPaginaAtual] = useState('home');

    // Função que decide o que renderizar na direita
    const renderizarConteudo = () => {
        switch (paginaAtual) {
            case 'alunos':
                return <GerenciarAlunos />; 
            case 'planos':
                return <div style={{padding: 20}}><h2>Tela de Planos (Em breve...)</h2></div>;
            case 'turmas':
                return <div style={{padding: 20}}><h2>Gestão de Turmas (Em breve...)</h2></div>;
            case 'financeiro':
                 return <div style={{padding: 20}}><h2>Financeiro (Em breve...)</h2></div>;
            case 'home':
            default:
                return (
                    <div className="welcome-screen">
                        {/* Versão cinza da logo para o fundo */}
                        <div style={{ opacity: 0.2, transform: 'scale(1.5)', marginBottom: '20px' }}>
                            <LogoPilates /> 
                        </div>
                        <h1>Bem-vindo ao Studio </h1>
                        <p>Selecione uma opção no menu lateral para começar.</p>
                    </div>
                );
        }
    };

    return (
        <div className="dashboard-container">
            
            {/* --- BARRA LATERAL --- */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    {/* Diminuí um pouco a logo para caber na barra */}
                    <div style={{ transform: 'scale(0.8)' }}>
                        <LogoPilates />
                    </div>
                    <span className="sidebar-title">Painel Admin</span>
                </div>

                <nav className="sidebar-menu">
                    <button 
                        className={`menu-btn ${paginaAtual === 'home' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('home')}
                    >
                        🏠 Início
                    </button>

                    <button 
                        className={`menu-btn ${paginaAtual === 'alunos' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('alunos')}
                    >
                        🧘‍♀️ Alunos
                    </button>

                    <button 
                        className={`menu-btn ${paginaAtual === 'planos' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('planos')}
                    >
                        📝 Planos
                    </button>

                    <button 
                        className={`menu-btn ${paginaAtual === 'turmas' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('turmas')}
                    >
                        📅 Agenda / Turmas
                    </button>

                     <button 
                        className={`menu-btn ${paginaAtual === 'financeiro' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('financeiro')}
                    >
                        💰 Financeiro
                    </button>
                </nav>

                <button className="menu-btn btn-logout" onClick={onLogout}>
                    🚪 Sair do Sistema
                </button>
            </aside>

            {/* --- CONTEÚDO DA DIREITA --- */}
            <main className="content-area">
                {renderizarConteudo()}
            </main>

        </div>
    );
}

export default Dashboard;