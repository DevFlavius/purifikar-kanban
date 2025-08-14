import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OMIE_APP_KEY = process.env.OMIE_APP_KEY;
const OMIE_APP_SECRET = process.env.OMIE_APP_SECRET;
const OMIE_API_URL = 'https://app.omie.com.br/api/v1/produtos/op/';

// Interface atualizada para o payload da requisição "AlterarOrdemProducao"
interface OmieAlterarRequestPayload {
  call: string;
  app_key: string;
  app_secret: string;
  param: Array<{
    identificacao: {
      nCodOP: string;
    };
    infAdicionais: Array<{
      cEtapa: string;
    }>;
  }>;
}

// Função atualizada para usar a nova operação e o novo payload
export async function updateOmieOrderStatus(
  nCodOP: string,
  cEtapa: string
): Promise<any> {
  const payload: OmieAlterarRequestPayload = {
    call: 'AlterarOrdemProducao', // Operação alterada
    app_key: OMIE_APP_KEY!,
    app_secret: OMIE_APP_SECRET!,
    param: [
      {
        identificacao: {
          nCodOP: nCodOP,
        },
        infAdicionais: [
          {
            cEtapa: cEtapa,
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(OMIE_API_URL, payload);
    console.log('Resposta da API Omie:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Erro ao atualizar status da OP na Omie:',
        error.response ? error.response.data : error.message
      );
    } else if (error instanceof Error) {
      console.error('Erro ao atualizar status da OP na Omie:', error.message);
    } else {
      console.error(
        'Erro ao atualizar status da OP na Omie: Erro desconhecido',
        error
      );
    }
    throw error;
  }
}

