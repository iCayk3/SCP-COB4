import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, FormControlLabel, Stack, Switch, TextField, Typography
} from '@mui/material';
import {
  consultarConfiguracaoSincronizacao, salvarConfiguracaoSincronizacao
} from '@/services/cobrancas';

const horaInput = valor => valor?.slice(0, 5) || '';

export default function ConfiguracaoSincronizacaoPage() {
  const [config, setConfig] = useState(null);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  useEffect(() => {
    consultarConfiguracaoSincronizacao().then(setConfig)
      .catch(() => setErro('Não foi possível carregar os horários de sincronização.'));
  }, []);
  const salvar = async () => {
    setSalvando(true); setErro(''); setSucesso('');
    try {
      setConfig(await salvarConfiguracaoSincronizacao(config));
      setSucesso('Horários atualizados. A rotina automática já utilizará esta configuração.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Não foi possível salvar. O primeiro horário deve ser anterior ao segundo.');
    } finally { setSalvando(false); }
  };
  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Sincronização automática RBX</Typography>
      <Typography color="text.secondary">Configure as duas atualizações diárias da carteira.</Typography>
    </Box>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    {config && <Card><CardContent><Stack spacing={3}>
      <Alert severity="info">
        A sincronização é automática. Se o sistema estiver indisponível no horário, será executada
        uma única recuperação ao retornar, sem duplicar a janela.
      </Alert>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="time" label="Primeira sincronização" value={horaInput(config.horarioPrimeira)}
          InputLabelProps={{ shrink: true }} inputProps={{ step: 60 }} sx={{ minWidth: 220 }}
          onChange={e => setConfig({ ...config, horarioPrimeira: `${e.target.value}:00` })} />
        <TextField type="time" label="Segunda sincronização" value={horaInput(config.horarioSegunda)}
          InputLabelProps={{ shrink: true }} inputProps={{ step: 60 }} sx={{ minWidth: 220 }}
          onChange={e => setConfig({ ...config, horarioSegunda: `${e.target.value}:00` })} />
        <TextField label="Fuso horário" value={config.fusoHorario} sx={{ minWidth: 260 }}
          onChange={e => setConfig({ ...config, fusoHorario: e.target.value })} />
      </Stack>
      <FormControlLabel control={<Switch checked={config.ativo}
        onChange={e => setConfig({ ...config, ativo: e.target.checked })} />}
        label="Sincronização automática ativa" />
      <Button variant="contained" onClick={salvar} disabled={salvando} sx={{ alignSelf: 'flex-end' }}>
        {salvando ? 'Salvando...' : 'Salvar horários'}
      </Button>
    </Stack></CardContent></Card>}
  </Stack>;
}
