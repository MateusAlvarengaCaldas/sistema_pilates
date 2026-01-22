import { useState } from 'react';
// import CadastroAluno from './CadastroAluno';
import ListaAlunos from './ListaPlanos';

function GerenciarAlunos() {
    // Estado para controlar a aba ativa: 'lista' ou 'cadastro'
    const [abaAtiva, setAbaAtiva] = useState('lista');

    return (
        <div style={{ padding: '20px' }}>
            
            {/* Cabeçalho com Título e Botões de Aba */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Gestão de Alunos</h2>
                
                {/* Botões das Abas */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={() => setAbaAtiva('lista')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            background: abaAtiva === 'lista' ? '#00a896' : '#eee',
                            color: abaAtiva === 'lista' ? 'white' : '#555',
                            fontWeight: 'bold'
                        }}
                    >
                        📋 Lista de Alunos
                    </button>
                    <button 
                        onClick={() => setAbaAtiva('cadastro')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '20px',
                            border: 'none',
                            cursor: 'pointer',
                            background: abaAtiva === 'cadastro' ? '#00a896' : '#eee',
                            color: abaAtiva === 'cadastro' ? 'white' : '#555',
                            fontWeight: 'bold'
                        }}
                    >
                        ➕ Novo Aluno
                    </button>
                </div>
            </div>

            {/* Área de Conteúdo (Card Branco) */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                {abaAtiva === 'lista' ? (
                    <ListaAlunos />
                ) : (
                    // Passamos uma função para quando salvar, voltar para a lista automaticamente
                    <CadastroAluno aoSalvar={() => setAbaAtiva('lista')} />
                )}
            </div>

        </div>
    );
}

export default GerenciarAlunos;