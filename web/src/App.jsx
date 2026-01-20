import { useState } from 'react';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Função chamada quando o login dá certo (recebe o email)
  const handleLoginSucesso = (email) => {
    setUsuarioLogado(email);
  };

  // Função para deslogar
  const handleLogout = () => {
    setUsuarioLogado(null);
  };

  return (
    <div>
      {/* Lógica Simples: Tem usuário? Mostra Dashboard. Não tem? Mostra Login */}
      {usuarioLogado ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLoginSucesso} />
      )}
    </div>
  );
}

export default App;