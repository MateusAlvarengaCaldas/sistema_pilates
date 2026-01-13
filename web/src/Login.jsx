import { useState } from "react";
import './login.css'; // <--- Importando o arquivo CSS criado acima

function Login({ onLogin }) {

    const [isCadastro, setIsCadastro] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const endpoint = isCadastro ? '/registrar' : '/login';

        const dadosParaEnviar = isCadastro 
        ? { nome, email, senha } 
        : { email, senha };

        try {
            const resposta = await fetch(`http://127.0.0.1:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                if (isCadastro) {
                    alert("Cadastro realizado! Aguarde a aprovação!");
                    setIsCadastro(false);
                } else {
                    onLogin(dados.usuario.email);
                }
            } else {
                alert(dados.erro);
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2 className="login-title">
                    {isCadastro ? "Solicitar Acesso 📝" : "Acesso Restrito 🔒"}
                </h2>

                <form onSubmit={handleSubmit} className="login-form">
                    {isCadastro && (
                      <div>
                        <label className="input-label">Nome Completo:</label>
                        <input 
                            type="text"
                            className="input-field"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                        />
                      </div>
                    )}
                    
                    <div>
                        <label className="input-label">E-mail:</label>
                        <input
                            type="email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="input-label">Senha:</label>
                        <input
                            type="password"
                            className="input-field"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        // Lógica: Se for cadastro usa classe 'azul', se não 'verde'
                        className={`btn-submit ${isCadastro ? 'azul' : 'verde'}`}
                    >
                        {isCadastro ? "ENVIAR CADASTRO" : "ENTRAR"}
                    </button>

                </form>

                <hr className="divider" />

                <button
                    onClick={() => setIsCadastro(!isCadastro)}
                    className="btn-toggle"
                >
                    {isCadastro ? "Já tenho conta? Fazer Login" : "Não tem conta? Cadastre-se"}
                </button>

            </div>
        </div>
    );
}

export default Login;