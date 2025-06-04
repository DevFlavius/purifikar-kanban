import React from 'react';
import '../App.css';

type KanbanColumnProps = {
  title: string;
  children?: React.ReactNode;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, children }) => {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h2 className="kanban-column-title">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default KanbanColumn;