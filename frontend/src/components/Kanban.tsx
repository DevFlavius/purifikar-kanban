import React, { useEffect, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import ProductionCard from './ProductionCard';
import type { OrdemProducao } from '../types';
import { buscarOrdensProducao } from '../api';

const Kanban: React.FC = () => {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);

  useEffect(() => {
    const carregarOrdens = async () => {
      try {
        const dados = await buscarOrdensProducao();
        setOrdens(dados);
      } catch (erro) {
        console.error('Erro ao buscar OPs:', erro);
      }
    };

    carregarOrdens();
  }, []);

  const etapas: { titulo: string; chave: OrdemProducao['etapa'] }[] = [
    { titulo: 'OP Novas', chave: 'nova' },
    { titulo: 'A Produzir', chave: 'a_produzir' },
    { titulo: 'Ordem em Produção', chave: 'em_producao' },
    { titulo: 'Finalizando Acabamento', chave: 'acabamento' },
    { titulo: 'Finalizado', chave: 'finalizado' },
  ];

  return (
    
    <div className="flex gap-4 p-6 bg-gray-50 min-h-screen overflow-x-auto">
      {etapas.map(({ titulo, chave }) => (
        <KanbanColumn key={chave} title={titulo}>
          {ordens
            .filter((op) => op.etapa === chave)
            .map((op) => (
              <ProductionCard
                key={op.id}
                nome={op.nome_produto}
                modelo={op.id_produto}
                codigo={op.cod_produto}
                quantidade={op.quant_total}
                observacao={op.componentes}
              />
            ))}
        </KanbanColumn>
      ))}
    </div>
    
  );
};

export default Kanban;