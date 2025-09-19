import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Op } from '../types/Op';
import DraggableCard from './DraggableCard';
import '../style/App.css';

export type KanbanColumnProps = {
  id: string;
  title: string;
  items: Op[];
  onCardClick: (op: Op) => void;
  isDragging: boolean;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  items,
  onCardClick,
  isDragging
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`kanban-column ${isOver ? 'kanban-column-over' : ''}`}
      ref={setNodeRef}
    >
      <div className="kanban-column-header">
        <div className="kanban-column-header-content">
          <h2 className="kanban-column-title">{title}</h2>
          <span className="kanban-column-count">{items.length}</span>
        </div>
      </div>
      <SortableContext
        id={id}
        items={items.map(item => item.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="kanban-column-cards">
          {items.map(op => (
            <DraggableCard
              key={op.id}
              op={op}
              onCardClick={onCardClick}
              isDragging={isDragging}
              isOverlay={false}
            />
          ))}
          {items.length === 0 && (
            <div className="kanban-column-empty">
              <p>Nenhuma OP nesta etapa</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;