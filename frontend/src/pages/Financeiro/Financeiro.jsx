import React from "react";
import { TrendingUp, Calendar } from 'lucide-react';
import './Financeiro.css';

const Financeiro = () => {
    return (
        <div className="financeiro-container">
            
            {/* CABEÇALHO DA PÁGINA */}
            <div className="financeiro-header">
                <h2>Controle De Comissões</h2>
            </div>

            {/* ÁREA DOS CARDS */}
            <div className="resumo-cards">
                
                {/* CARD DE COMISSÕES */}
                <div className="card-resumo receitas">
                    <div className="card-icone">
                        <TrendingUp size={24} />
                    </div>
                    
                    <div className="card-conteudo" style={{ width: '100%' }}>
                        <p className="comissao-titulo">
                            Filtros
                        </p>
                        
                        {/* AQUI ESTÁ A MÁGICA DO ALINHAMENTO */}
                        <div className="filtros-grid">
                            
                            <div className="filtro-item">
                                <label htmlFor="professor" className="label-moderna">Professor:</label>
                                <select name="professores" id="professor" className="input-moderno">
                                    <option value="">Todos...</option>
                                    <option value="teste">Professor Teste</option>
                                </select>
                            </div>

                            <div className="filtro-item">
                                <label htmlFor="aluno" className="label-moderna">Aluno:</label>
                                <select name="alunos" id="aluno" className="input-moderno">
                                    <option value="">Todos...</option>
                                    <option value="teste">Aluno Teste</option>
                                </select>
                            </div>

                            <div className="filtro-item">
                                <label htmlFor="mes" className="label-moderna">Mês de Referência:</label>
                                <input type="month" id="mes" className="input-moderno" />
                            </div>

                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
};

export default Financeiro;