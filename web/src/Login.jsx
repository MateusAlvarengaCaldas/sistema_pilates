import { useState } from "react";

function Login({onLogin}){
    const [email, setEmail] = useState('');
    const handleEntrar = (e) =>{
        e.preventDefault();

        if(email){
            onLogin(email);
        } else{
            alert('Por favor, digite um email!')
        }
    };
    return (
        <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', // Ocupa a altura total da tela
      backgroundColor: '#f0f2f5' 
    }}>
      <div style={{ 
        background: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Acesso Restrito 🔒</h2>
        
        <form onSubmit={handleEntrar} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@pilates.com"
              style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              padding: '10px', 
              background: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ENTRAR NO SISTEMA
          </button>

        </form>
      </div>
    </div>
    );
}

export default Login;