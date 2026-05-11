import React from "react";
import { TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { useComissoes } from "./Financeiro-js/useComissaoFinanceiro"; 
import './Financeiro.css';

const Financeiro = () => {
    // "CHAMA" A NOSSA INTELIGÊNCIA:
    const {
        comissoesFiltradas,
        professoresParaFiltro,
        alunosParaFiltro,
        totalComissoes,
        loading,
        erro,
        filtroProfessor, setFiltroProfessor,
        filtroAluno, setFiltroAluno,
        filtroMes, setFiltroMes
    } = useComissoes();

    // TELAS DE ESPERA E ERRO
    if (loading) return <div className="financeiro-container" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Loader className="spin" /> Carregando dados...</div>;
    if (erro) return <div className="financeiro-container"><AlertCircle color="red" /> {erro}</div>;

    return (
        <div className="financeiro-container">
            
            <div className="financeiro-header">
                <h2>Controle De Comissões</h2>
            </div>

            <div className="resumo-cards">
                <div className="card-resumo receitas">
                    <div className="card-icone">
                        <TrendingUp size={24} />
                    </div>
                    
                    <div className="card-conteudo" style={{ width: '100%' }}>
                        <p className="comissao-titulo">Filtros</p>
                        
                        <div className="filtros-grid">
                            <div className="filtro-item">
                                <label htmlFor="professor" className="label-moderna">Professor:</label>
                                <select 
                                    className="input-moderno"
                                    value={filtroProfessor}
                                    onChange={(e) => setFiltroProfessor(e.target.value)}
                                >
                                    <option value="">Todos...</option>
                                    {professoresParaFiltro.map((prof, idx) => (
                                        <option key={`prof-${idx}`} value={prof}>{prof}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-item">
                                <label htmlFor="aluno" className="label-moderna">Aluno:</label>
                                <select 
                                    className="input-moderno"
                                    value={filtroAluno}
                                    onChange={(e) => setFiltroAluno(e.target.value)}
                                >
                                    <option value="">Todos...</option>
                                    {alunosParaFiltro.map((aluno, idx) => (
                                        <option key={`aluno-${idx}`} value={aluno}>{aluno}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filtro-item">
                                <label htmlFor="mes" className="label-moderna">Mês de Referência:</label>
                                <input 
                                    type="month" 
                                    className="input-moderno" 
                                    value={filtroMes}
                                    onChange={(e) => setFiltroMes(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabela-container">
                <h3 className="tabela-titulo">Relatório de Comissões</h3>
                
                <div className="tabela-responsiva">
                    <table className="tabela-moderna">
                        <thead>
                            <tr>
                                <th>Data Pgto</th>
                                <th>Professor</th>
                                <th>Aluno</th>
                                <th>Plano</th>
                                <th>Mensalidade</th>
                                <th>Taxa (%)</th>
                                <th>Comissão</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comissoesFiltradas.length > 0 ? (
                                comissoesFiltradas.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.data}</td>
                                        <td>{item.professor}</td>
                                        <td><strong>{item.aluno}</strong></td>
                                        <td>{item.plano}</td>
                                        <td>R$ {Number(item.valorPlano).toFixed(2).replace('.', ',')}</td>
                                        <td>{item.taxa}%</td>
                                        <td className="valor-destaque">
                                            R$ {Number(item.comissao).toFixed(2).replace('.', ',')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                                        Nenhuma comissão encontrada para estes filtros.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="6" className="tabela-rodape-texto">Total a Pagar:</td>
                                <td className="tabela-rodape-valor">R$ {totalComissoes.toFixed(2).replace('.', ',')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Financeiro;