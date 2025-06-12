import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type CriarLogParams = {
  origem: string;
  payload: any;
  foreign_id?: string;
  contexto?: string;
};

type AtualizarLogParams = {
  uuid: string;
  status: 'sucesso' | 'erro' | 'reprocessado' | 'pendente';
  response?: string;
  contexto?: string;
};

export async function criarLogIntegracao({
  origem,
  payload,
  foreign_id,
  contexto
}: CriarLogParams): Promise<string> {
  const log = await prisma.integration_logs.create({
    data: {
      origem,
      payload,
      status: 'pendente',
      foreign_id,
      contexto
    }
  });

  return log.uuid;
}

export async function atualizarLogIntegracao({
  uuid,
  status,
  response,
  contexto
}: AtualizarLogParams): Promise<void> {
  await prisma.integration_logs.update({
    where: { uuid },
    data: {
      status,
      response,
      contexto
    }
  });
}
