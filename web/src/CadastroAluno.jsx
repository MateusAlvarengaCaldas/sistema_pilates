import { useEffect } from 'react';
import { useState } from 'react';

function CadastroAluno() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [plano, setPlano] = useState('');
  const [listaPlanos, setListaPlanos] = useState([]);
  const [professor, setProfessor] = useState('');
  const [listaProfessor, setProfessores] = useState([]);

useEffect(() =>{
async function buscarPlanos() {
      try {
        const resposta = await fetch('http://localhost:3000/planos');
        const dados = await resposta.json();
        setListaPlanos(dados);
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      }
    }
    async function buscarProfessores() {
      try{
        const resposta = await fetch('http://localhost:3000/planos');
        const dados = await resposta.json();
        setProfessores(dados)
      } catch(error) {
        console.error("Erro ao buscar professores:", error);
      }
      
    }
    buscarPlanos();
    buscarProfessores();
  }, []);
  

  async function handleSubmit(e) {
    e.preventDefault();

    if(!plano){
      alert("Por favor, selecione um plano!");
      return;
    }
    

    const dadosDoAluno = {
      nome,
      cpf,
      telefone,
      data_nascimento: nascimento,
      plano_id: plano,
      professor_id: professor
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
        setNome('');
        setCpf('');
        setTelefone('');
        setNascimento('');
      } else {
        alert('❌ Erro ao cadastrar. O servidor respondeu com erro.');
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert('❌ Erro de conexão. O Backend (porta 3000) está ligado?');
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

        <label>Plano:</label>
        <select value={plano}onChange={(e) => setPlano(e.target.value)}style={{ padding: '8px'}}>
        <option value="">Selecione um plano...</option>
        {listaPlanos?.length > 0 && listaPlanos.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome} - R$ {item.valor_mensal}
          </option>
        ))}
        </select>

        <label>Professor:</label>
        <select value={professor}onChange={(e) => setProfessor(e.target)}style={{padding: '8px'}}>
          <option value="">Selecio um professor...</option>
          {listaProfessor?.length > 0 && listaProfessor.map((prof) => (
            <option key={prof.id} value={prof.id}>
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