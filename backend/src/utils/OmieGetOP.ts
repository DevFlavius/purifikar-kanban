// backend/src/services/omieService.ts

import axios from 'axios';

const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';

/**
 * Consulta os detalhes de uma Ordem de Produção na API da Omie.
 * @param nCodOP - O código da Ordem de Produção a ser consultada.
 * @returns A string contendo a observação (cObs) da OP ou null se não for encontrada.
 */

export interface OrdemProducaoInfo {
  cObs: string;
  nQtde: number;
}

export async function consultarOrdemProducao(nCodOP: number): Promise<OrdemProducaoInfo | null> {
  try {
    const response = await axios.post(OMIE_API_URL, {
      call: 'ConsultarOrdemProducao',
      app_key: process.env.OMIE_APP_KEY,
      app_secret: process.env.OMIE_APP_SECRET,
      param: [{ nCodOP }],
    });

    if (response.data && response.data.observacoes?.cObs) {
      return {
        cObs: response.data.observacoes.cObs,
        nQtde: response.data.identificacao.nQtde,
      };
    }

    return null;
  } catch (error) {
    console.error(`Erro ao consultar OP ${nCodOP} na Omie:`, error);
    // Você pode querer registrar esse erro de forma mais robusta
    // usando a função logRegister que já existe no projeto.
    throw new Error('Falha ao comunicar com a API da Omie.');
  }
}