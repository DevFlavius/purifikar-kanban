import axios from 'axios';

interface OmieProductStructureRequest {
  call: string;
  app_key: string;
  app_secret: string;
  param: Array<{ idProduto?: number; intProduto?: string; codProduto?: string }>;
}

interface OmieProductStructureResponse {
  ident: {
    idProduto: number;
    intProduto: string;
    codProduto: string;
    descrProduto: string;
    tipoProduto: string;
    idFamilia: number;
    codFamilia: string;
    descrFamilia: string;
    unidProduto: string;
    pesoLiqProduto: number;
    pesoBrutoProduto: number;
  };
  observacoes: {};
  custoProducao: {
    vGGF: number;
    vMOD: number;
  };
  itens: Array<{
    idMalha: number;
    intMalha: string;
    idProdMalha: number;
    intProdMalha: string;
    codProdMalha: string;
    descrProdMalha: string;
    quantProdMalha: number;
    unidProdMalha: string;
    tipoProdMalha: string;
    idFamMalha: number;
    codFamMalha: string;
    descrFamMalha: string;
    pesoLiqProdMalha: number;
    pesoBrutoProdMalha: number;
    percPerdaProdMalha: number;
    obsProdMalha: string;
    dIncProdMalha: string;
    hIncProdMalha: string;
    uIncProdMalha: string;
    dAltProdMalha: string;
    hAltProdMalha: string;
    uAltProdMalha: string;
  }>;
}

export async function getOmieProductStructure(productId: string): Promise<OmieProductStructureResponse | null> {
  const OMIE_API_URL = 'https://app.omie.com.br/api/v1/geral/malha/';
  const APP_KEY = process.env.OMIE_APP_KEY;
  const APP_SECRET = process.env.OMIE_APP_SECRET;

  if (!APP_KEY || !APP_SECRET) {
    console.error('OMIE_APP_KEY or OMIE_APP_SECRET not set in environment variables.');
    return null;
  }

  const requestBody: OmieProductStructureRequest = {
    call: 'ConsultarEstrutura',
    app_key: APP_KEY,
    app_secret: APP_SECRET,
    param: [{
      codProduto: productId
    }]
  };

  try {
    const response = await axios.post<OmieProductStructureResponse>(OMIE_API_URL, requestBody);
    return response.data;
  } catch (error) {
    console.error('Erro ao consultar estrutura do produto na Omie:', error);
    return null;
  }
}

