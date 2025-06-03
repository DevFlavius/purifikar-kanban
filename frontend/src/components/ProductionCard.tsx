import React from 'react';

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
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-3 shadow hover:shadow-lg transition">
      <p className="font-bold">{nome}</p>
      <p className="text-sm">Modelo: {modelo}</p>
      <p className="text-xs text-gray-600">Cód: {codigo}</p>
      <p className="text-text-sm font-medium">Qtd: {quantidade}</p>
      {observacao && <p className="text-xs text-red-600 font-bold mt-1">Obs: {observacao}</p>}
    </div>
  );
};

export default ProductionCard;