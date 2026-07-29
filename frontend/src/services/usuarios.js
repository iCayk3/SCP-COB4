import { api } from './api';

export async function listarUsuarios() {
  const { data } = await api.get('/usuarios');
  return data;
}

export async function criarUsuario(dados) {
  const { data } = await api.post('/usuarios', dados);
  return data;
}

export async function atualizarUsuario(id, dados) {
  const { data } = await api.put(`/usuarios/${id}`, dados);
  return data;
}
