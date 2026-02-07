import { useEffect, useState } from 'react';
import './ListaAlunos.css';

function ListaAlunos() {
    
    const [alunos, setAlunos] = useState([]);

    // Função para mudar o status (Ativo/Inativo)
    async function alternarStatus(id, statusAtual) {
        const confirmar = confirm("Tem certeza que deseja alterar o status do aluno?");
        if(!confirmar){
            return;
        }
        
        const novoStatus = !statusAtual; 
        const token = localStorage.getItem('token'); // <--- PEGA O TOKEN

        try {
            const resposta = await fetch(`http://localhost:3000/alunos/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- ENVIA O CRACHÁ
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resposta.ok) {
                const alunoAtualizado = await resposta.json();
                
                // Atualiza a lista visualmente sem precisar recarregar
                setAlunos(listaAtual => listaAtual.map(aluno => 
                    aluno.id === id ? { ...aluno, Status: novoStatus } : aluno
                ));
                alert("✅ Status atualizado com sucesso!");
            } else {
                alert("Erro ao atualizar status. Verifique se você está logado.");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    }

    // Carregar a lista ao abrir a página
    useEffect(() => {
        const token = localStorage.getItem('token'); // <--- PEGA O TOKEN

        if (!token) {
            alert("Você precisa fazer login!");
            window.location.href = '/'; // Manda pro login se não tiver token
            return;
        }

        fetch('http://localhost:3000/alunos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` // <--- O PULO DO GATO
            }
        })
        .then(res => {
            if (!res.ok) throw new Error('Falha ao buscar dados');
            return res.json();
        })
        .then(data => {
            console.log("Alunos carregados:", data); // Debug para ver se veio
            setAlunos(data);
        })
        .catch(err => console.error("Erro ao carregar alunos:", err));
    }, []);

    return (
        <div className="lista-container">
            <h2>Meus Alunos</h2>
            {alunos.length === 0 ? (
                <p className="lista-vazia">Nenhum aluno encontrado.</p>
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
                                    <span className="cpf-mini">{aluno.email}</span>
                                </td>
                                <td>{aluno.telefone}</td>
                                <td>
                                    {/* Ajuste aqui dependendo de como o backend manda o nome do plano */}
                                    <span className="badge-plano">{aluno.nome_plano || aluno.plano_id || '-'}</span>
                                </td>
                                <td>
                                    <span className="badge-professor">Prof.: {aluno.nome_professor || '-'}</span>
                                </td>
                                
                                <td style={{ cursor: 'pointer' }} onClick={() => alternarStatus(aluno.id, aluno.Status)}>
                                    {/* O backend geralmente retorna 'ativo' (true/false) e não 'status' */}
                                    <span className={aluno.Status ? "Status-ativo" : "Status-inativo"}>
                                        {aluno.Status ? "Ativo" : "Inativo"}
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