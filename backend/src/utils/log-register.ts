// Importa o client do Prisma e o tipo do model
import { PrismaClient} from '@prisma/client'
// Instancia o client do Prisma
const prisma = new PrismaClient()


type IntegrationStatus = 'EM_PROCESSO' | 'ERRO' | 'SUCESSO'

type CriarLogParams = {
  origem: string
  payload: any
  foreign_id: string
  contexto?: string
  status: IntegrationStatus
}

type AtualizarLogParams = {
  foreign_id: string
  origem: string
  status: IntegrationStatus
  contexto?: string
  response?: string
}

export async function criarLogIntegracao({
  origem,
  payload,
  foreign_id,
  contexto,
  status
}: CriarLogParams) {
  try {
    const log = await prisma.integration_logs.upsert({
      where: { foreign_id },
      update: {
        origem,
        payload,
        contexto,
        status
      },
      create: {
        origem,
        payload,
        foreign_id,
        contexto,
        status: 'EM_PROCESSO'
      }
    })

    return log
  } catch (error) {
    console.error('Erro ao criar log de integração:', error)
    throw error
  }
}

export async function atualizarLogIntegracao({
  foreign_id,
  origem,
  status,
  contexto,
  response
}: AtualizarLogParams) {
  try {
    const log = await prisma.integration_logs.updateMany({
      where: {
        foreign_id,
        origem
      },
      data: {
        status,
        contexto,
        response
      }
    })

    return log
  } catch (error) {
    console.error('Erro ao atualizar log de integração:', error)
    throw error
  }
}
