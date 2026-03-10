import { useEffect, useState } from 'react';
import { useFiltro } from '../../hooks/useFiltro'; // Import do seu Hook
import './ListaAlunos.css';
import Swal from 'sweetalert2';

function ListaAlunos() {
    
    const [alunos, setAlunos] = useState([]);

    

    // 1. CORREÇÃO: O nome correto é 'termoBusca' (igual tá no arquivo useFiltro.js)
    const { termoBusca, setTermoBusca, itensFiltrados } = useFiltro(alunos, ['nome', 'email']);

    // Função para mudar o status
    async function alternarStatus(id, statusAtual) {

        const resultado = await Swal.fire({
                    title: 'Tem certeza?',
                    text: "Você deseja alterar o status deste aluno?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, alterar!',
                    cancelButtonText: 'Cancelar'
                });
        // Dica: Use o Swal aqui depois se quiser, por enquanto mantive o native confirm
        
        if(!resultado.isConfirmed) return;
        
        const novoStatus = !statusAtual; 
        const token = localStorage.getItem('token'); 

        try {
            const resposta = await fetch(`http://localhost:3000/alunos/${id}/status`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: novoStatus })
            });

            if (resposta.ok) {
                // Atualiza a lista visualmente
                setAlunos(listaAtual => listaAtual.map(aluno => 
                    aluno.id === id ? { ...aluno, Status: novoStatus } : aluno
                ));
                Swal.fire('Atualizado!', 'Status alterado com sucesso.', 'success');
            } else {
                Swal.fire('Erro!', 'Erro ao atualizar plano.', 'error');
            }
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire('Erro!', 'Erro de conexão.', 'error');
        }
    }

    // Carregar a lista inicial
    useEffect(() => {
        const token = localStorage.getItem('token'); 

        if (!token) {
            Swal.fire("Você precisa fazer login!");
            window.location.href = '/'; 
            return;
        }

        fetch('http://localhost:3000/alunos', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setAlunos(data);
        })
        .catch(err => console.error("Erro ao carregar alunos:", err));
    }, []);
    

    return (
        <div className="lista-container">
            <div className="header-page" color='black'>
                <h2>Gerenciar Alunos</h2>
                
                {/* 2. CAMPO DE BUSCA */}
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou email..." 
                        className='pesquisa-alunos'
                        value={termoBusca} 
                        onChange={(e) => setTermoBusca(e.target.value)} 
                    />
                </div>
            </div>

            {/* 3. TABELA (USANDO A LISTA FILTRADA) */}
            {itensFiltrados.length === 0 ? (
                <div className="lista-vazia">
                    {/* Se tiver busca digitada, avisa que não achou nada */}
                    {termoBusca ? <p>Nenhum aluno encontrado para "{termoBusca}"</p> : <p>Carregando ou nenhum aluno cadastrado.</p>}
                </div>
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
                        {/* 4. O PULO DO GATO: Map em 'itensFiltrados', NÃO em 'alunos' */}
                        {itensFiltrados.map((aluno) => (
                            <tr key={aluno.id}>
                                <td>
                                    <strong>{aluno.nome}</strong><br />
                                    <span className="cpf-mini">{aluno.email}</span>
                                </td>
                                <td>{aluno.telefone}</td>
                                <td>
                                    <span className="badge-plano">{aluno.nome_plano || '-'}</span>
                                </td>
                                <td>
                                    <span className="badge-professor">{aluno.nome_professor || '-'}</span>
                                </td>
                                
                                <td style={{ cursor: 'pointer' }} onClick={() => alternarStatus(aluno.id, aluno.Status)}>
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