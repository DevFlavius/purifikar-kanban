import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './components/KanbanColumn';
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
  const { ops, loading, setOps } = useFetchOps();
  const [selectedOp, setSelectedOp] = useState<Op | null>(null);
  
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

    fetch(`http://localhost:3001/op/${opId}`, {
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
    console.log('selectedOp:', selectedOp);
  return (
    <div className="kanban-wrapper">
      <Header />
      <DndContext onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) handleDragEnd(String(active.id), String(over.id));
      }}>
        <div className="kanban-columns">
          {columns.map(col => (
            <KanbanColumn
              key={col}
              id={col}
              title={col.replace('_', ' ').toUpperCase()}
              items={groupedOps[col]}
              onCardClick={setSelectedOp}
            />
          ))}
        </div>
      </DndContext>
      {selectedOp && <Modal op={selectedOp} onClose={() => setSelectedOp(null)} />}
    </div>
  );


}

export default App;
