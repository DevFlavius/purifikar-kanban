import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Op } from '../types/Op';
import '../style/App.css';

interface DraggableCardProps {
  op: Op;
  onCardClick: (op: Op) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ op, onCardClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: op.id.toString(),
  });

  const [mouseDown, setMouseDown] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: mouseDown ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="kanban-card"
      style={style}
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => {
        if (!isDragging) onCardClick(op);
        setMouseDown(false);
      }}
      onMouseLeave={() => setMouseDown(false)}
    >
      <p><strong className="production-card-nome">{op.nome_produto}</strong></p>
      <p className="production-card-codigo">OP: {op.op_num}</p>
      <p className="production-card-quantidade">Qtd: {op.quant_total}</p>
      <p className="production-card-observacao">Observação: {op.observacao}</p>
    </div>
  );
};

export default DraggableCard;