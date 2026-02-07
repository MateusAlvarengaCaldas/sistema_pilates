import { useEffect, useState } from 'react';
import './ListaPlanos.css'; 
import Swal from 'sweetalert2'; // Agora isso funciona!

function ListaPlanos() {
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(true); // Adicionei loading para não mostrar "Nenhum plano" antes da hora

    // --- CARREGAMENTO INICIAL ---
    useEffect(() => {
        carregarPlanos();
    }, []);

    async function carregarPlanos() {
        const token = localStorage.getItem('token'); // 1. PEGA O TOKEN

        try {
            const res = await fetch('http://localhost:3000/planos', {
                // 2. ENVIA O TOKEN (Sem isso, o backend devolve erro 401 ou 403)
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
        const token = localStorage.getItem('token'); // Token aqui também

        try {
            // Essa rota bate com a que criamos no backend: router.put('/:id/ativo')
            const resposta = await fetch(`http://localhost:3000/planos/${id}/ativo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ativo: novoStatus })
            });

            if (resposta.ok) {
                // Atualiza visualmente
                setPlanos(listaAtual => listaAtual.map(plano =>
                    plano.id === id ? { ...plano, ativo: novoStatus } : plano
                ));
                Swal.fire(
                    'Atualizado!',
                    'O status do plano foi alterado.',
                    'success'
                );
            } else {
                Swal.fire("Erro ao atualizar plano");
            }
        } catch (error) {
            console.error("Erro:", error);
            Swal.fire("Erro:", error);
        }
    }

    return (
        <div className="lista-container">
            {loading ? (
                <p>Carregando planos...</p>
            ) : planos.length === 0 ? (
                <div className="lista-vazia">
                    <p>Nenhum plano cadastrado.</p>
                </div>
            ) : (
                <table className="tabela-alunos"> {/* Pode manter essa classe se importou o CSS */}
                    <thead>
                        <tr>
                            <th>Nome do Plano</th>
                            <th>Valor Mensal</th>
                            <th>Aulas/Semana</th>
                            <th style={{textAlign: 'center'}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planos.map((plano) => (
                            <tr key={plano.id}>
                                <td>
                                    <strong>{plano.nome}</strong>
                                </td>
                                
                                <td style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                    {/* Formatação segura para evitar erro se valor vier nulo */}
                                    R$ {Number(plano.valor_mensal || 0).toFixed(2).replace('.', ',')}
                                </td>
                                
                                <td style={{ textAlign: 'center' }}>
                                    {plano.qtde_aulas_semana}
                                </td>

                                <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => alternarStatus(plano.id, plano.ativo)}>
                                    {/* DICA: Verifique se no CSS as classes são "status-ativo" (minúsculo)
                                        ou "Status-ativo" (maiúsculo igual Alunos). Ajustei para minúsculo aqui.
                                    */}
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