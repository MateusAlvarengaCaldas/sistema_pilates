import { useState, useMemo } from "react";

const normalizar = (texto) => {
    if(!texto) return '';
    return texto.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * @param {array} 
 * @param {array} 
 */

export function useFiltro(lista = [], chaves = []) {
    const [termoBusca, setTermoBusca] = useState('');

    const itensFiltrados = useMemo(() => {
        if (!termoBusca) return lista; 

        const termoNormalizado = normalizar(termoBusca);

        return lista.filter((item) => {

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