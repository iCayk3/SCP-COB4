import { api } from './api';

export async function listarMotivos({ tipo, somenteAtivos = true } = {}) {
  const { data } = await api.get('/catalogos/motivos', {
    params: { ...(tipo ? { tipo } : {}), somenteAtivos }
  });
  return data;
}

export async function salvarMotivos(motivos) {
  const { data } = await api.put('/catalogos/motivos', motivos);
  return data;
}
