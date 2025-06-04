export interface Componente {
  nome: string;
  unidade: string;
  quantidade: number;
}

export interface Op {
  id: string;
  id_produto: string;
  cod_produto: string;
  nome_produto: string;
  etapa: string;
  quant_total: number;
  op_num: string;
  dt_previsao: string;
  componentes: Record<string, Componente>;
  observacao: string;
}