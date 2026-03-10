import { useState } from 'react';
import './Dashboard.css';
import LogoPilates from '../../components/LogoPilates';
import GerenciarPlanos from '../ListaPlanos/GerenciarPlanos';
import Agenda from '../agenda/agenda';

// --- IMPORTANTE: Importar o arquivo que criamos/arrumamos ---
import ListaAlunos from '../Alunos/ListaAlunos'; // <--- Ajuste o caminho se necessário!
// import GerenciarPlanos from '../Planos/GerenciarPlanos'; // Descomente quando criar essa tela
import GerenciarAlunos from '../Alunos/GerenciarAlunos';

function Dashboard({ onLogout }) {
    const [paginaAtual, setPaginaAtual] = useState('home');

    const renderizarConteudo = () => {
        switch (paginaAtual) {
            case 'alunos':
                // Aqui chamamos o componente que importamos lá em cima
                return <GerenciarAlunos />; 
            
            case 'planos':
                // return <GerenciarPlanos />; // Ainda não temos essa, deixe comentado ou faça uma div temporária
                return <GerenciarPlanos />;
            
            case 'turmas':
                return <Agenda/>;
            
            case 'financeiro':
                 return <div style={{padding: 20}}><h2>Financeiro (Em breve...)</h2></div>;
            
            case 'home':
            default:
                return (
                    <div className="welcome-screen">
                        <div style={{ opacity: 0.2, transform: 'scale(1.5)', marginBottom: '20px' }}>
                            <LogoPilates /> 
                        </div>
                        <h1>Bem-vindo ao Studio</h1>
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
                        📅 Agenda
                    </button>

                     <button 
                        className={`menu-btn ${paginaAtual === 'financeiro' ? 'active' : ''}`}
                        onClick={() => setPaginaAtual('financeiro')}
                    >
                        💰 Financeiro
                    </button>
                </nav>

                <button className="menu-btn btn-logout" onClick={onLogout}>
                    🚪 Sair
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