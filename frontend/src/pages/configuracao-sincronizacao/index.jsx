import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider,
  FormControlLabel, Stack, Switch, TextField, Typography
} from '@mui/material';
import { RoleBasedGuard } from '@/components/auth';
import {
  consultarConfiguracaoSincronizacao,
  listarFalhasSincronizacoesRbx,
  listarSincronizacoesRbx,
  reconciliarCobrancasRbx,
  reprocessarFalhaSincronizacaoRbx,
  salvarConfiguracaoSincronizacao,
  sincronizarCobrancasRbx
} from '@/services/cobrancas';

const horaInput = valor => valor?.slice(0, 5) || '';
const dataHora = valor => valor ? new Date(valor).toLocaleString('pt-BR') : '—';
const mensagemErro = (error, padrao) =>
  error.response?.data?.message || error.response?.data?.erro || padrao;

const statusFalha = {
  PENDENTE: { label: 'Pendente', color: 'warning' },
  PROCESSANDO: { label: 'Processando', color: 'info' },
  RESOLVIDA: { label: 'Resolvida', color: 'success' },
  ESGOTADA: { label: 'Esgotada', color: 'error' }
};

function ConfiguracaoSincronizacaoContent() {
  const [config, setConfig] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [falhas, setFalhas] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [reconciliando, setReconciliando] = useState(false);
  const [reprocessandoId, setReprocessandoId] = useState(null);
  const [carregandoFalhas, setCarregandoFalhas] = useState(true);

  const carregarHistorico = async () => setHistorico(await listarSincronizacoesRbx().catch(() => []));
  const carregarFalhas = async () => {
    setCarregandoFalhas(true);
    try {
      setFalhas(await listarFalhasSincronizacoesRbx());
    } catch {
      setErro('Não foi possível carregar a fila de falhas RBX.');
    } finally {
      setCarregandoFalhas(false);
    }
  };

  useEffect(() => {
    consultarConfiguracaoSincronizacao().then(setConfig)
      .catch(() => setErro('Não foi possível carregar os horários de sincronização.'));
    carregarHistorico();
    carregarFalhas();
  }, []);

  const salvar = async () => {
    setSalvando(true); setErro(''); setSucesso('');
    try {
      setConfig(await salvarConfiguracaoSincronizacao(config));
      setSucesso('Horários atualizados. A rotina automática já usará esta configuração.');
    } catch (error) {
      setErro(mensagemErro(error, 'Não foi possível salvar. O primeiro horário deve ser anterior ao segundo.'));
    } finally { setSalvando(false); }
  };

  const sincronizarAgora = async () => {
    setSincronizando(true); setErro(''); setSucesso('');
    try {
      await sincronizarCobrancasRbx();
      setSucesso('Sincronização manual concluída.');
    } catch (error) {
      setErro(mensagemErro(error, 'Falha na sincronização manual.'));
    } finally {
      await Promise.all([carregarHistorico(), carregarFalhas()]);
      setSincronizando(false);
    }
  };

  const reconciliar = async () => {
    setReconciliando(true); setErro(''); setSucesso('');
    try {
      const resultado = await reconciliarCobrancasRbx();
      setSucesso(`Reconciliação concluída: ${resultado.boletosCriados ?? 0} boleto(s) criado(s) e `
        + `${resultado.boletosAtualizados ?? 0} atualizado(s).`);
    } catch (error) {
      setErro(mensagemErro(error, 'Falha ao reconciliar os dados com o RBX.'));
    } finally {
      await Promise.all([carregarHistorico(), carregarFalhas()]);
      setReconciliando(false);
    }
  };

  const reprocessar = async id => {
    setReprocessandoId(id); setErro(''); setSucesso('');
    try {
      await reprocessarFalhaSincronizacaoRbx(id);
      setSucesso(`Falha #${id} reprocessada e resolvida.`);
    } catch (error) {
      setErro(mensagemErro(error, `Não foi possível reprocessar a falha #${id}.`));
    } finally {
      await Promise.all([carregarHistorico(), carregarFalhas()]);
      setReprocessandoId(null);
    }
  };

  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Sincronização e recuperação RBX</Typography>
      <Typography color="text.secondary">
        Configure a rotina, acompanhe falhas e reconcilie a carteira com segurança.
      </Typography>
    </Box>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    {config && <Card><CardContent><Stack spacing={3}>
      <Alert severity="info">
        Falhas transitórias recebem novas tentativas automaticamente. Se o limite imediato for
        atingido, a execução entra na fila persistente para reprocessamento com backoff.
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
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={1}>
        <Button variant="outlined" color="warning" onClick={reconciliar}
          disabled={reconciliando || sincronizando}>
          {reconciliando ? 'Reconciliando...' : 'Reconciliar com RBX'}
        </Button>
        <Button variant="outlined" onClick={sincronizarAgora} disabled={sincronizando}>
          {sincronizando ? 'Sincronizando...' : 'Sincronizar agora'}
        </Button>
        <Button variant="contained" onClick={salvar} disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar horários'}
        </Button>
      </Stack>
    </Stack></CardContent></Card>}

    <Card><CardContent><Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between"
        alignItems={{ sm: 'center' }} gap={1}>
        <Box>
          <Typography variant="h6">Fila de falhas</Typography>
          <Typography variant="body2" color="text.secondary">
            Reprocessamentos automáticos e intervenções administrativas.
          </Typography>
        </Box>
        <Button size="small" onClick={carregarFalhas} disabled={carregandoFalhas}>Atualizar fila</Button>
      </Stack>
      {carregandoFalhas && <Box textAlign="center" py={2}><CircularProgress size={28} /></Box>}
      {!carregandoFalhas && !falhas.length &&
        <Alert severity="success">Nenhuma falha de sincronização registrada.</Alert>}
      {!carregandoFalhas && falhas.map((item, indice) => {
        const status = statusFalha[item.status] || { label: item.status, color: 'default' };
        const podeReprocessar = item.status === 'PENDENTE' || item.status === 'ESGOTADA';
        return <Box key={item.id}>
          {indice > 0 && <Divider sx={{ mb: 2 }} />}
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography fontWeight={700}>Falha #{item.id}</Typography>
                <Chip size="small" color={status.color} label={status.label} />
                <Chip size="small" variant="outlined"
                  label={`${item.tentativas}/${item.maxTentativas} tentativa(s)`} />
              </Stack>
              <Typography variant="body2" mt={0.75}>{item.mensagem || 'Sem detalhe informado.'}</Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                Origem: {item.origem} · Criada em {dataHora(item.criadaEm)}
              </Typography>
              {item.status === 'PENDENTE' && <Typography variant="caption" color="warning.main">
                Próxima tentativa automática: {dataHora(item.proximaTentativaEm)}
              </Typography>}
              {item.status === 'RESOLVIDA' && <Typography variant="caption" color="success.main">
                Resolvida em {dataHora(item.resolvidaEm)}
              </Typography>}
            </Box>
            <Button variant="contained" size="small" onClick={() => reprocessar(item.id)}
              disabled={!podeReprocessar || reprocessandoId !== null}
              sx={{ alignSelf: { xs: 'stretch', md: 'center' }, whiteSpace: 'nowrap' }}>
              {reprocessandoId === item.id ? 'Reprocessando...' : 'Reprocessar agora'}
            </Button>
          </Stack>
        </Box>;
      })}
    </Stack></CardContent></Card>

    <Card><CardContent><Stack spacing={1.5}>
      <Typography variant="h6">Histórico de execuções</Typography>
      {!historico.length && <Typography color="text.secondary">Nenhuma sincronização registrada.</Typography>}
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

export default function ConfiguracaoSincronizacaoPage() {
  return <RoleBasedGuard roles={['administrator', 'admin']}>
    <ConfiguracaoSincronizacaoContent />
  </RoleBasedGuard>;
}
