import Swal from 'sweetalert2';
import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';
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
        try{
            await axios.put(`http://localhost:3000/aulas/${aula.id}/status`, {
                status_presenca: 'concluido'
            })
            await Swal.fire('Sucesso!', 'Presença confirmada no sistema.', 'success')
            onAtualizar();
        }catch (error){
            await Swal.fire('Erro', 'Não foi possível confirmar a presença.', 'error');
            console.error(error)
        }
    } else if (resultado.isDenied) {
        try{
        await axios.put(`http://localhost:3000/aulas/${aula.id}/status`, {
            status_presenca: 'cancelado'
        })
        await Swal.fire('Cancelada', 'A aula foi marcada como cancelada.', 'info')
        onAtualizar();
        }  catch(error){
            await Swal.fire('Erro', 'Não foi possível cancelar a aula.', 'error')
            console.error(error)
        }
    }
};