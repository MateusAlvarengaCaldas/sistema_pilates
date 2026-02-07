import { useState } from 'react';
import CadastroPlano from './CadastroPlano'; // Vamos garantir que esse arquivo existe
import ListaPlanos from './ListaPlanos';     // O arquivo que já temos (com ajustes)

function GerenciarPlanos() {
    const [abaAtiva, setAbaAtiva] = useState('lista');

    return (
        <div style={{ padding: '20px' }}>
            
            {/* Cabeçalho igual ao de Alunos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#333' }}>Gestão de Planos</h2>
                
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
                        📋 Lista de Planos
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
                        ➕ Novo Plano
                    </button>
                </div>
            </div>

            {/* Área de Conteúdo */}
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                {abaAtiva === 'lista' ? (
                    <ListaPlanos />
                ) : (
                    <CadastroPlano aoSalvar={() => setAbaAtiva('lista')} />
                )}
            </div>

        </div>
    );
}

export default GerenciarPlanos;