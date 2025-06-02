import axios from 'axios';
import type { OrdemProducao } from './types';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const getOPs = async (): Promise<OrdemProducao[]> => {
  const res = await api.get('/op');
  return res.data;
};

export const updateEtapa = async (id: string, etapa: string) => {
  await api.put(`/op/${id}/status`, { etapa });
};

export async function buscarOrdensProducao(): Promise<OrdemProducao[]> {
  const resposta = await fetch('http://localhost:3001/op');
  if (!resposta.ok) throw new Error('Erro ao buscar OPs');
  return resposta.json();
}