import { useState } from 'react';
import CadastroAluno from './CadastroAluno';
import Login from './Login';

function App() {
  // 1. Estado que guarda se o usuário está logado ou não
  // null = ninguém logado
  // "email@..." = usuário logado
  const [usuario, setUsuario] = useState(null);

  // 2. O IF (O Segurança)
  // Se NÃO tiver usuário (null), mostra a tela de Login
  if (!usuario) {
    return <Login onLogin={(emailDigitado) => setUsuario(emailDigitado)} />;
  }

  // 3. Se tiver usuário, mostra o Sistema Principal (Cadastro)
  return (
    <div>
      <div style={{ background: '#eee', padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Olá, <strong>{usuario}</strong></span>
        <button onClick={() => setUsuario(null)} style={{ cursor: 'pointer' }}>Sair</button>
      </div>

      <h1 style={{ textAlign: 'center' }}>Sistema de Pilates</h1>
      <hr />
      <CadastroAluno />
    </div>
  );
}

export default App;