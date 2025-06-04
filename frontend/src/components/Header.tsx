import React from 'react';
import '../style/App.css';

const Header = () => {
  return (
    <header className="kanban-header">
        <img src="https://purifikar.com.br/wp-content/uploads/2023/07/logo-pfk-R-hotizontal-branca.png" alt="Purifikar Logo" className="kanban-logo" />
        <h1 className="kanban-title">Painel de Produção - Purifikar</h1>
    </header>
  );
};

export default Header;