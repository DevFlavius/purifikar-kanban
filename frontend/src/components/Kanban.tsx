import { useEffect, useState } from 'react';
import type { OrdemProducao } from '../types';
import { buscarOrdensProducao } from '../api';

function Kanban() {
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);

  useEffect(() => {
    async function carregar() {
      const dados = await buscarOrdensProducao();
      console.log(dados);
      setOrdens(dados);
    }

    carregar();
  }, []);

  return (
    <div>
      <h1>Painel de Produção</h1>
      {/* Aqui você renderiza os cards */}
    </div>
  );
}
