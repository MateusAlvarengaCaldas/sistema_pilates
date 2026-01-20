import { useEffect, useState } from 'react';
import './ListaAlunos.css';

function ListaAlunos() {
    // 1. O useState cria as variáveis AQUI dentro
    const [alunos, setAlunos] = useState([]);

    // 2. A função alternarStatus precisa estar AQUI dentro para enxergar o 'setAlunos'
    async function alternarStatus(id, statusAtual) {
        const novoStatus = !statusAtual; 

        try {
            const resposta = await fetch(`http://localhost:3000/alunos/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resposta.ok) {
                // Agora o setAlunos funciona!
                setAlunos(prevAlunos => prevAlunos.map(aluno =>
                    aluno.id === id ? { ...aluno, status: novoStatus, Status: novoStatus } : aluno
                ));
            } else {
                alert("Erro ao atualizar status");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }

    useEffect(() => {
        fetch('http://localhost:3000/alunos')
            .then(res => res.json())
            .then(data => setAlunos(data))
            .catch(err => console.error("Erro:", err));
    }, []);

    return (
        <div className="lista-container">
            {alunos.length === 0 ? (
                <p className="lista-vazia">Nenhum aluno cadastrado ainda.</p>
            ) : (
                <table className="tabela-alunos">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Plano</th>
                            <th>Professor</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alunos.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>
                                    <strong>{aluno.nome}</strong><br />
                                    <span className="cpf-mini">{aluno.cpf}</span>
                                </td>
                                <td>{aluno.telefone}</td>
                                <td>
                                    <span className="badge-plano">{aluno.nome_plano || '-'}</span>
                                </td>
                                <td>{aluno.nome_professor || '-'}</td>
                                
                                {/* A chamada da função agora vai funcionar */}
                                <td style={{ cursor: 'pointer' }} onClick={() => alternarStatus(aluno.id, (aluno.status || aluno.Status))}>
                                    <span className={(aluno.status || aluno.Status) ? "status-ativo" : "status-inativo"}>
                                        {(aluno.status || aluno.Status) ? "Ativo" : "Inativo"}
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

export default ListaAlunos;