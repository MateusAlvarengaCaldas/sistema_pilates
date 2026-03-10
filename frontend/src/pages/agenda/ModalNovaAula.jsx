import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import './ModalNovaAula.css';

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
        try {
            // Agora enviamos o formulário inteiro, pois ele já tem o professor_id dentro dele!
            await axios.post('http://localhost:3000/aulas', form);
            
            alert("Aula marcada com sucesso!");
            onAulaCriada(); 
            onClose();      
        } catch (error) {
            alert("Erro ao marcar aula.");
            console.error(error);
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