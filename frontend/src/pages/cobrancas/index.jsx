import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import ChatBubbleOutlineRounded from '@mui/icons-material/ChatBubbleOutlineRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import PauseCircleOutlineRounded from '@mui/icons-material/PauseCircleOutlineRounded';
import PlayCircleOutlineRounded from '@mui/icons-material/PlayCircleOutlineRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import { buscarCobrancasParaAtendimento, listarMinhaFila, pausarSla, retomarSla } from '@/services/cobrancas';
import Conversation from '@/page-sections/chat/conversation';
import ClientInfoPanel from '@/page-sections/chat/ClientInfoPanel';
import { useAuth } from '@/hooks/useAuth';

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

function rotuloEstado(item) {
  return (item.estadoFluxo || item.status || 'ABERTA').replaceAll('_', ' ');
}

function corEstado(item) {
  const estado = item.estadoFluxo || item.status || '';
  if (estado.includes('NEGOCIACAO') || estado.includes('PROMESSA') || estado === 'AGUARDANDO') return 'info';
  if (estado.includes('SEM_CONTATO') || estado.includes('VISITA') || estado.includes('RETIRADA')) return 'warning';
  if (estado.includes('ENCERR') || estado.includes('PAGA')) return 'success';
  if (estado.includes('JURIDICO')) return 'error';
  return 'default';
}

function contato(telefone, email) {
  if (!telefone && !email) return <Typography color="text.secondary">Não informado</Typography>;
  return <Stack spacing={0.25} minWidth={0}>
      {telefone && <Typography variant="body2" noWrap>{telefone}</Typography>}
      {email && <Typography variant="caption" color="text.secondary" noWrap title={email}>{email}</Typography>}
    </Stack>;
}

function Indicador({ titulo, valor, legenda, icone, cor = 'primary.main' }) {
  return <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary">{titulo}</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>{valor}</Typography>
            <Typography variant="caption" color="text.secondary">{legenda}</Typography>
          </Box>
          <Box sx={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            borderRadius: 2,
            color: cor,
            bgcolor: 'action.hover'
          }}>
            {icone}
          </Box>
        </Stack>
      </CardContent>
    </Card>;
}

export default function CobrancasPage() {
  const { user } = useAuth();
  const visaoGestao = ['administrator', 'administrador', 'gerente', 'supervisor'].includes(user?.role);
  const [cobrancas, setCobrancas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [atendimento, setAtendimento] = useState(null);
  const [pagina, setPagina] = useState(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState(25);
  const [totalElementos, setTotalElementos] = useState(0);
  const [acaoSla, setAcaoSla] = useState(null);
  const [motivoSla, setMotivoSla] = useState('');
  const [salvandoSla, setSalvandoSla] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const resultado = visaoGestao
        ? await buscarCobrancasParaAtendimento({ pagina, tamanho: linhasPorPagina, busca: buscaAplicada })
        : await listarMinhaFila({
            pagina,
            tamanho: linhasPorPagina,
            busca: buscaAplicada,
            ordenarPor: 'prioridade',
            direcao: 'desc'
          });
      setCobrancas(resultado.itens || []);
      setTotalElementos(Number(resultado.totalElementos || 0));
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível consultar as cobranças no backend.');
    } finally {
      setCarregando(false);
    }
  }, [buscaAplicada, linhasPorPagina, pagina, visaoGestao]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPagina(0);
      setBuscaAplicada(busca.trim());
    }, 400);
    return () => window.clearTimeout(timer);
  }, [busca]);

  const total = cobrancas.reduce((soma, item) => soma + Number(item.valorTotal || 0), 0);
  const boletos = cobrancas.reduce((soma, item) => soma + Number(item.quantidadeBoletos || 0), 0);
  const slasCriticos = cobrancas.filter(item => Number(item.slaEscalonamentoNivel || 0) > 0).length;

  const confirmarAcaoSla = async () => {
    if (!acaoSla || !motivoSla.trim()) return;
    setSalvandoSla(true);
    setErro('');
    try {
      if (acaoSla.tipo === 'pausar') await pausarSla(acaoSla.item.referencia, motivoSla.trim());
      else await retomarSla(acaoSla.item.referencia, motivoSla.trim());
      setAcaoSla(null);
      setMotivoSla('');
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || `Não foi possível ${acaoSla.tipo} o SLA.`);
    } finally {
      setSalvandoSla(false);
    }
  };

  return <Box className="pt-2 pb-4">
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Acompanhamento de processos</Typography>
          <Typography color="text.secondary" mt={0.5}>
            {visaoGestao
              ? 'Consulte todos os protocolos ativos, prioridades, valores, status e prazos.'
              : 'Consulte os protocolos da sua carteira, prioridades, valores, status e prazos.'}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Atualizar dados da tela">
            <span>
              <IconButton onClick={carregar} disabled={carregando}>
                <RefreshRounded />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Indicador titulo="Protocolos ativos" valor={totalElementos}
            legenda={visaoGestao ? 'Total encontrado na operação' : 'Total encontrado na sua carteira'}
            icone={<PeopleAltRounded />} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Indicador titulo="Boletos na página" valor={boletos} legenda="Vinculados aos protocolos exibidos"
            icone={<ReceiptLongRounded />} cor="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Indicador titulo="Valor exibido" valor={moeda.format(total)} legenda="Soma dos processos desta página"
            icone={<AccountBalanceWalletRounded />} cor="success.main" />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Indicador titulo="SLAs na página" valor={slasCriticos} legenda="Protocolos vencidos ou escalonados"
            icone={<AccessTimeRounded />} cor="error.main" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
            <Box>
              <Typography variant="h6">Protocolos de cobrança</Typography>
              <Typography variant="body2" color="text.secondary">
                {totalElementos} processo(s) encontrado(s)
              </Typography>
            </Box>
            <TextField
              size="small"
              value={busca}
              onChange={event => {
                setBusca(event.target.value);
              }}
              placeholder="Buscar por nome, CPF ou referência"
              sx={{ width: { xs: '100%', sm: 340 } }}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment>
                }
              }}
            />
          </Stack>

          <TableContainer>
            <Table size="small" sx={{
              minWidth: 980,
              tableLayout: 'fixed',
              '& .MuiTableCell-root': { px: 1.25, verticalAlign: 'middle' }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 230 }}>Cliente</TableCell>
                  <TableCell sx={{ width: 180 }}>Contato</TableCell>
                  <TableCell sx={{ width: 155 }}>Faixa</TableCell>
                  <TableCell sx={{ width: 125 }} align="right">Em aberto</TableCell>
                  <TableCell sx={{ width: 120 }}>Atualização</TableCell>
                  <TableCell sx={{ width: 105 }}>Status</TableCell>
                  <TableCell sx={{ width: 150 }}>SLA</TableCell>
                  <TableCell sx={{ width: 48 }} align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {carregando ? <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" color="text.secondary" mt={1}>Consultando o banco...</Typography>
                    </TableCell>
                  </TableRow> : cobrancas.length === 0 ? <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography fontWeight={600}>Nenhuma cobrança encontrada</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sincronize o RBX ou ajuste o termo pesquisado.
                      </Typography>
                    </TableCell>
                  </TableRow> : cobrancas.map(item => <TableRow hover key={item.referencia}
                    onClick={() => setAtendimento(item)}
                    sx={{ cursor: 'pointer', '&:hover .abrir-chat': { opacity: 1 } }}>
                    <TableCell>
                      <Box minWidth={0}>
                        <Typography variant="body2" fontWeight={700} noWrap title={item.cliente}>
                          {item.clienteRbxCodigo && <Box component="span" color="primary.main">
                            [{item.clienteRbxCodigo}]&nbsp;
                          </Box>}
                          {item.cliente}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap display="block"
                          title={`Contrato ${item.contratoReferencia}`}>
                          Contrato {item.contratoReferencia}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{contato(item.telefone, item.email)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Chip size="small" label={`${item.diasAtraso || 0} dias • ${
                        item.faixaAtraso?.replaceAll('_', ' ') || 'F1 RECENTE'
                      }`} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>{moeda.format(item.valorTotal)}</Typography>
                    </TableCell>
                    <TableCell>
                      {item.atualizadaEm ? dataHora.format(new Date(item.atualizadaEm)) : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip size="small" color={corEstado(item)} label={rotuloEstado(item)} />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Tooltip title={item.slaPausadoEm
                          ? `Pausado desde ${dataHora.format(new Date(item.slaPausadoEm))}`
                          : item.slaUltimaNotificacaoEm
                            ? `Última notificação: ${dataHora.format(new Date(item.slaUltimaNotificacaoEm))}`
                            : `Prazo de ${item.slaHoras} hora(s) útil(eis)`}>
                          <Chip
                            size="small"
                            color={item.slaPausadoEm ? 'warning'
                              : item.slaEscalonamentoNivel > 0 ? 'error' : 'success'}
                            label={item.slaPausadoEm ? 'PAUSADO'
                              : item.slaEscalonamentoNivel > 0
                                ? `NÍVEL ${item.slaEscalonamentoNivel}` : 'NO PRAZO'}
                          />
                        </Tooltip>
                        <Tooltip title={item.slaPausadoEm ? 'Retomar SLA' : 'Pausar SLA'}>
                          <IconButton size="small" color={item.slaPausadoEm ? 'success' : 'warning'}
                            aria-label={item.slaPausadoEm ? 'Retomar SLA' : 'Pausar SLA'}
                            onClick={event => {
                              event.stopPropagation();
                              setMotivoSla('');
                              setAcaoSla({ tipo: item.slaPausadoEm ? 'retomar' : 'pausar', item });
                            }}>
                            {item.slaPausadoEm
                              ? <PlayCircleOutlineRounded fontSize="small" />
                              : <PauseCircleOutlineRounded fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Abrir atendimento">
                        <IconButton size="small" color="primary" aria-label="Abrir atendimento"
                          onClick={event => { event.stopPropagation(); setAtendimento(item); }}>
                          <ChatBubbleOutlineRounded sx={{ fontSize: 19 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalElementos}
            page={pagina}
            onPageChange={(_, novaPagina) => setPagina(novaPagina)}
            rowsPerPage={linhasPorPagina}
            onRowsPerPageChange={event => {
              setLinhasPorPagina(Number(event.target.value));
              setPagina(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage="Linhas por página"
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
          />
        </CardContent>
      </Card>

      <Dialog open={Boolean(atendimento)} onClose={() => setAtendimento(null)}
        fullWidth maxWidth="xl"
        PaperProps={{
          sx: {
            height: { xs: '96dvh', md: '92dvh' },
            maxHeight: { xs: '96dvh', md: '92dvh' },
            m: { xs: 1, md: 2 }
          }
        }}>
        <DialogTitle sx={{ py: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">Atendimento</Typography>
              <Typography variant="caption" color="text.secondary">
                {atendimento?.clienteRbxCodigo && `[${atendimento.clienteRbxCodigo}] `}
                {atendimento?.cliente} • {atendimento?.referencia}
              </Typography>
            </Box>
            <IconButton onClick={() => setAtendimento(null)}><CloseRounded /></IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 2, overflow: 'hidden', minHeight: 0 }}>
          <Grid container spacing={2} sx={{ height: '100%', minHeight: 0 }}>
            <Grid size={{ xs: 12, md: 8 }}
              sx={{ height: { xs: 'auto', md: '100%' }, minHeight: 0 }}>
              <Conversation processo={atendimento} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}
              sx={{ height: { xs: 'auto', md: '100%' }, minHeight: 0, overflowY: 'auto' }}>
              <ClientInfoPanel processo={atendimento} onAtualizar={carregar} />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(acaoSla)} onClose={() => !salvandoSla && setAcaoSla(null)}
        fullWidth maxWidth="sm">
        <DialogTitle>{acaoSla?.tipo === 'pausar' ? 'Pausar SLA' : 'Retomar SLA'}</DialogTitle>
        <DialogContent>
          <Alert severity={acaoSla?.tipo === 'pausar' ? 'warning' : 'info'} sx={{ mb: 2 }}>
            Protocolo {acaoSla?.item?.referencia}. A ação será registrada na timeline.
          </Alert>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={3}
            label="Motivo"
            value={motivoSla}
            onChange={event => setMotivoSla(event.target.value)}
            inputProps={{ maxLength: 500 }}
            helperText={`${motivoSla.length}/500`}
            disabled={salvandoSla}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcaoSla(null)} disabled={salvandoSla}>Cancelar</Button>
          <Button variant="contained" onClick={confirmarAcaoSla}
            disabled={!motivoSla.trim() || salvandoSla}>
            {salvandoSla ? <CircularProgress size={20} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>;
}
