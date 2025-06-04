import React from 'react';
import type { Op } from '../types/Op';

interface ModalProps {
  op: Op;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ op, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Detalhes da OP</h2>
        <p><strong>Produto:</strong> {op.nome_produto}</p>
        <p><strong>Código:</strong> {op.cod_produto}</p>
        <p><strong>Quantidade:</strong> {op.quant_total}</p>
        <h3>Componentes</h3>
        <ul>
          {Object.values(op.componentes).map((comp, idx) => (
            <li key={idx}>{comp.nome} - {comp.quantidade} {comp.unidade}</li>
          ))}
        </ul>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;