import { useEffect, useMemo, useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip,
  Grid, MenuItem, Stack, TextField, Typography
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  anonimizarTitular, atualizarPoliticaLgpd, exportarDadosTitular, listarPoliticasLgpd
} from '@/services/lgpd';

const DESTINOS = [
  ['ELIMINAR', 'Eliminar'], ['ANONIMIZAR', 'Anonimizar'], ['CONSERVAR_BLOQUEADO', 'Conservar com acesso bloqueado']
];
const STATUS = [
  ['PENDENTE_APROVACAO', 'Pendente de aprovação'], ['APROVADA', 'Aprovada'], ['REJEITADA', 'Rejeitada']
];
const cores = { APROVADA: 'success', PENDENTE_APROVACAO: 'warning', REJEITADA: 'error' };

export default function LgpdPage() {
  const [politicas, setPoliticas] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [cpfTitular, setCpfTitular] = useState('');
  const [motivoSolicitacao, setMotivoSolicitacao] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  useEffect(() => { listarPoliticasLgpd().then(setPoliticas)
    .catch(() => setErro('Não foi possível carregar o inventário LGPD.')); }, []);
  const aprovadas = useMemo(() => politicas.filter(p => p.statusAprovacao === 'APROVADA').length, [politicas]);
  const alterar = (id, campo, valor) => setPoliticas(atuais => atuais.map(p =>
    p.id === id ? { ...p, [campo]: valor } : p));
  const salvar = async politica => {
    setErro(''); setSucesso('');
    try {
      const salva = await atualizarPoliticaLgpd(politica);
      setPoliticas(atuais => atuais.map(p => p.id === salva.id ? salva : p));
      setSucesso(`${salva.categoria} atualizada.`);
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Não foi possível salvar a política.');
    }
  };
  const dadosSolicitacao = extra => ({
    cpf: cpfTitular, motivo: motivoSolicitacao, usuario: 'Administrador SGC',
    perfil: 'ADMINISTRADOR', ...extra
  });
  const exportar = async () => {
    setErro(''); setSucesso('');
    try {
      const dados = await exportarDadosTitular(dadosSolicitacao());
      const url = URL.createObjectURL(new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url;
      link.download = `dados-titular-${new Date().toISOString().slice(0, 10)}.json`; link.click();
      URL.revokeObjectURL(url); setSucesso('Exportação preparada para entrega segura ao titular.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Não foi possível exportar os dados.');
    }
  };
  const anonimizar = async () => {
    setErro(''); setSucesso('');
    try {
      await anonimizarTitular(dadosSolicitacao({ confirmacao }));
      setSucesso('Titular anonimizado e operação registrada na auditoria.');
      setCpfTitular(''); setMotivoSolicitacao(''); setConfirmacao('');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Não foi possível anonimizar o titular.');
    }
  };
  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Governança LGPD</Typography>
      <Typography color="text.secondary">Inventário, finalidade, acesso, retenção e destino dos dados pessoais.</Typography>
    </Box>
    <Alert severity={aprovadas === politicas.length && politicas.length ? 'success' : 'warning'}>
      {aprovadas} de {politicas.length} políticas aprovadas. Exclusão e anonimização automáticas permanecem
      desabilitadas até a aprovação formal e implementação do executor de retenção.
    </Alert>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}><Alert severity="info"><b>Minimização:</b> disponibilizar somente dados necessários ao papel.</Alert></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Alert severity="info"><b>Retenção:</b> prazo obrigatório antes da aprovação.</Alert></Grid>
      <Grid size={{ xs: 12, md: 4 }}><Alert severity="info"><b>Histórico:</b> códigos e auditoria permanecem rastreáveis.</Alert></Grid>
    </Grid>
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography fontWeight={700}>Solicitação do titular: exportação e anonimização</Typography>
      </AccordionSummary>
      <AccordionDetails><Stack spacing={2}>
        <Alert severity="warning">
          A anonimização é irreversível e somente será aceita quando todas as políticas estiverem aprovadas.
        </Alert>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="CPF do titular" value={cpfTitular} sx={{ minWidth: 220 }}
            onChange={e => setCpfTitular(e.target.value)} />
          <TextField label="Motivo e protocolo da solicitação" value={motivoSolicitacao} sx={{ flex: 1 }}
            onChange={e => setMotivoSolicitacao(e.target.value)} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Button variant="outlined" disabled={!cpfTitular.trim() || !motivoSolicitacao.trim()} onClick={exportar}>
            Exportar JSON
          </Button>
          <TextField label='Digite "ANONIMIZAR" para confirmar' value={confirmacao} sx={{ flex: 1 }}
            onChange={e => setConfirmacao(e.target.value)} />
          <Button color="error" variant="contained" disabled={confirmacao !== 'ANONIMIZAR'
            || !cpfTitular.trim() || !motivoSolicitacao.trim()} onClick={anonimizar}>
            Anonimizar titular
          </Button>
        </Stack>
      </Stack></AccordionDetails>
    </Accordion>
    {politicas.map(p => <Accordion key={p.id}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ sm: 'center' }}>
          <Chip size="small" label={p.codigo} color="primary" variant="outlined" />
          <Typography fontWeight={700}>{p.categoria}</Typography>
          <Chip size="small" color={cores[p.statusAprovacao]}
            label={STATUS.find(s => s[0] === p.statusAprovacao)?.[1]} />
        </Stack>
      </AccordionSummary>
      <AccordionDetails><Stack spacing={2}>
        <TextField label="Dados pessoais" value={p.dadosPessoais} multiline minRows={2}
          onChange={e => alterar(p.id, 'dadosPessoais', e.target.value)} />
        <TextField label="Finalidade" value={p.finalidade} multiline minRows={2}
          onChange={e => alterar(p.id, 'finalidade', e.target.value)} />
        <TextField label="Base legal — validar com encarregado/jurídico" value={p.baseLegal} multiline minRows={2}
          onChange={e => alterar(p.id, 'baseLegal', e.target.value)} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField label="Origem" value={p.origem} sx={{ flex: 1 }}
            onChange={e => alterar(p.id, 'origem', e.target.value)} />
          <TextField label="Perfis com acesso" value={p.perfisAcesso} sx={{ flex: 2 }}
            onChange={e => alterar(p.id, 'perfisAcesso', e.target.value)} />
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField type="number" label="Retenção (meses)" value={p.retencaoMeses ?? ''}
            helperText="Obrigatório para aprovar" inputProps={{ min: 1 }} sx={{ minWidth: 180 }}
            onChange={e => alterar(p.id, 'retencaoMeses', e.target.value ? Number(e.target.value) : null)} />
          <TextField select label="Destino após retenção" value={p.destinoFinal} sx={{ minWidth: 260 }}
            onChange={e => alterar(p.id, 'destinoFinal', e.target.value)}>
            {DESTINOS.map(([v, n]) => <MenuItem key={v} value={v}>{n}</MenuItem>)}
          </TextField>
          <TextField select label="Aprovação" value={p.statusAprovacao} sx={{ minWidth: 220 }}
            onChange={e => alterar(p.id, 'statusAprovacao', e.target.value)}>
            {STATUS.map(([v, n]) => <MenuItem key={v} value={v}>{n}</MenuItem>)}
          </TextField>
        </Stack>
        <TextField label="Registro da decisão" value={p.observacaoAprovacao || ''} multiline minRows={2}
          helperText="Informe justificativa, responsável e referência da aprovação"
          onChange={e => alterar(p.id, 'observacaoAprovacao', e.target.value)} />
        <Button variant="contained" onClick={() => salvar(p)} sx={{ alignSelf: 'flex-end' }}>Salvar política</Button>
      </Stack></AccordionDetails>
    </Accordion>)}
  </Stack>;
}
