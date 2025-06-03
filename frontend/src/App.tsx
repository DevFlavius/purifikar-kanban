import React from 'react';
import KanbanColumn from './components/KanbanColumn';
import ProductionCard from './components/ProductionCard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com logo */}
      <header className="w-full py-2 bg-gradient-to-r from-black to-zinc-800 flex justify-center items-center shadow-md">
        <img
          src="https://purifikar.com.br/wp-content/uploads/2023/07/logo-pfk-R-hotizontal-branca.png"
          alt="Logo Purifikar"
          className="h-12"
        />
      </header>

      {/* Kanban Board */}
      <main className="flex justify-center gap-4 p-6 min-h-screen bg-gradient-to-b from-blue-900 to-blue-600">
        <KanbanColumn title="OP Novas">
          <ProductionCard
            nome="Sabonete Flor de Laranjeira"
            modelo="Vidro 250ml"
            codigo="SB001"
            quantidade={120}
            observacao="Urgente"
          />
        </KanbanColumn>

        <KanbanColumn title="A Produzir">{/* Nenhum card */}</KanbanColumn>
        <KanbanColumn title="Ordem em Produção">{/* Nenhum card */}</KanbanColumn>
        <KanbanColumn title="Finalizando Acabamento">{/* Nenhum card */}</KanbanColumn>
        <KanbanColumn title="Finalizado">{/* Nenhum card */}</KanbanColumn>
      </main>
    </div>
  );
};

export default App;