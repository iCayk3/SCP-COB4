import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import AssignmentLateRounded from '@mui/icons-material/AssignmentLateRounded';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import GroupsRounded from '@mui/icons-material/GroupsRounded';
import HandshakeRounded from '@mui/icons-material/HandshakeRounded';
import NotificationsActiveRounded from '@mui/icons-material/NotificationsActiveRounded';
import PhoneInTalkRounded from '@mui/icons-material/PhoneInTalkRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import TodayRounded from '@mui/icons-material/TodayRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import { consultarAreaTrabalho } from '@/services/areaTrabalho';
import { useAuth } from '@/hooks/useAuth';

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

function erroDaApi(error) {
  return error.response?.data?.mensagem || error.response?.data?.message || error.response?.data?.erro
    || 'Não foi possível carregar sua área de trabalho.';
}

function corPrioridade(prioridade) {
  const valor = String(prioridade || '').toUpperCase();
  if (valor === 'CRITICA') return 'error';
  if (valor === 'ALTA') return 'warning';
  if (valor === 'MEDIA') return 'info';
  return 'success';
}

function corAlerta(severidade) {
  const valor = String(severidade || '').toUpperCase();
  if (valor === 'CRITICA' || valor === 'ERRO') return 'error';
  if (valor === 'ALTA' || valor === 'AVISO') return 'warning';
  return 'info';
}

function Indicador({ titulo, valor, legenda, icone, cor, caminho = '/dashboard/cobrancas' }) {
  return <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: '0 auto 0 0', width: 4, bgcolor: `${cor}.main` }} />
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Box minWidth={0}>
            <Typography variant="body2" color="text.secondary">{titulo}</Typography>
            <Typography variant="h4" fontWeight={700} mt={0.5} noWrap>{valor}</Typography>
            <Typography variant="caption" color="text.secondary">{legenda}</Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${cor}.lighter`, color: `${cor}.main`, width: 46, height: 46 }}>
            {icone}
          </Avatar>
        </Stack>
        <Button component={Link} to={caminho} size="small" endIcon={<ArrowForwardRounded />}
          sx={{ px: 0, mt: 1.5 }}>
          Ver detalhes
        </Button>
      </CardContent>
    </Card>;
}

function EstadoCarregando() {
  return <Stack minHeight={420} alignItems="center" justifyContent="center" spacing={2}>
      <CircularProgress />
      <Typography color="text.secondary">Preparando sua área de trabalho...</Typography>
    </Stack>;
}

export default function AreaTrabalhoPage() {
  const { user } = useAuth();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setDados(await consultarAreaTrabalho());
    } catch (error) {
      setErro(erroDaApi(error));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const resumo = dados?.resumo || {};
  const desempenho = dados?.desempenho || {};
  const alertas = dados?.alertas || [];
  const taxaContato = useMemo(() => {
    const total = Number(desempenho.atendimentosHoje || 0);
    return total ? Math.round(Number(desempenho.contatosEfetivos || 0) / total * 100) : 0;
  }, [desempenho]);

  if (carregando && !dados) return <EstadoCarregando />;

  return <Box className="pt-2 pb-4">
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Olá, {user?.name?.split(' ')[0] || 'bem-vindo'}
          </Typography>
          <Typography color="text.secondary" mt={0.5}>
            Aqui está o que precisa da sua atenção na operação de cobrança.
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          {dados?.atualizadoEm && <Typography variant="caption" color="text.secondary">
            Atualizado em {dataHora.format(new Date(dados.atualizadoEm))}
          </Typography>}
          <Tooltip title="Atualizar área de trabalho">
            <span><IconButton onClick={carregar} disabled={carregando}><RefreshRounded /></IconButton></span>
          </Tooltip>
        </Stack>
      </Stack>

      {carregando && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
      {erro && <Alert severity="error" action={<Button color="inherit" onClick={carregar}>Tentar novamente</Button>}
        sx={{ mb: 3 }}>{erro}</Alert>}

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Indicador titulo="Minha carteira" valor={Number(resumo.fila || 0)} legenda="protocolos sob sua responsabilidade"
            icone={<GroupsRounded />} cor="primary" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Indicador titulo="Tarefas atrasadas" valor={Number(resumo.tarefasAtrasadas || 0)} legenda="ações com prazo vencido"
            icone={<AssignmentLateRounded />} cor={resumo.tarefasAtrasadas ? 'error' : 'success'} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Indicador titulo="Promessas para hoje" valor={Number(resumo.promessasHoje || 0)} legenda="compromissos que vencem hoje"
            icone={<TodayRounded />} cor="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <Indicador titulo="Valor da carteira" valor={moeda.format(Number(resumo.valorCarteira || 0))}
            legenda={`${Number(resumo.slasCriticos || 0)} SLA(s) crítico(s)`}
            icone={<AccountBalanceWalletRounded />} cor="info" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Box>
                  <Typography variant="h6">Próxima atividade</Typography>
                  <Typography variant="body2" color="text.secondary">Continue pelo item mais prioritário da fila</Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.lighter', color: 'primary.main' }}><AccessTimeRounded /></Avatar>
              </Stack>
              {dados?.proximaAtividade ? <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                    <Box>
                      <Typography variant="overline" color="text.secondary">{dados.proximaAtividade.tipo || 'TAREFA'}</Typography>
                      <Typography variant="h5" fontWeight={700}>{dados.proximaAtividade.titulo}</Typography>
                      <Typography variant="body2" color="text.secondary" mt={0.5}>
                        Protocolo {dados.proximaAtividade.referencia}
                      </Typography>
                    </Box>
                    <Chip size="small" color={corPrioridade(dados.proximaAtividade.prioridade)}
                      label={(dados.proximaAtividade.prioridade || 'NORMAL').replaceAll('_', ' ')} />
                  </Stack>
                  <Divider />
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TodayRounded color="action" />
                      <Typography variant="body2">
                        Prazo: {dados.proximaAtividade.prazoEm
                          ? dataHora.format(new Date(dados.proximaAtividade.prazoEm)) : 'não informado'}
                      </Typography>
                    </Stack>
                    <Button component={Link} to="/dashboard/cobrancas" variant="contained"
                      endIcon={<ArrowForwardRounded />}>Abrir atendimento</Button>
                  </Stack>
                </Stack> : <Stack alignItems="center" textAlign="center" py={5} spacing={1}>
                  <CheckCircleRounded color="success" sx={{ fontSize: 48 }} />
                  <Typography variant="h6">Nenhuma atividade pendente</Typography>
                  <Typography color="text.secondary">Sua fila de tarefas está em dia.</Typography>
                </Stack>}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                <Box>
                  <Typography variant="h6">Meu desempenho hoje</Typography>
                  <Typography variant="body2" color="text.secondary">Resultado da operação no dia</Typography>
                </Box>
                <TrendingUpRounded color="success" />
              </Stack>
              <Grid container spacing={2}>
                <Grid size={4}><Stack alignItems="center" spacing={0.5}>
                  <PhoneInTalkRounded color="primary" /><Typography variant="h5" fontWeight={700}>{desempenho.atendimentosHoje || 0}</Typography>
                  <Typography variant="caption" color="text.secondary" textAlign="center">Atendimentos</Typography>
                </Stack></Grid>
                <Grid size={4}><Stack alignItems="center" spacing={0.5}>
                  <CheckCircleRounded color="success" /><Typography variant="h5" fontWeight={700}>{desempenho.contatosEfetivos || 0}</Typography>
                  <Typography variant="caption" color="text.secondary" textAlign="center">Contatos efetivos</Typography>
                </Stack></Grid>
                <Grid size={4}><Stack alignItems="center" spacing={0.5}>
                  <HandshakeRounded color="warning" /><Typography variant="h5" fontWeight={700}>{desempenho.negociacoes || 0}</Typography>
                  <Typography variant="caption" color="text.secondary" textAlign="center">Negociações</Typography>
                </Stack></Grid>
              </Grid>
              <Divider sx={{ my: 2.5 }} />
              <Stack direction="row" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Efetividade dos contatos</Typography>
                <Typography variant="body2" fontWeight={700}>{taxaContato}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={taxaContato} color="success"
                sx={{ height: 8, borderRadius: 5 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1} mb={2}>
                <Box>
                  <Typography variant="h6">Alertas da operação</Typography>
                  <Typography variant="body2" color="text.secondary">Processos críticos e SLAs que exigem atenção</Typography>
                </Box>
                <Chip icon={<NotificationsActiveRounded />} color={alertas.length ? 'error' : 'success'}
                  label={`${alertas.length} alerta(s)`} />
              </Stack>
              {alertas.length ? <Stack divider={<Divider flexItem />}>
                  {alertas.map((alerta, indice) => <Stack key={`${alerta.referencia}-${indice}`}
                    direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }}
                    spacing={1.5} py={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 36, height: 36, bgcolor: `${corAlerta(alerta.severidade)}.lighter`,
                        color: `${corAlerta(alerta.severidade)}.main` }}>
                        <NotificationsActiveRounded fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{alerta.mensagem}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {alerta.tipo || 'ALERTA'} · Protocolo {alerta.referencia}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button component={Link} to="/dashboard/cobrancas" size="small">Consultar processo</Button>
                  </Stack>)}
                </Stack> : <Alert severity="success">Não há processos críticos na sua carteira neste momento.</Alert>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>;
}
