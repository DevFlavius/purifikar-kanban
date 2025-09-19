import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Op } from '../types/Op';
import '../style/App.css';

interface DraggableCardProps {
  op: Op;
  onCardClick: (op: Op) => void;
  isDragging: boolean;
  isOverlay: boolean;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ 
  op, 
  onCardClick, 
  isDragging: globalIsDragging,
  isOverlay 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: localIsDragging,
  } = useSortable({
    id: op.id.toString(),
    disabled: isOverlay, // Desabilitar drag no overlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: localIsDragging ? 0.5 : 1,
    cursor: globalIsDragging ? 'grabbing' : 'grab',
  };

  // Função para lidar com o clique - só executa se não estiver arrastando globalmente
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Só permite clique se não estiver arrastando e não for o overlay
    if (!globalIsDragging && !isOverlay && !localIsDragging) {
      onCardClick(op);
    }
  };

  // Função para lidar com o mouse down - previne clique durante drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (globalIsDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`kanban-card ${localIsDragging ? 'kanban-card-dragging' : ''} ${isOverlay ? 'kanban-card-overlay' : ''}`}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <p><strong className="production-card-nome">{op.nome_produto}</strong></p>
      <p className="production-card-codigo">OP: {op.op_num}</p>
      <p className="production-card-quantidade">Qtd: {op.quant_total}</p>
      <p className="production-card-observacao">Observação: {op.observacao}</p>
    </div>
  );
};

export default DraggableCard;

