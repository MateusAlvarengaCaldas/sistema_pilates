import { useState } from "react";
import './ListaPlanos.css';

function CadastroPlano({ aoSalvar }) {
    // Estados do formulário
    const [nome, setNome] = useState('');
    const [valor_mensal, setValorMensal] = useState('');
    const [qtde_aulas_semana, setQtdeAulasSemana] = useState('');
    const [loading, setLoading] = useState(false); // Faltava declarar isso

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nome || !valor_mensal || !qtde_aulas_semana) {
            alert("Preencha todos os campos!");
            return;
        }

        setLoading(true);

        // Pega o token para ter permissão
        const token = localStorage.getItem('token');

        // Monta o objeto igual ao que o Backend espera
        // Converto para Number para garantir que não vá como texto
        const dados = { 
            nome, 
            valor_mensal: parseFloat(valor_mensal), 
            qtde_aulas_semana: parseInt(qtde_aulas_semana),
            ativo: true // Criamos o plano como ativo por padrão
        };

        try {
            const resp = await fetch('http://localhost:3000/planos', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- Importante!
                },
                body: JSON.stringify(dados)
            });

            if (resp.ok) {
                alert('✅ Plano cadastrado com sucesso!');
                // Chama a função que o pai passou para voltar para a lista
                if (aoSalvar) aoSalvar(); 
            } else {
                const erro = await resp.json();
                alert('Erro ao cadastrar: ' + (erro.message || 'Tente novamente.'));
            }
        } catch (err) {
            console.error(err);
            alert('Erro de conexão com o servidor.');
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
                            step="0.01" // Permite centavos
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