export type Etapa =
  | 'nova'
  | 'a_produzir'
  | 'em_producao'
  | 'acabamento'
  | 'finalizado';

export interface OrdemProducao {
  id: string;
  id_produto: string;
  cod_produto: string;
  nome_produto: string;
  etapa: Etapa;
  quant_total: number;
  op_num: string;
  dt_previsao: string;
  componentes: string;
}