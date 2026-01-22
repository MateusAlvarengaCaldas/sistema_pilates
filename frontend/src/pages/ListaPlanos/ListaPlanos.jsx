import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; // Opcional: Se já instalou o SweetAlert
import './ListaAlunos.css'; // Pode aproveitar o mesmo CSS por enquanto

function ListaPlanos() {
    const [planos, setPlanos] = useState([]);

    // Função para inativar/ativar planos
    async function alternarStatus(id, statusAtual) {
        // Se quiser usar o confirm nativo simples:
        if (!window.confirm("Deseja alterar o status deste plano?")) return;

        const novoStatus = !statusAtual;

        try {
            // ATENÇÃO: Você precisa garantir que essa rota existe no backend
            const resposta = await fetch(`http://localhost:3000/planos/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ativo: novoStatus })
            });

            if (resposta.ok) {
                // Atualiza a lista na tela
                setPlanos(listaAtual => listaAtual.map(plano => 
                    plano.id === id ? { ...plano, ativo: novoStatus } : plano
                ));
            } else {
                alert("Erro ao atualizar plano");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }

    useEffect(() => {
        fetch('http://localhost:3000/planos')
            .then(res => res.json())
            .then(data => setPlanos(data))
            .catch(err => console.error("Erro:", err));
    }, []);

    return (
        <div className="lista-container">
            {/* CORREÇÃO 1: Mudei de alunos.length para planos.length */}
            {planos.length === 0 ? (
                <p className="lista-vazia">Nenhum plano cadastrado.</p>
            ) : (
                <table className="tabela-alunos">
                    <thead>
                        <tr>
                            <th>Nome do Plano</th>
                            <th>Valor Mensal</th>
                            <th>Aulas/Semana</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* CORREÇÃO 2: Mudei para planos.map */}
                        {planos.map((plano) => (
                            <tr key={plano.id}>
                                <td>
                                    <strong>{plano.nome}</strong>
                                </td>
                                
                                {/* Formatação de Dinheiro */}
                                <td>
                                    R$ {Number(plano.valor_mensal).toFixed(2).replace('.', ',')}
                                </td>
                                
                                <td style={{ textAlign: 'center' }}>
                                    {plano.qtde_aulas_semana}
                                </td>

                                {/* Lógica de Status */}
                                <td style={{ cursor: 'pointer' }} onClick={() => alternarStatus(plano.id, plano.ativo)}>
                                    <span className={plano.ativo ? "status-ativo" : "status-inativo"}>
                                        {plano.ativo ? "Ativo" : "Inativo"}
                                    </span>
                                    <div style={{ fontSize: '10px', color: '#ccc', marginTop: '2px' }}>
                                        (Clique para alterar)
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ListaPlanos;