import { useEffect, useState } from 'react';
import './ListaAlunos.css';

function ListaAlunos() {
    
    const [alunos, setAlunos] = useState([]);


    async function alternarStatus(id, statusAtual) {
        const confirmar = confirm("Tem certeza que deseja alterar o status do aluno?");
        if(!confirmar){
            return;
        }
        const novoStatus = !statusAtual; 

        try {
            const resposta = await fetch(`http://localhost:3000/alunos/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resposta.ok) {
                console.log("Status atualizado!")
                const alunoAtualizado = await resposta.json();
                
                setAlunos(listaAtual => listaAtual.map(aluno => 
                aluno.id === id ? { ...aluno, ...alunoAtualizado } : aluno
                ));
                alert("✅ Status do aluno atualizado com sucesso!");
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
                                
                                
                                <td style={{ cursor: 'pointer' }} onClick={() => alternarStatus(aluno.id, (aluno.status || aluno.Status))}>
                                    <span className={(aluno.status || aluno.Status) ? "Status-ativo" : "Status-inativo"}>
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