import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  PointerSensor, 
  useSensor, 
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent
} from '@dnd-kit/core';
import KanbanColumn from './components/KanbanColumn';
import DraggableCard from './components/DraggableCard';
import { useFetchOps } from './hooks/useFetchOps';
import type { Op } from './types/Op';
import Header from './components/Header';
import './style/App.css';
import Modal from './components/Modal';

const statusNames: Record<string, string> = {
  '10': 'nova',
  '15': 'a_produzir',
  '20': 'em_producao',
  '30': 'acabamento',
  '60': 'finalizado',
};

const columns = ['nova', 'a_produzir', 'em_producao', 'acabamento', 'finalizado'];

// Dados de exemplo para teste
const sampleOps: Op[] = [
  {
    id: "1",
    id_produto: "PROD001",
    cod_produto: "COD001",
    op_num: "OP001",
    nome_produto: "Produto A",
    quant_total: 100,
    observacao: "Urgente",
    etapa: "10",
    dt_previsao: "2024-01-15",
    componentes: {}
  },
  {
    id: "2",
    id_produto: "PROD002",
    cod_produto: "COD002",
    op_num: "OP002",
    nome_produto: "Produto B",
    quant_total: 50,
    observacao: "Normal",
    etapa: "15",
    dt_previsao: "2024-01-20",
    componentes: {}
  },
  {
    id: "3",
    id_produto: "PROD003",
    cod_produto: "COD003",
    op_num: "OP003",
    nome_produto: "Produto C",
    quant_total: 75,
    observacao: "Revisar",
    etapa: "20",
    dt_previsao: "2024-01-25",
    componentes: {}
  },
  {
    id: "4",
    id_produto: "PROD004",
    cod_produto: "COD004",
    op_num: "OP004",
    nome_produto: "Produto D",
    quant_total: 200,
    observacao: "Teste",
    etapa: "30",
    dt_previsao: "2024-01-30",
    componentes: {}
  },
  {
    id: "5",
    id_produto: "PROD005",
    cod_produto: "COD005",
    op_num: "OP005",
    nome_produto: "Produto E",
    quant_total: 25,
    observacao: "Concluído",
    etapa: "60",
    dt_previsao: "2024-02-01",
    componentes: {}
  }
];

function App() {
  const { ops: fetchedOps, setOps: setFetchedOps, loading, error } = useFetchOps();
  const [modalOp, setModalOp] = useState<Op | null>(null);
  const [activeDragOp, setActiveDragOp] = useState<Op | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Usar dados de exemplo se não houver dados do backend
  const ops = fetchedOps.length > 0 ? fetchedOps : sampleOps;
  const setOps = fetchedOps.length > 0 ? setFetchedOps : () => {};

  const groupedOps: Record<string, Op[]> = {
    nova: [],
    a_produzir: [],
    em_producao: [],
    acabamento: [],
    finalizado: [],
  };

  ops.forEach(op => {
    const etapaKey = statusNames[String(op.etapa)];
    if (etapaKey) groupedOps[etapaKey].push(op);
  });

  const handleDragEnd = (opId: string, newStatus: string) => {
    const etapaCode = Object.keys(statusNames).find(key => statusNames[key] === newStatus);
    if (!etapaCode) return;
    
    // Se temos dados do backend, fazer a requisição
    if (fetchedOps.length > 0) {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      fetch(`${apiUrl}/op/${opId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: etapaCode })
      }).then(() => {
        setOps(prev =>
          prev.map(op =>
            op.id === opId ? { ...op, etapa: etapaCode } : op
          )
        );
      });
    } else {
      // Para dados de exemplo, apenas atualizar localmente
      console.log(`Movendo OP ${opId} para ${newStatus} (etapa ${etapaCode})`);
    }
  };

  // Função para lidar com clique no card - só executa se não estiver arrastando
  const handleCardClick = (op: Op) => {
    if (!isDragging) {
      setModalOp(op);
    }
  };

  // Configuração do sensor com delay maior para melhor distinção entre drag e click
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // Aumentado para 150ms
        tolerance: 8, // Aumentado para 8px
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const op = ops.find(op => String(op.id) === String(active.id));
    setActiveDragOp(op || null);
    setIsDragging(true);
    
    // Fechar modal se estiver aberto
    if (modalOp) {
      setModalOp(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = String(active.id);
    const overId = String(over.id);
    
    // Se estamos arrastando sobre uma coluna diferente, reorganizar temporariamente
    const activeOp = ops.find(op => String(op.id) === activeId);
    if (!activeOp) return;
    
    const activeColumn = statusNames[String(activeOp.etapa)];
    const overColumn = overId;
    
    if (activeColumn !== overColumn && columns.includes(overColumn)) {
      // Para dados de exemplo, não atualizar o estado temporariamente
      if (fetchedOps.length > 0) {
        setOps(prev => 
          prev.map(op => 
            String(op.id) === activeId 
              ? { ...op, etapa: Object.keys(statusNames).find(key => statusNames[key] === overColumn) || op.etapa }
              : op
          )
        );
      }
    }
  };

  const handleDragEndEvent = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveDragOp(null);
    setIsDragging(false);
    
    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      
      // Se arrastamos sobre uma coluna
      if (columns.includes(overId)) {
        handleDragEnd(activeId, overId);
      }
    }
  };

  const handleDragCancel = () => {
    setActiveDragOp(null);
    setIsDragging(false);
    
    // Restaurar estado original se o drag foi cancelado
    if (activeDragOp && fetchedOps.length > 0) {
      setOps(prev => 
        prev.map(op => 
          String(op.id) === String(activeDragOp.id) 
            ? activeDragOp
            : op
        )
      );
    }
  };

  if (loading) {
    return (
      <div className="kanban-wrapper">
        <Header />
        <div className="loading-container">
          <p>Carregando OPs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-wrapper">
      <Header />
      {error && fetchedOps.length === 0 && (
        <div className="error-banner">
          <p>⚠️ Backend não conectado - usando dados de exemplo para demonstração</p>
        </div>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEndEvent}
        onDragCancel={handleDragCancel}
      >
        <div className="kanban-columns">
          {columns.map(col => (
            <KanbanColumn
              key={col}
              id={col}
              title={col.replace('_', ' ').toUpperCase()}
              items={groupedOps[col]}
              onCardClick={handleCardClick}
              isDragging={isDragging}
            />
          ))}
        </div>
        <DragOverlay>
          {activeDragOp ? (
            <DraggableCard 
              op={activeDragOp} 
              onCardClick={() => {}} 
              isDragging={true}
              isOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      {modalOp && !isDragging && (
        <Modal op={modalOp} onClose={() => setModalOp(null)} />
      )}
    </div>
  );
}

export default App;

