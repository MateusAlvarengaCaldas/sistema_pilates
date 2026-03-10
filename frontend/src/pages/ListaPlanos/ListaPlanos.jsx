import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useFiltro } from '../../hooks/useFiltro'; // Import do Hook
import './ListaPlanos.css'; 

function ListaPlanos() {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true);

    //Passamos 'planos' e filtramos pelo 'nome'
    const { termoBusca, setTermoBusca, itensFiltrados } = useFiltro(planos, ['nome']);

    // --- CARREGAMENTO INICIAL ---
    useEffect(() => {
        carregarPlanos();
    }, []);

    async function carregarPlanos() {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/planos', {
                headers: { 'Authorization': `Bearer ${token}` } 
            });

            if(res.ok) {
                const data = await res.json();
                setPlanos(data);
            } else {
                console.error("Erro ao buscar planos");
            }
        } catch (err) {
            console.error("Erro de conexão:", err);
        } finally {
            setLoading(false);
        }
    }

    // --- ALTERAR STATUS ---
    async function alternarStatus(id, statusAtual) {
        const resultado = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você deseja alterar o status deste plano?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, alterar!',
            cancelButtonText: 'Cancelar'
        });

        if (!resultado.isConfirmed) return;

        const novoStatus = !statusAtual;
        const token = localStorage.getItem('token');

        try {
            const resposta = await fetch(`http://localhost:3000/planos/${id}/ativo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ativo: novoStatus })
            });

            if (resposta.ok) {
                setPlanos(listaAtual => listaAtual.map(plano =>
                    plano.id === id ? { ...plano, ativo: novoStatus } : plano
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

    return (
        <div className="lista-container">
            {/* 2. CABEÇALHO COM BUSCA (Igual ao de Alunos) */}
            <div className="header-page" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', color:"black"}}>
                <h2>Gerenciar Planos</h2>
                
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Buscar plano..." 
                        className='pesquisa-planos'
                        value={termoBusca} 
                        onChange={(e) => setTermoBusca(e.target.value)} 
                    />
                </div>
            </div>

            {/* 3. LÓGICA DE EXIBIÇÃO */}
            {loading ? (
                <p>Carregando planos...</p>
            ) : itensFiltrados.length === 0 ? (
                <div className="lista-vazia">
                    {termoBusca 
                        ? <p>Nenhum plano encontrado para "{termoBusca}"</p> 
                        : <p>Nenhum plano cadastrado.</p>
                    }
                </div>
            ) : (
                <table className="tabela-alunos">
                    <thead>
                        <tr>
                            <th>Nome do Plano</th>
                            <th>Valor Mensal</th>
                            <th>Aulas/Semana</th>
                            <th style={{textAlign: 'center'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 4. O PULO DO GATO: Map em 'itensFiltrados' */}
                        {itensFiltrados.map((plano) => (
                            <tr key={plano.id}>
                                <td><strong>{plano.nome}</strong></td>
                                
                                <td style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                    R$ {Number(plano.valor_mensal || 0).toFixed(2).replace('.', ',')}
                                </td>
                                
                                <td style={{ textAlign: 'center' }}>{plano.qtde_aulas_semana}</td>

                                <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => alternarStatus(plano.id, plano.ativo)}>
                                    <span className={plano.ativo ? "status-ativo" : "status-inativo"}>
                                        {plano.ativo ? "Ativo" : "Inativo"}
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

export default ListaPlanos;