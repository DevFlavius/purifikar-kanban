import KanbanColumn from './components/KanbanColumn'
import ProductionCard from './components/ProductionCard'


function App() {
  return (
    <div className="kanban-wrapper">
      <header className="kanban-header">
        <img
          src="https://purifikar.com.br/wp-content/uploads/2023/07/logo-pfk-R-hotizontal-branca.png"
          alt="Logo Purifikar"
          className="kanban-logo"
        />
      </header>

      <main className="kanban-columns">
        <KanbanColumn title="OP Novas">
          <ProductionCard
            nome="Sabonete Flor de Laranjeira"
            modelo="Vidro 250ml"
            codigo="SB001"
            quantidade={120}
            observacao="Urgente"
          />
        </KanbanColumn>

        <KanbanColumn title="A Produzir" />
        <KanbanColumn title="Ordem em Produção" />
        <KanbanColumn title="Finalizando Acabamento" />
        <KanbanColumn title="Finalizado" />
      </main>
    </div>
  )
}

export default App