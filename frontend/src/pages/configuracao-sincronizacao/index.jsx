import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, FormControlLabel, Stack, Switch, TextField, Typography
} from '@mui/material';
import {
  consultarConfiguracaoSincronizacao,
  listarSincronizacoesRbx,
  salvarConfiguracaoSincronizacao,
  sincronizarCobrancasRbx
} from '@/services/cobrancas';

const horaInput = valor => valor?.slice(0, 5) || '';

export default function ConfiguracaoSincronizacaoPage() {
  const [config, setConfig] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);

  const carregarHistorico = async () => setHistorico(await listarSincronizacoesRbx().catch(() => []));

  useEffect(() => {
    consultarConfiguracaoSincronizacao().then(setConfig)
      .catch(() => setErro('Nao foi possivel carregar os horarios de sincronizacao.'));
    carregarHistorico();
  }, []);

  const salvar = async () => {
    setSalvando(true); setErro(''); setSucesso('');
    try {
      setConfig(await salvarConfiguracaoSincronizacao(config));
      setSucesso('Horarios atualizados. A rotina automatica ja usara esta configuracao.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Nao foi possivel salvar. O primeiro horario deve ser anterior ao segundo.');
    } finally { setSalvando(false); }
  };

  const sincronizarAgora = async () => {
    setSincronizando(true); setErro(''); setSucesso('');
    try {
      await sincronizarCobrancasRbx();
      setSucesso('Sincronizacao manual concluida.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Falha na sincronizacao manual.');
    } finally {
      await carregarHistorico();
      setSincronizando(false);
    }
  };

  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Sincronizacao automatica RBX</Typography>
      <Typography color="text.secondary">Configure as duas atualizacoes diarias da carteira.</Typography>
    </Box>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    {config && <Card><CardContent><Stack spacing={3}>
      <Alert severity="info">
        A sincronizacao e automatica. Se o sistema estiver indisponivel no horario, a execucao fica
        registrada no historico e pode ser repetida manualmente.
      </Alert>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField type="time" label="Primeira sincronizacao" value={horaInput(config.horarioPrimeira)}
          InputLabelProps={{ shrink: true }} inputProps={{ step: 60 }} sx={{ minWidth: 220 }}
          onChange={e => setConfig({ ...config, horarioPrimeira: `${e.target.value}:00` })} />
        <TextField type="time" label="Segunda sincronizacao" value={horaInput(config.horarioSegunda)}
          InputLabelProps={{ shrink: true }} inputProps={{ step: 60 }} sx={{ minWidth: 220 }}
          onChange={e => setConfig({ ...config, horarioSegunda: `${e.target.value}:00` })} />
        <TextField label="Fuso horario" value={config.fusoHorario} sx={{ minWidth: 260 }}
          onChange={e => setConfig({ ...config, fusoHorario: e.target.value })} />
      </Stack>
      <FormControlLabel control={<Switch checked={config.ativo}
        onChange={e => setConfig({ ...config, ativo: e.target.checked })} />}
        label="Sincronizacao automatica ativa" />
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" onClick={sincronizarAgora} disabled={sincronizando}>
          {sincronizando ? 'Sincronizando...' : 'Sincronizar agora'}
        </Button>
        <Button variant="contained" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar horarios'}
        </Button>
      </Stack>
    </Stack></CardContent></Card>}
    <Card><CardContent><Stack spacing={1.5}>
      <Typography variant="h6">Historico de execucoes</Typography>
      {!historico.length && <Typography color="text.secondary">Nenhuma sincronizacao registrada.</Typography>}
      {historico.map(item => <Stack key={item.id} direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" gap={1} borderBottom={1} borderColor="divider" py={1}>
        <Box>
          <Typography fontWeight={700}>{item.origem}</Typography>
          <Typography variant="caption" color="text.secondary">
            {item.iniciadaEm ? new Date(item.iniciadaEm).toLocaleString('pt-BR') : 'Sem data'} - {item.duracaoMs} ms
          </Typography>
          {item.mensagem && <Typography variant="body2" color="text.secondary">{item.mensagem}</Typography>}
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip size="small" color={item.status === 'SUCESSO' ? 'success' : 'error'} label={item.status} />
          <Chip size="small" label={`${item.cobrancasCriadas ?? 0} protocolo(s)`} />
          <Chip size="small" label={`${item.boletosCriados ?? 0} boleto(s)`} />
        </Stack>
      </Stack>)}
    </Stack></CardContent></Card>
  </Stack>;
}
