import { useState, useMemo } from "react";

const normalizar = (texto) => {
    if(!texto) return '';
    return texto.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param {array} lista - A lista completa de dados.
 * @param {array} chaves - Quais campos estao sendo filtrados, nome... email...
 */

export function useFiltro(lista = [], chaves = []) {
    const [termoBusca, setTermoBusca] = useState('');

    const itensFiltrados = useMemo(() => {
        if (!termoBusca) return lista; // Se não tem busca, retorna tudo

        const termoNormalizado = normalizar(termoBusca);

        return lista.filter((item) => {
            // Verifica se ALGUMA das chaves contém o termo
            return chaves.some((chave) => {
                const valorCampo = item[chave];
                return normalizar(valorCampo).includes(termoNormalizado);
            });
        });

    }, [lista, termoBusca, chaves]);

    return {
        termoBusca,
        setTermoBusca,
        itensFiltrados
    };
}