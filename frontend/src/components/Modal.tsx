import React from 'react';
import type { Op } from '../types/Op';
import '../style/Modal.css'; // certifique-se que o caminho esteja correto

interface ModalProps {
  op: Op;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ op, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Detalhes da ordem de produção</h2>
        <p><strong>Produto:</strong> {op.nome_produto}</p>
        <p><strong>Código:</strong> {op.cod_produto}</p>
        <p className='modal-content-quantidade'><strong>Quantidade:</strong> {op.quant_total}un</p>
        <p className='modal-content-opnum'><strong>Observação:</strong> {op.observacao}</p>
        <div className='modal-components'>
          <h3 className='modal-components-title'>Componentes</h3>
          <ul className='modal-components-list'>
            {Object.values(op.componentes).map((comp, idx) => (
              <li key={idx}>{comp.nome} - {comp.quantidade} {comp.unidade}</li>
            ))}
          </ul>
        </div>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default Modal;