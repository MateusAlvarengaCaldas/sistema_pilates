import Swal from 'sweetalert2';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
// Não precisa importar o React aqui, pois é só JavaScript puro!

export const abrirDetalhesAula = async (aula, onAtualizar) => {
    const dataFormatada = parseISO(aula.data_aula)
    const dataFinal = format(dataFormatada, "dd/MM/yyyy 'às' HH:mm", {locale: ptBR})
    const resultado = await Swal.fire({
        title: 'Detalhes do agendamento',
        html: `
        <div style="text-align: left; font-size: 16px; line-height: 1.8;">
            <strong>Aluno(a):</strong> ${aula.aluno} <br/>
            <strong>Data:</strong> ${dataFinal} <br/>
            <strong>Situação:</strong> ${aula.status} <br/>
            <strong>Professor:</strong> ${aula.professor} <br/>
        </div>
        `,
        icon: 'info',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#28a745', 
        denyButtonColor: '#d33',       
        cancelButtonColor: '#6c757d',  
        confirmButtonText: 'Confirmar Presença',
        denyButtonText: 'Cancelar Aula',
        cancelButtonText: 'Fechar'
    });

    if (resultado.isConfirmed) {
        console.log(`Confirmando presenca da aula: aluno(a) ${aula.aluno}/ Cod. ${aula.id}`);
        // Aqui vai o código para confirmar no banco depois
    } else if (resultado.isDenied) {
        console.log(`Cancelando a aula: ${aula.aluno}/ Cod. ${aula.id}`);
        // Aqui vai o código para cancelar no banco depois
    }
};