import React from 'react';

type KanbanColumnProps = {
  title: string;
  children?: React.ReactNode;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, children }) => {
  return (
    <div className="bg-white text-black rounded-xl shadow-md p-4 w-72 flex-shrink-0">
      <h2 className="text-text-lg font-bold bg-gradient-to-r from-black via-gray-800 to-black text-white p-2 rounded mb-2 text-center font-semibold mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

export default KanbanColumn;