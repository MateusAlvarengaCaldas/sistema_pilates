import { useState, useEffect } from "react";
import axios from "axios"; // Assumindo que você usa Axios

export const useComissoes = () => {
    // 1. ESTADOS DO BANCO DE DADOS
    const [comissoes, setComissoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    // 2. ESTADOS DOS FILTROS
    const [filtroProfessor, setFiltroProfessor] = useState("");
    const [filtroAluno, setFiltroAluno] = useState("");
    const [filtroMes, setFiltroMes] = useState("");

    // 3. BUSCA OS DADOS NO NODE.JS (EXECUTA QUANDO A TELA ABRE)
    useEffect(() => {
        const buscarDados = async () => {
            try {
                setLoading(true);
                // ATENÇÃO: Coloque aqui a rota correta do seu backend!
                const resposta = await axios.get("http://localhost:3000/financeiro/relatorio-financeiro"); 
                
                // Salva os dados verdadeiros na memória
                setComissoes(resposta.data);
                setErro(null);
            } catch (error) {
                console.error("Erro ao buscar comissões:", error);
                setErro("Não foi possível carregar as comissões. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        buscarDados();
    }, []); // O array vazio garante que busque apenas uma vez ao abrir a tela

    // 4. EXTRAIR AS OPÇÕES PARA OS SELECTS (Sem repetir nomes)
    const professoresParaFiltro = [...new Set(comissoes.map(item => item.professor))];
    const alunosParaFiltro = [...new Set(comissoes.map(item => item.aluno))];

    // 5. APLICAR OS FILTROS NOS DADOS VERDADEIROS
    const comissoesFiltradas = comissoes.filter((item) => {
        const bateuProfessor = filtroProfessor === "" || item.professor === filtroProfessor;
        const bateuAluno = filtroAluno === "" || item.aluno === filtroAluno;
        
        let bateuMes = true;
        if (filtroMes !== "") {
            const [anoFiltro, mesFiltro] = filtroMes.split('-');
            // CUIDADO AQUI: Dependendo de como o Node devolve a data, 
            // você pode precisar ajustar esse .split('/'). 
            // Aqui assumimos que o banco devolve no formato "DD/MM/YYYY".
            const [, mesItem, anoItem] = item.data.split('/'); 
            bateuMes = (mesFiltro === mesItem && anoFiltro === anoItem);
        }

        return bateuProfessor && bateuAluno && bateuMes;
    });

    // 6. CALCULAR O TOTAL
    const totalComissoes = comissoesFiltradas.reduce((acc, item) => {
        // Converte para número caso o banco devolva como string ("60.00")
        return acc + Number(item.comissao || 0); 
    }, 0);

    // 7. ENTREGAR TUDO PRONTO PARA O COMPONENTE VISUAL
    return {
        comissoesFiltradas,
        professoresParaFiltro,
        alunosParaFiltro,
        totalComissoes,
        loading,
        erro,
        filtroProfessor, setFiltroProfessor,
        filtroAluno, setFiltroAluno,
        filtroMes, setFiltroMes
    };
};