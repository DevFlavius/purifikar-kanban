# Frontend - Purifikar Kanban

Este diretório contém o código-fonte do frontend da aplicação Purifikar Kanban, responsável pela interface de usuário interativa e visualização das Ordens de Produção.

## 🚀 Tecnologias Utilizadas

*   **React + TypeScript**: Biblioteca JavaScript para construir interfaces de usuário, combinada com TypeScript para adicionar tipagem estática, resultando em um código mais robusto e fácil de manter.
*   **Vite**: Uma ferramenta de build de frontend de próxima geração que oferece uma experiência de desenvolvimento extremamente rápida, com hot module replacement (HMR) instantâneo.
*   **DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`)**: Uma biblioteca de arrastar e soltar moderna, leve e acessível para React. Utilizada para implementar a funcionalidade de drag and drop das Ordens de Produção entre as colunas do Kanban.
*   **TailwindCSS (parcial)**: Um framework CSS 


utilitário que permite construir designs personalizados rapidamente, utilizado de forma parcial para estilização.
*   **CSS customizado**: Além do TailwindCSS, há estilos CSS personalizados para componentes específicos, como cards e modais, e para garantir a responsividade da interface em diferentes tamanhos de tela.
*   **Axios**: Cliente HTTP baseado em Promises para o navegador e Node.js, utilizado para fazer requisições assíncronas ao backend da aplicação.

## 🧩 Funcionalidades do Frontend

*   **Painel Kanban Interativo**: Exibe as Ordens de Produção em 5 colunas distintas (`Nova`, `A Produzir`, `Em Produção`, `Acabamento`, `Finalizado`), representando as etapas do fluxo de trabalho.
*   **Drag and Drop de OPs**: Permite que os usuários arrastem e soltem as Ordens de Produção entre as colunas, atualizando seu status de forma visual e intuitiva.
*   **Modal de Detalhes da OP**: Ao clicar em uma Ordem de Produção, um modal é exibido com informações detalhadas sobre a OP, incluindo componentes, observações e outros dados relevantes.
*   **Design Responsivo**: A interface é otimizada para funcionar em diversos dispositivos e tamanhos de tela, proporcionando uma experiência de usuário consistente.
*   **Animações Suaves**: Elementos visuais com animações para uma experiência de usuário mais fluida e agradável.

## ⚙️ Como Rodar Localmente

1.  **Navegue até o diretório do frontend:**
    ```bash
    cd purifikar-kanban/frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O frontend estará acessível em `http://localhost:5173` (ou outra porta que o Vite possa indicar).

## 📂 Estrutura do Projeto

*   `src/`
    *   `App.tsx`: Componente principal da aplicação.
    *   `main.tsx`: Ponto de entrada da aplicação React.
    *   `components/`: Contém os componentes reutilizáveis da interface (e.g., `CardOP`, `KanbanColumn`, `Modal`).
    *   `hooks/`: Ganchos personalizados do React para lógica reutilizável.
    *   `styles/`: Arquivos de estilo CSS/TailwindCSS.
    *   `types/`: Definições de tipos TypeScript para os dados da aplicação.
*   `public/`: Ativos estáticos como imagens e ícones.
*   `package.json`: Define as dependências do projeto e scripts de execução.
*   `tsconfig.json`: Configurações do TypeScript para o projeto frontend.
*   `vite.config.ts`: Configurações do Vite para o projeto.


