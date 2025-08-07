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
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, items, onCardClick }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
      </div>
      <SortableContext
        id={id}
        items={items.map(item => item.id.toString())}
        strategy={verticalListSortingStrategy}
      >
        <div className="kanban-column-cards">
          {items.map(op => (
            <DraggableCard key={op.id} op={op} onCardClick={onCardClick} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;