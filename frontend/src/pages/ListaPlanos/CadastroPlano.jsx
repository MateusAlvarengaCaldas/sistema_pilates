import { useState } from "react";
import './ListaPlanos.css';
import Swal from "sweetalert2";

function CadastroPlano({ aoSalvar }) {
    const [nome, setNome] = useState('');
    const [valor_mensal, setValorMensal] = useState('');
    const [qtde_aulas_semana, setQtdeAulasSemana] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        // 1. VALIDAÇÃO PRIMEIRO (Antes de perguntar qualquer coisa)
        if (!nome || !valor_mensal || !qtde_aulas_semana) {
            Swal.fire('Atenção', 'Preencha todos os campos!', 'warning');
            return;
        }

        // 2. AGORA SIM, PERGUNTA SE QUER SALVAR
        const resultado = await Swal.fire({
            title: 'Salvar Novo Plano?',
            text: `Confirmar criação do plano "${nome}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, salvar',
            cancelButtonText: 'Cancelar'
        });

        // 3. SE CLICOU EM CANCELAR, PARA TUDO
        if (!resultado.isConfirmed) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        // Tratamento para aceitar "150,00" (com vírgula)
        const valorFormatado = valor_mensal.toString().replace(',', '.');

        const dados = { 
            nome, 
            valor_mensal: parseFloat(valorFormatado), 
            qtde_aulas_semana: parseInt(qtde_aulas_semana),
            ativo: true 
        };

        try {
            const resp = await fetch('http://localhost:3000/planos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dados)
            });

            if (resp.ok) {
                // 4. CORREÇÃO DO ERRO FATAL: Chama Swal.fire de novo
                await Swal.fire('Sucesso!', 'Plano cadastrado corretamente.', 'success');
                
                if (aoSalvar) aoSalvar(); // Volta para a lista
            } else {
                const erro = await resp.json();
                Swal.fire('Erro', erro.message || 'Erro ao cadastrar', 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Erro', 'Falha na conexão com o servidor.', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="card-modern" style={{ maxWidth: '100%', margin: 0, boxShadow: 'none', border: '1px solid #eee' }}>
            <h3 style={{ marginBottom: '20px', color: '#444' }}>Novo Plano</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="modern-label">Nome do Plano</label>
                    <input 
                        type="text" 
                        className="modern-input" 
                        placeholder="Ex: Pilates Mensal 2x"
                        value={nome} 
                        onChange={e => setNome(e.target.value)} 
                        required 
                    />
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '20px' }}>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="modern-label">Valor Mensal (R$)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            className="modern-input" 
                            placeholder="0.00"
                            value={valor_mensal} 
                            onChange={e => setValorMensal(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-group" style={{ flex: 1 }}>
                        <label className="modern-label">Aulas na Semana</label>
                        <input 
                            type="number" 
                            className="modern-input" 
                            placeholder="Ex: 2"
                            value={qtde_aulas_semana} 
                            onChange={e => setQtdeAulasSemana(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="submit" className="btn-save" disabled={loading} style={{ 
                        backgroundColor: '#28a745', 
                        color: 'white', 
                        padding: '10px 20px', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        flex: 1
                    }}>
                        {loading ? "Salvando..." : "SALVAR PLANO"}
                    </button>

                    <button type="button" onClick={aoSalvar} style={{ 
                        backgroundColor: '#ccc', 
                        color: '#333', 
                        padding: '10px 20px', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>
                        CANCELAR
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CadastroPlano;