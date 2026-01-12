import { useState } from "react";

function Login({ onLogin }) {

    // CORREÇÃO 1: Nome padronizado com C maiúsculo (setIsCadastro)
    const [isCadastro, setIsCadastro] = useState(false);
    const[nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // CORREÇÃO 2: Variável endpoint (tudo minúsculo para combinar com o uso abaixo)
        const endpoint = isCadastro ? '/registrar' : '/login';

        const dadosParaEnviar = isCadastro 
        ? { nome, email, senha } 
        : { email, senha };

        try {
            // Agora a variável ${endpoint} existe e bate com a de cima
            const resposta = await fetch(`http://127.0.0.1:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                if (isCadastro) {
                    alert("Cadastro realizado! Aguarde a aprovação!");
                    // Usando o nome correto da função
                    setIsCadastro(false);
                } else {
                    // Se for Login, não precisa de alert, já entra direto
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '300px' }}>

                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                    {isCadastro ? "Solicitar Acesso 📝" : "Acesso Restrito 🔒"}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {isCadastro && (
                      <div>
                        <label>Nome Completo;</label>
                        <input type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>
                    )}
                    <div>
                        <label>E-mail:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label>Senha:</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            required
                            style={{ padding: '10px', width: '100%', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{ padding: '10px', background: isCadastro ? '#007bff' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {isCadastro ? "ENVIAR CADASTRO" : "ENTRAR"}
                    </button>

                </form>

                <hr style={{ margin: '20px 0' }} />

                <button
                    // Agora este nome bate com a definição lá em cima
                    onClick={() => setIsCadastro(!isCadastro)}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', width: '100%', textDecoration: 'underline' }}>
                    {isCadastro ? "Já tenho conta? Fazer Login" : "Não tem conta? Cadastre-se"}
                </button>

            </div>
        </div>
    );
}

export default Login;