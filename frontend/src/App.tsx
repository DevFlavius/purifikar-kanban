import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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

function App() {
  const { ops, setOps } = useFetchOps();
  const [modalOp, setModalOp] = useState<Op | null>(null); // Para o modal
  const [activeDragOp, setActiveDragOp] = useState<Op | null>(null); // Para o drag

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
  };
    console.log('selectedOp:', activeDragOp);
  // Use um delay para distinguir clique de drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 80, // ms
        tolerance: 5,
      },
    })
  );

  return (
    <div className="kanban-wrapper">
      <Header />
      <DndContext
        sensors={sensors}
        onDragStart={({ active }) => {
          const op = ops.find(op => String(op.id) === String(active.id));
          setActiveDragOp(op || null);
        }}
        onDragEnd={({ active, over }) => {
          setActiveDragOp(null);
          if (over && active.id !== over.id) handleDragEnd(String(active.id), String(over.id));
        }}
        onDragCancel={() => setActiveDragOp(null)}
      >
        <div className="kanban-columns">
          {columns.map(col => (
            <KanbanColumn
              key={col}
              id={col}
              title={col.replace('_', ' ').toUpperCase()}
              items={groupedOps[col]}
              onCardClick={setModalOp} // Só abre modal em clique
            />
          ))}
        </div>
        <DragOverlay>
          {activeDragOp ? (
            <DraggableCard op={activeDragOp} onCardClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>
      {modalOp && <Modal op={modalOp} onClose={() => setModalOp(null)} />}
    </div>
  );


}

export default App;
