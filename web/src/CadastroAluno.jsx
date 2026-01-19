import { useEffect, useState } from 'react';
import './CadastroAluno.css'; 

function CadastroAluno({ aoSalvar }) { // Recebe uma função para voltar pra lista
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [plano, setPlano] = useState('');
  const [professor, setProfessor] = useState('');
  
  const [listaPlanos, setListaPlanos] = useState([]);
  const [listaProfessor, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function buscarDados() {
      try {
        const [resPlanos, resProfs] = await Promise.all([
            fetch('http://localhost:3000/planos'),
            fetch('http://localhost:3000/usuarios')
        ]);
        setListaPlanos(await resPlanos.json());
        setProfessores(await resProfs.json());
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    buscarDados();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!plano || !professor) { alert("Preencha todos os campos!"); return; }
    setLoading(true);

    const dados = { nome, cpf, telefone, data_nascimento: nascimento, plano_id: plano, professor_id: professor };

    try {
      const resp = await fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (resp.ok) {
        alert('✅ Aluno cadastrado!');
        // Chama a função que o pai passou para mudar de aba
        if (aoSalvar) aoSalvar(); 
      } else {
        alert('Erro ao cadastrar');
      }
    } catch (err) { alert('Erro de conexão'); } 
    finally { setLoading(false); }
  }

  // RENDERIZAÇÃO SIMPLIFICADA (Sem Sidebar, Sem Split Screen)
  return (
    <div className="card-modern" style={{ maxWidth: '100%', margin: 0, boxShadow: 'none', border: '1px solid #eee' }}>
        <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="modern-label">Nome Completo</label>
              <input type="text" className="modern-input" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label className="modern-label">CPF</label>
                    <input type="text" className="modern-input" value={cpf} onChange={e => setCpf(e.target.value)} required />
                </div>
                <div className="input-group">
                    <label className="modern-label">Telefone</label>
                    <input type="text" className="modern-input" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>
            </div>

            <div className="form-row">
                <div className="input-group">
                    <label className="modern-label">Nascimento</label>
                    <input type="date" className="modern-input" value={nascimento} onChange={e => setNascimento(e.target.value)} />
                </div>
                <div className="input-group">
                    <label className="modern-label">Professor</label>
                    <select className="modern-select" value={professor} onChange={e => setProfessor(e.target.value)} required>
                        <option value="">Selecione...</option>
                        {listaProfessor.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                </div>
            </div>

            <div className="input-group">
              <label className="modern-label">Plano</label>
              <select className="modern-select" value={plano} onChange={e => setPlano(e.target.value)} required>
                <option value="">Selecione...</option>
                {listaPlanos.map(p => <option key={p.id} value={p.id}>{p.nome} - R$ {p.valor_mensal}</option>)}
              </select>
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Salvando..." : "SALVAR ALUNO"}
            </button>
        </form>
    </div>
  );
}

export default CadastroAluno;