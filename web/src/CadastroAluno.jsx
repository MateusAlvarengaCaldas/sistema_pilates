import { useEffect, useState } from 'react';

function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  
  const [plano, setPlano] = useState('');
  const [listaPlanos, setListaPlanos] = useState([]);
  
  const [professor, setProfessor] = useState('');
  const [listaProfessor, setProfessores] = useState([]); // Array para guardar os profs

  useEffect(() => {
    // 1. Buscar Planos
    async function buscarPlanos() {
      try {
        const resposta = await fetch('http://localhost:3000/planos');
        const dados = await resposta.json();
        setListaPlanos(dados);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    }

    // 2. Buscar Professores (NOVO)
    async function buscarProfessores() {
      try {
        // Usamos a rota /usuarios que criamos para listar apenas professores
        const resposta = await fetch('http://localhost:3000/usuarios'); 
        const dados = await resposta.json();
        setProfessores(dados);
      } catch (error) {
        console.error("Erro ao buscar professores:", error);
      }
    }

    buscarPlanos();
    buscarProfessores(); // Chamando a função
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!plano) {
      alert("Por favor, selecione um plano!");
      return;
    }
    
    // Objeto pronto para enviar
    const dadosDoAluno = {
      nome,
      cpf,
      telefone,
      data_nascimento: nascimento,
      plano_id: plano,
      professor_id: professor // Envia o ID do professor selecionado
    };

    console.log("Enviando:", dadosDoAluno);

    try {
      const resposta = await fetch('http://localhost:3000/alunos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosDoAluno)
      });

      if (resposta.ok) {
        alert('✅ Aluno cadastrado com sucesso!');
        // Limpar formulário
        setNome('');
        setCpf('');
        setTelefone('');
        setNascimento('');
        setPlano('');
        setProfessor('');
      } else {
        alert('❌ Erro ao cadastrar. Verifique o console do navegador.');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('❌ Erro de conexão.');
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>Novo Aluno</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

        <label>CPF:</label>
        <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />

        <label>Telefone:</label>
        <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

        <label>Data de Nascimento:</label>
        <input type="date" value={nascimento} onChange={(e) => setNascimento(e.target.value)} />

        {/* SELECT DE PLANOS */}
        <label>Plano:</label>
        <select value={plano} onChange={(e) => setPlano(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Selecione um plano...</option>
          {listaPlanos?.length > 0 && listaPlanos.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nome} - R$ {item.valor_mensal}
            </option>
          ))}
        </select>

        {/* SELECT DE PROFESSORES (CORRIGIDO) */}
        <label>Professor:</label>
        <select 
            value={professor} 
            onChange={(e) => setProfessor(e.target.value)} // Correção: e.target.value
            style={{ padding: '8px' }}
        >
          <option value="">Selecione um professor...</option>
          {listaProfessor?.length > 0 && listaProfessor.map((prof) => (
            <option key={prof.id} value={prof.id}>
                {prof.nome}
            </option>
          ))}
        </select>

        <button type="submit" style={{ marginTop: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Salvar Aluno
        </button>
      </form>
    </div>
  );
}

export default CadastroAluno;