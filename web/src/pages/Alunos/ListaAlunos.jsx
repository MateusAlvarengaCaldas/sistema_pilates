import { useEffect, useState } from 'react';
import './ListaAlunos.css'; // Vamos criar esse CSS no passo 2

function ListaAlunos() {
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        // Busca os alunos na rota que criamos com JOIN (traz nome do plano e professor)
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
                                    <strong>{aluno.nome}</strong><br/>
                                    <span className="cpf-mini">{aluno.cpf}</span>
                                </td>
                                <td>{aluno.telefone}</td>
                                <td>
                                    <span className="badge-plano">{aluno.nome_plano || '-'}</span>
                                </td>
                                <td>{aluno.nome_professor || '-'}</td>
                                <td>
                                <span className={aluno.Status ? "Status-ativo" : "Status-inativo"}>
                                    {aluno.Status ? "Ativo" : "Inativo"}
                                </span>
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