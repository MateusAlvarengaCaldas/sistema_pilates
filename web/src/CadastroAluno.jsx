import { useEffect, useState } from 'react';
import './CadastroAluno.css'; // Importa o novo estilo
import LogoPilates from './LogoPilates'; // Reusa a logo que criamos

function CadastroAluno() {
  // --- STATES ---
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  
  const [plano, setPlano] = useState('');
  const [listaPlanos, setListaPlanos] = useState([]);
  
  const [professor, setProfessor] = useState('');
  const [listaProfessor, setProfessores] = useState([]);

  const [loading, setLoading] = useState(false); // Feedback visual

  // --- BUSCAR DADOS ---
  useEffect(() => {
    async function buscarDados() {
      try {
        const resPlanos = await fetch('http://localhost:3000/planos');
        const dadosPlanos = await resPlanos.json();
        setListaPlanos(dadosPlanos);

        const resProfs = await fetch('http://localhost:3000/usuarios');
        const dadosProfs = await resProfs.json();
        setProfessores(dadosProfs);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    buscarDados();
  }, []);

  // --- SUBMIT ---
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!plano) { alert("Selecione um plano!"); return; }
    if (!professor) { alert("Selecione um professor!"); return; }

    setLoading(true);
    // Delay estético para ver o loading
    await new Promise(r => setTimeout(r, 500));

    const dadosDoAluno = {
      nome,
      cpf,
      telefone,
      data_nascimento: nascimento,
      plano_id: plano,
      professor_id: professor
    };

    try {
      const resposta = await fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosDoAluno)
      });

      if (resposta.ok) {
        alert('✅ Aluno matriculado com sucesso!');
        // Limpar form
        setNome(''); setCpf(''); setTelefone(''); setNascimento(''); setPlano(''); setProfessor('');
      } else {
        const erro = await resposta.json();
        alert('❌ Erro: ' + (erro.erro || 'Falha ao cadastrar'));
      }
    } catch (error) {
      alert('❌ Erro de conexão.');
    } finally {
      setLoading(false);
    }
  }

  // --- RENDER ---
  return (
    <div className="main-split-container">
      
      {/* LADO ESQUERDO: MENU/LOGO */}
      <div className="brand-section">
        <LogoPilates />
        <h1 className="brand-title">Gestão de Alunos</h1>
        <p className="brand-tagline">Cadastre novos membros e organize as turmas.</p>
        
        {/* Dica: Aqui futuramente você pode colocar botões de menu (Voltar, Listar, etc) */}
      </div>

      {/* LADO DIREITO: FORMULÁRIO */}
      <div className="form-section">
        <div className="card-modern">
          
          <div className="form-header">
            <h2>Nova Matrícula 📝</h2>
            <p>Preencha os dados completos do aluno</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Linha 1: Nome Completo (Ocupa tudo) */}
            <div className="input-group">
              <label className="modern-label">Nome Completo</label>
              <input type="text" className="modern-input" 
                value={nome} onChange={(e) => setNome(e.target.value)} required 
                placeholder="Ex: João da Silva"
              />
            </div>

            {/* Linha 2: CPF e Telefone (Lado a lado) */}
            <div className="form-row">
                <div className="input-group">
                    <label className="modern-label">CPF</label>
                    <input type="text" className="modern-input" 
                        value={cpf} onChange={(e) => setCpf(e.target.value)} required 
                        placeholder="000.000.000-00"
                    />
                </div>
                <div className="input-group">
                    <label className="modern-label">Telefone / WhatsApp</label>
                    <input type="text" className="modern-input" 
                        value={telefone} onChange={(e) => setTelefone(e.target.value)} 
                        placeholder="(XX) 99999-9999"
                    />
                </div>
            </div>

            {/* Linha 3: Nascimento e Professor (Lado a lado) */}
            <div className="form-row">
                <div className="input-group">
                    <label className="modern-label">Data de Nascimento</label>
                    <input type="date" className="modern-input" 
                        value={nascimento} onChange={(e) => setNascimento(e.target.value)} 
                    />
                </div>
                <div className="input-group">
                    <label className="modern-label">Professor Responsável</label>
                    <select className="modern-select" 
                        value={professor} onChange={(e) => setProfessor(e.target.value)} required
                    >
                        <option value="">Selecione...</option>
                        {listaProfessor.map((prof) => (
                            <option key={prof.id} value={prof.id}>{prof.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Linha 4: Plano (Ocupa tudo para destaque) */}
            <div className="input-group">
              <label className="modern-label">Plano Contratado</label>
              <select className="modern-select" 
                value={plano} onChange={(e) => setPlano(e.target.value)} required
              >
                <option value="">Selecione um plano...</option>
                {listaPlanos.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nome} - R$ {item.valor_mensal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Salvando..." : "CONCLUIR MATRÍCULA"}
            </button>

          </form>
        </div>
      </div>

    </div>
  );
}

export default CadastroAluno;