import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';

// Função para proteger rotas (Só deixa entrar se tiver crachá)
function RotaProtegida({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota 1: Tela de Login (É a página inicial '/') */}
        <Route path="/" element={<Login />} />

        {/* Rota 2: Dashboard (Protegida) */}
        <Route 
          path="/dashboard" 
          element={
            <RotaProtegida>
              <Dashboard onLogout={() => {
                localStorage.removeItem('token'); // Apaga o crachá
                window.location.href = '/';       // Manda pro login
              }} />
            </RotaProtegida>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;