import { useEffect, useState } from 'react';
import { Alert, Box, Button, Chip, CircularProgress, Divider, Link, Stack, TextField, Typography } from '@mui/material';
import {
  atualizarAgendamento, baixarAnexo, criarAgendamento, listarAgenda, listarAnexos,
  listarAtualizacoes, solicitarAtualizacao
} from '@/services/atendimentos';

const local = valor => valor ? new Date(valor).toLocaleString('pt-BR') : '-';

export function Anexos({ processo }) {
  const [itens, setItens] = useState([]); const [erro, setErro] = useState(''); const [carregando, setCarregando] = useState(true);
  useEffect(() => { setCarregando(true); listarAnexos(processo.referencia).then(setItens).catch(() => setErro('Falha ao consultar anexos.')).finally(() => setCarregando(false)); }, [processo.referencia]);
  if (carregando) return <CircularProgress size={24} aria-label="Carregando anexos" />;
  return <Stack spacing={1.5}>{erro && <Alert severity="error">{erro}</Alert>}
    {!itens.length && <Typography color="text.secondary">Nenhum anexo neste protocolo.</Typography>}
    {itens.map(item => <Box key={item.id} border={1} borderColor="divider" borderRadius={2} p={1.5}>
      <Link component="button" variant="body2" fontWeight={700} onClick={() => baixarAnexo(processo.referencia, item)}>{item.nome}</Link>
      <Typography variant="caption" display="block" color="text.secondary">{item.tipo} · {(item.tamanho / 1024).toFixed(1)} KB · {local(item.enviadoEm)}</Typography>
      <Typography variant="caption" display="block" color="text.disabled">SHA-256: {item.sha256.slice(0, 16)}…</Typography>
    </Box>)}
  </Stack>;
}

export function Agenda({ processo }) {
  const [itens, setItens] = useState([]); const [erro, setErro] = useState('');
  const [form, setForm] = useState({ titulo: '', inicioEm: '', fimEm: '', observacao: '' });
  const carregar = () => listarAgenda(processo.referencia).then(pagina => setItens(pagina.itens)).catch(() => setErro('Falha ao consultar agenda.'));
  useEffect(carregar, [processo.referencia]);
  const salvar = async () => { setErro(''); try { await criarAgendamento(processo.referencia, { ...form, inicioEm: new Date(form.inicioEm).toISOString(), fimEm: new Date(form.fimEm).toISOString() }); setForm({ titulo: '', inicioEm: '', fimEm: '', observacao: '' }); carregar(); } catch (e) { setErro(e.response?.data?.erro || 'Confira os dados do agendamento.'); } };
  const concluir = async item => { await atualizarAgendamento(processo.referencia, item.id, 'CONCLUIDO'); carregar(); };
  return <Stack spacing={2}>{erro && <Alert severity="error">{erro}</Alert>}
    <TextField size="small" required label="Título" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} />
    <TextField size="small" required type="datetime-local" label="Início" slotProps={{ inputLabel: { shrink: true } }} value={form.inicioEm} onChange={e => setForm({ ...form, inicioEm: e.target.value })} />
    <TextField size="small" required type="datetime-local" label="Fim" slotProps={{ inputLabel: { shrink: true } }} value={form.fimEm} onChange={e => setForm({ ...form, fimEm: e.target.value })} />
    <TextField size="small" label="Observação" value={form.observacao} onChange={e => setForm({ ...form, observacao: e.target.value })} />
    <Button variant="contained" disabled={!form.titulo || !form.inicioEm || !form.fimEm} onClick={salvar}>Agendar</Button>
    <Divider />
    {!itens.length && <Typography color="text.secondary">Agenda livre.</Typography>}
    {itens.map(item => <Box key={item.id} borderLeft={3} borderColor={item.status === 'AGENDADO' ? 'warning.main' : 'success.main'} pl={1.5}>
      <Typography variant="body2" fontWeight={700}>{item.titulo}</Typography><Typography variant="caption">{local(item.inicioEm)} até {local(item.fimEm)}</Typography>
      <Stack direction="row" gap={1} mt={.5}><Chip size="small" label={item.status} />{item.status === 'AGENDADO' && <Button size="small" onClick={() => concluir(item)}>Concluir</Button>}</Stack>
    </Box>)}
  </Stack>;
}

export function AtualizacaoCadastral({ processo }) {
  const [itens, setItens] = useState([]); const [erro, setErro] = useState('');
  const [form, setForm] = useState({ telefone: processo.telefone || '', email: processo.email || '', motivo: '' });
  const carregar = () => listarAtualizacoes(processo.cpf).then(setItens).catch(() => setErro('Falha ao consultar solicitações.'));
  useEffect(carregar, [processo.cpf]);
  const solicitar = async () => { try { await solicitarAtualizacao(processo.cpf, form); setForm({ ...form, motivo: '' }); carregar(); } catch (e) { setErro(e.response?.data?.erro || e.response?.data?.message || 'Não foi possível solicitar a atualização.'); } };
  return <Stack spacing={2}>{erro && <Alert severity="error">{erro}</Alert>}
    <Alert severity="info">Alterações são auditadas e só entram em vigor após aprovação da supervisão.</Alert>
    <TextField size="small" label="Novo telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
    <TextField size="small" type="email" label="Novo e-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
    <TextField required size="small" multiline minRows={2} label="Motivo da atualização" value={form.motivo} onChange={e => setForm({ ...form, motivo: e.target.value })} />
    <Button variant="contained" disabled={!form.motivo.trim()} onClick={solicitar}>Enviar para aprovação</Button><Divider />
    {itens.map(item => <Box key={item.id}><Chip size="small" label={item.status} color={item.status === 'APROVADA' ? 'success' : item.status === 'REJEITADA' ? 'error' : 'warning'} /><Typography variant="caption" display="block">{item.motivo} · {local(item.solicitadoEm)}</Typography></Box>)}
  </Stack>;
}
