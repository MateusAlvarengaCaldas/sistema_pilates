import { useState } from "react";
import './Login.css';        // <--- Importa o estilo
import LogoPilates from '../../components/LogoPilates'; // <--- Importa o componente Logo

function Login({ onLogin }) {
    const [isCadastro, setIsCadastro] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Pequeno delay para efeito visual
        await new Promise(resolve => setTimeout(resolve, 500));

        const endpoint = isCadastro ? '/registrar' : '/login';
        const dadosParaEnviar = isCadastro ? { nome, email, senha } : { email, senha };

        try {
            const resposta = await fetch(`http://127.0.0.1:3000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(dadosParaEnviar)
            });
            const dados = await resposta.json();

            if (resposta.ok) {
                if (isCadastro) {
                    alert("✨ Cadastro realizado com sucesso! Aguarde a aprovação do estúdio.");
                    setIsCadastro(false);
                    setNome(''); setSenha('');
                } else {
                    onLogin(dados.usuario.email);
                }
            } else {
                alert(`⚠️ ${dados.erro}`);
            }
        } catch (error) {
            alert("❌ Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-split-container">
            
            {/* --- LADO ESQUERDO: LOGO E MARCA --- */}
            <div className="brand-section">
                <LogoPilates />
                <h1 className="brand-title">Studio Pilates </h1>
                <p className="brand-tagline">Equilíbrio entre corpo e mente.</p>
            </div>

            {/* --- LADO DIREITO: FORMULÁRIO --- */}
            <div className="form-section">
                <div className="login-card-modern">
                    
                    <div className="form-header">
                        <h2>{isCadastro ? "Crie sua conta" : "Bem-vindo de volta!"}</h2>
                        <p>{isCadastro ? "Preencha os dados para solicitar acesso." : "Insira suas credenciais para entrar."}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        
                        <div style={{ 
                            maxHeight: isCadastro ? '100px' : '0', 
                            opacity: isCadastro ? 1 : 0, 
                            overflow: 'hidden', 
                            transition: 'all 0.4s ease-in-out' 
                        }}>
                            <div className="input-group">
                                <label className="modern-label">Nome Completo</label>
                                <input 
                                    type="text"
                                    className="modern-input"
                                    placeholder="Ex: Maria Silva"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    required={isCadastro}
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label className="modern-label">E-mail</label>
                            <input
                                type="email"
                                className="modern-input"
                                placeholder="seu.email@exemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group" style={{ marginBottom: '35px' }}>
                            <label className="modern-label">Senha</label>
                            <input
                                type="password"
                                className="modern-input"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`modern-button ${isCadastro ? 'btn-azul' : 'btn-verde'}`}
                        >
                            {loading ? "Processando..." : (isCadastro ? "SOLICITAR ACESSO" : "ENTRAR NO SISTEMA")}
                        </button>

                    </form>

                    <div className="toggle-container">
                        <button
                            onClick={() => setIsCadastro(!isCadastro)}
                            className="btn-toggle-modern"
                        >
                            {isCadastro ? "Já possui cadastro? Faça Login" : "Novo por aqui? Crie uma conta"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;