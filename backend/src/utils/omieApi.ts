import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';

interface OmieUpsertRequestPayload {
  call: string;
  app_key: string;
  app_secret: string;
  param: Array<{
    copUpsertRequest: {
      identificacao: {
        cCodIntOP: string; // ID da OP no Kanban
        nCodOP?: number; // Código da OP na Omie, se já existir
        nCodProduto?: number; // Código do produto
        nQtde?: number; // Quantidade a produzir
        dDtPrevisao?: string; // Data de previsão
        cCodStatus?: string; // Status da OP
      };
    };
  }>;
}

export async function updateOmieOrderStatus(
  opId: string,
  omieStatus: string,
  nCodOP?: number,
  nCodProduto?: number,
  nQtde?: number,
  dDtPrevisao?: string
): Promise<any> {
  const mappedStatus = omieEtapaMapping[omieStatus] || omieStatus;

  const payload: OmieUpsertRequestPayload = {
    call: 'UpsertOrdemProducao',
    app_key: OMIE_APP_KEY!,
    app_secret: OMIE_APP_SECRET!,
    param: [
      {
        copUpsertRequest: {
          identificacao: {
            cCodIntOP: opId,
            // Inclui apenas os campos válidos diretamente aqui:
            ...(nCodOP !== undefined && { nCodOP }),
            ...(nCodProduto !== undefined && { nCodProduto }),
            ...(nQtde !== undefined && { nQtde }),
            ...(dDtPrevisao !== undefined && { dDtPrevisao }),
            // E se quiser registrar o status, use como comentário ou log, não dentro do payload
          }
        }
      }
    ]
  };

  // Adiciona campos opcionais se fornecidos
  if (nCodOP) payload.param[0].copUpsertRequest.identificacao.nCodOP = nCodOP;
  if (nCodProduto) payload.param[0].copUpsertRequest.identificacao.nCodProduto = nCodProduto;
  if (nQtde) payload.param[0].copUpsertRequest.identificacao.nQtde = nQtde;
  if (dDtPrevisao) payload.param[0].copUpsertRequest.identificacao.dDtPrevisao = dDtPrevisao;

  try {
    const response = await axios.post(OMIE_API_URL, payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("Erro ao atualizar status da OP na Omie:", error.response ? error.response.data : error.message);
    } else if (error instanceof Error) {
      console.error("Erro ao atualizar status da OP na Omie:", error.message);
    } else {
      console.error("Erro ao atualizar status da OP na Omie: Erro desconhecido", error);
    }
    throw error;
  }
}

// Mapeamento de etapas do Kanban para códigos Omie
export const omieEtapaMapping: { [key: string]: string } = {
  '10': 'nova',
  '15': 'a_produzir',
  '20': 'em_producao',
  '30': 'acabamento',
  '60': 'finalizado',
};


