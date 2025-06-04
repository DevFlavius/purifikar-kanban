import React from 'react';
import '../style/App.css';

interface ProductionCardProps {
  nome: string;
  modelo: string;
  codigo: string;
  quantidade: number;
  observacao: string;
}

const ProductionCard: React.FC<ProductionCardProps> = ({
  nome,
  modelo,
  codigo,
  quantidade,
  observacao
}) => {
  return (
    <div className="production-card">
      <p className="production-card-nome">{nome}</p>
      <p className="production-card-modelo">Modelo: {modelo}</p>
      <p className="production-card-codigo">Cód: {codigo}</p>
      <p className="production-card-quantidade">Qtd: {quantidade}</p>
      {observacao && <p className="production-card-observacao">Obs: {observacao}</p>}
    </div>
  );
};

export default ProductionCard;