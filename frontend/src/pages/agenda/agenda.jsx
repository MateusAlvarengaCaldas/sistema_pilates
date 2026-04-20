import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, subWeeks, addWeeks, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import axios from 'axios';
import './agenda.css'; 
import ModalNovaAula from './ModalNovaAula';
import Swal from "sweetalert2";
import { abrirDetalhesAula } from '../../utils/alertasAgenda';

const Agenda = ({ professorId }) => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);

  const carregarAgenda = async () => {
    

    setLoading(true);
    const inicioSemana = format(startOfWeek(dataAtual, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const fimSemana = format(endOfWeek(dataAtual, { weekStartsOn: 1 }), 'yyyy-MM-dd');



    try {
      const response = await axios.get(`http://localhost:3000/aulas/agenda`, {
        params: {inicio: inicioSemana, fim: fimSemana }
      });
      setAulas(response.data);
    } catch (error) {
      console.error("Erro ao buscar agenda", error);
      setAulas([
        { id: 1, aluno: 'João Silva', data_aula: new Date().toISOString(), status: 'pendente' },
        { id: 2, aluno: 'Maria Souza', data_aula: addDays(new Date(), 1).toISOString(), status: 'concluido' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAgenda();
  }, [dataAtual]);

  const proximaSemana = () => setDataAtual(addWeeks(dataAtual, 1));
  const semanaAnterior = () => setDataAtual(subWeeks(dataAtual, 1));
  const irParaHoje = () => setDataAtual(new Date());

  const renderizarColunasDias = () => {
    const dias = [];
    let diaInicio = startOfWeek(dataAtual, { weekStartsOn: 1 });

    for (let i = 0; i < 6; i++) {
      const diaColuna = addDays(diaInicio, i);
      const ehHoje = isSameDay(diaColuna, new Date());

      dias.push(
        <div key={i} className="day-column">
          {/* Cabeçalho da Coluna */}
          <div className={`day-header ${ehHoje ? 'today' : ''}`}>
            <p className="day-name">
              {format(diaColuna, 'EEEE', { locale: ptBR })}
            </p>
            <p className="day-date">
              {format(diaColuna, 'dd/MM')}
            </p>
          </div>

          {/* Área de Cards */}
          <div className="cards-container">
            {renderizarCardsAulas(diaColuna)}
            
            {/* Botão "Adicionar" ao passar o mouse */}
            <button 
                onClick={() => setModalAberto(true)}
                className="btn-ghost-add"
                title="Adicionar aula"
            >
                <Plus size={20} />
            </button>
          </div>
        </div>
      );
    }
    return dias;
  };

  const renderizarCardsAulas = (dia) => {
    const aulasDoDia = aulas.filter(aula => isSameDay(parseISO(aula.data_aula), dia));
    aulasDoDia.sort((a, b) => new Date(a.data_aula) - new Date(b.data_aula));

    return aulasDoDia.map(aula => {
      const horaFormatada = format(parseISO(aula.data_aula), 'HH:mm');
      
      let statusClass = "";
      let IconeStatus = Clock;
      let corIcone = "#3b82f6";

      if (aula.status === 'concluido') {
        statusClass = "status-concluido";
        IconeStatus = CheckCircle;
        corIcone = "#10b981";
      } else if (aula.status === 'cancelado') {
        statusClass = "status-cancelado";
        IconeStatus = XCircle;
        corIcone = "#ef4444";
      }

      return (
        <div 
          key={aula.id} 
          onClick={() => abrirDetalhesAula(aula, carregarAgenda)}
          className={`class-card ${statusClass}`}
        >
          <div className="card-header">
            <span className="time-badge">
                {horaFormatada}
            </span>
            <IconeStatus size={16} color={corIcone} />
          </div>
          
          <div className="card-body">
            <div className="avatar-circle">
                <User size={14} />
            </div>
            <div className="student-info">
                <h4>{aula.aluno}</h4>
                <p>{aula.status}</p>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="agenda-container">
      
      {/* --- CABEÇALHO --- */}
      <div className="agenda-header">
        <div className="header-title">
            <h2>Agenda</h2>
            <span className="header-badge">
                {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
            </span>
        </div>
        
        <div className="nav-controls">
            <button onClick={semanaAnterior} className="nav-btn"><ChevronLeft size={20} /></button>
            <button onClick={irParaHoje} className="nav-btn-today">Hoje</button>
            <button onClick={proximaSemana} className="nav-btn"><ChevronRight size={20} /></button>
        </div>
        
        <button className="btn-primary" onClick={() => setModalAberto(true)}>
            <Plus size={20} /> Nova Aula
        </button>
      </div>

      {/* --- CORPO DA AGENDA --- */}
      <div className="agenda-grid">
        <div className="agenda-content-wrapper"> 
            {renderizarColunasDias()}
        </div>
      </div>
      
    <ModalNovaAula 
          isOpen={modalAberto} 
          onClose={() => setModalAberto(false)} 
          professorId={professorId}
          onAulaCriada={carregarAgenda} 
      />

    </div>
  );
};

export default Agenda;