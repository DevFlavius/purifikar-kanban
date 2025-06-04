import React from 'react';
import '../App.css';
import type { Op } from '../types/Op';

export type KanbanColumnProps = {
  id: string;
  title: string;
  items: Op[];
  onCardClick: (op: Op) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, items, onCardClick }) => {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
      </div>
      <div className="kanban-items">
        {items.map(op => (
          <div
            key={op.id}
            className="kanban-card"
            id={op.id}
            onClick={() => onCardClick(op)}
          >
            <p><strong className="production-card-nome">{op.nome_produto}</strong></p>
            <p className="production-card-codigo">OP: {op.op_num}</p>
            <p className="production-card-quantidade">Qtd: {op.quant_total}</p>
            <p className="production-card-observacao">Observação: {op.observacao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;