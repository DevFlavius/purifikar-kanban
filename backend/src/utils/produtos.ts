export function formatarData(data: string): string | null {
  if (!data) {
    return null;
  }
  const partes = data.split('/');
  if (partes.length !== 3) {
    return null;
  }
  const dia = partes[0];
  const mes = partes[1];
  const ano = partes[2];
  return `${ano}-${mes}-${dia}`;
}