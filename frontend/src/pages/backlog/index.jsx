import { useEffect, useMemo, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip,
  Grid, MenuItem, Stack, TextField, Typography
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { atualizarBacklog, listarBacklog } from '@/services/planejamento';

const PRIORIDADES = ['P0', 'P1', 'P2', 'P3'];
const STATUS = [
  ['NAO_INICIADO', 'Não iniciado'], ['EM_ANDAMENTO', 'Em andamento'],
  ['IMPLEMENTADO', 'Implementado'], ['BLOQUEADO', 'Bloqueado']
];
const corStatus = { IMPLEMENTADO: 'success', EM_ANDAMENTO: 'warning', BLOQUEADO: 'error', NAO_INICIADO: 'default' };

export default function BacklogPage() {
  const [itens, setItens] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  useEffect(() => { listarBacklog().then(setItens).catch(() => setErro('Não foi possível carregar o backlog.')); }, []);
  const grupos = useMemo(() => PRIORIDADES.map(p => [p, itens.filter(i => i.prioridade === p)]), [itens]);
  const alterar = (id, campo, valor) => setItens(atuais => atuais.map(i => i.id === id ? { ...i, [campo]: valor } : i));
  const salvar = async item => {
    setErro(''); setSucesso('');
    try {
      const salvo = await atualizarBacklog(item);
      setItens(atuais => atuais.map(i => i.id === salvo.id ? salvo : i));
      setSucesso(`${salvo.codigo} atualizado.`);
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Não foi possível atualizar o item.');
    }
  };
  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Backlog priorizado</Typography>
      <Typography color="text.secondary">Plano macro convertido em entregas, prioridade e critérios verificáveis.</Typography>
    </Box>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    <Grid container spacing={2}>
      {grupos.map(([prioridade, lista]) => <Grid key={prioridade} size={{ xs: 6, md: 3 }}>
        <Alert severity={prioridade === 'P0' ? 'error' : prioridade === 'P1' ? 'warning' : 'info'}>
          <b>{prioridade}</b> — {lista.length} item(ns)
        </Alert>
      </Grid>)}
    </Grid>
    {grupos.map(([prioridade, lista]) => <Stack key={prioridade} spacing={1}>
      <Typography variant="h6">{prioridade}</Typography>
      {lista.map(item => <Accordion key={item.id}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ sm: 'center' }}>
            <Chip size="small" label={item.codigo} color="primary" />
            <Typography fontWeight={600}>{item.titulo}</Typography>
            <Chip size="small" label={STATUS.find(s => s[0] === item.status)?.[1]}
              color={corStatus[item.status]} />
          </Stack>
        </AccordionSummary>
        <AccordionDetails><Stack spacing={2}>
          <TextField label="Título" size="small" value={item.titulo}
            onChange={e => alterar(item.id, 'titulo', e.target.value)} />
          <TextField label="Descrição" size="small" multiline minRows={2} value={item.descricao}
            onChange={e => alterar(item.id, 'descricao', e.target.value)} />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField select label="Prioridade" size="small" value={item.prioridade} sx={{ minWidth: 140 }}
              onChange={e => alterar(item.id, 'prioridade', e.target.value)}>
              {PRIORIDADES.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            <TextField select label="Status" size="small" value={item.status} sx={{ minWidth: 190 }}
              onChange={e => alterar(item.id, 'status', e.target.value)}>
              {STATUS.map(([v, n]) => <MenuItem key={v} value={v}>{n}</MenuItem>)}
            </TextField>
            <TextField label="Responsável" size="small" value={item.responsavel || ''} sx={{ flex: 1 }}
              onChange={e => alterar(item.id, 'responsavel', e.target.value)} />
          </Stack>
          <TextField label="Critério de aceite" size="small" multiline minRows={2} value={item.criterioAceite}
            onChange={e => alterar(item.id, 'criterioAceite', e.target.value)} />
          <Button variant="contained" onClick={() => salvar(item)} sx={{ alignSelf: 'flex-end' }}>Salvar item</Button>
        </Stack></AccordionDetails>
      </Accordion>)}
    </Stack>)}
  </Stack>;
}
