import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import './ModalNovaAula.css';
import Swal from 'sweetalert2';

const ModalNovaAula = ({ isOpen, onClose, onAulaCriada }) => {
    // 1. Nossa memória agora guarda listas de alunos E de professores
    const [alunos, setAlunos] = useState([]);
    const [professores, setProfessores] = useState([]);
    
    // 2. Adicionamos o professor_id no formulário
    const [form, setForm] = useState({
        professor_id: '', // NOVO CAMPO!
        aluno_id: '',
        data: '',
        hora: '',
        observacao: ''
    });

    // 3. O Gatilho: Quando a tela abre, o Axios busca as duas listas
    useEffect(() => {
        if (isOpen) {
            // Busca todos os alunos
            axios.get('http://localhost:3000/alunos')
                 .then(res => setAlunos(res.data))
                 .catch(err => console.error("Erro ao buscar alunos", err));

            // Busca todos os professores
            axios.get('http://localhost:3000/usuarios')
                 .then(res => setProfessores(res.data))
                 .catch(err => console.error("Erro ao buscar professores", err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {

        e.preventDefault();

        const resultado = await Swal.fire({
            title: 'Salvar agendamento?',
            text: `Confirmar criação desta nova aula?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, salvar',
            cancelButtonText: 'Cancelar'
        });

        if(resultado.isConfirmed){
        try {
            // 1. Junta a data (2026-03-09) com a hora (14:00) no formato que o banco gosta
            const dataAulaFormatada = `${form.data}T${form.hora}:00`;

            // 2. Chama a rota EXATA do seu backend e com os nomes corretos
            
            await axios.post('http://localhost:3000/aulas/registrar-aula', {
                professor_id: form.professor_id,
                aluno_id: form.aluno_id,
                data_aula: dataAulaFormatada, // Agora bate com o backend!
                observacao: form.observacao
            });
            
            await Swal.fire('Sucesso!',
                'Aula marcada com sucesso!',
                'success'
            );

            setForm({
                professor_id: '',
                aluno_id: '',
                data: '',
                hora: '',
                observacao: ''
            });
            onAulaCriada(); 
            onClose();      
        } catch (error) {
            await Swal.fire('Erro',
                'Ocorreu um problema ao marcar a aula.',
                'error'
            );
            console.error(error);
        }
    }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                
                <div className="modal-header">
                    <h2>Agendar Nova Aula</h2>
                    <button onClick={onClose} className="modal-close">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    
                    {/* --- NOVO CAMPO: SELECIONAR PROFESSOR --- */}
                    <div className="form-group">
                        <label>Professor</label>
                        <select 
                            required
                            value={form.professor_id}
                            onChange={(e) => setForm({...form, professor_id: e.target.value})}
                            className="form-input"
                        >
                            <option value="">Selecione um professor...</option>
                            {professores.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </select>
                    </div>

                    {/* --- CAMPO: SELECIONAR ALUNO --- */}
                    <div className="form-group">
                        <label>Aluno</label>
                        <select 
                            required
                            value={form.aluno_id}
                            onChange={(e) => setForm({...form, aluno_id: e.target.value})}
                            className="form-input"
                        >
                            <option value="">Selecione um aluno...</option>
                            {alunos.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Data</label>
                            <input 
                                type="date" required
                                value={form.data}
                                onChange={(e) => setForm({...form, data: e.target.value})}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group half">
                            <label>Hora</label>
                            <input 
                                type="time" required
                                value={form.hora}
                                onChange={(e) => setForm({...form, hora: e.target.value})}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Observações (Opcional)</label>
                        <textarea 
                            rows="2"
                            value={form.observacao}
                            onChange={(e) => setForm({...form, observacao: e.target.value})}
                            className="form-input"
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-submit">
                        Salvar Agendamento
                    </button>
                </form>

            </div>
        </div>
    );
};

export default ModalNovaAula;