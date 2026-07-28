import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
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
import { listarCobrancasAbertas } from '@/services/cobrancas';
import Conversation from '@/page-sections/chat/conversation';
import ClientInfoPanel from '@/page-sections/chat/ClientInfoPanel';

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

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
  const [cobrancas, setCobrancas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [atendimento, setAtendimento] = useState(null);
  const [pagina, setPagina] = useState(0);
  const [linhasPorPagina, setLinhasPorPagina] = useState(25);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setCobrancas(await listarCobrancasAbertas());
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível consultar as cobranças no backend.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase().replace(/\D/g, '');
    const texto = busca.trim().toLowerCase();
    if (!texto) return cobrancas;
    return cobrancas.filter(item =>
      item.cliente?.toLowerCase().includes(texto) ||
      item.referencia?.toLowerCase().includes(texto) ||
      item.cpf?.includes(termo)
    );
  }, [busca, cobrancas]);
  const paginaAtual = filtradas.slice(
    pagina * linhasPorPagina,
    pagina * linhasPorPagina + linhasPorPagina
  );

  const total = cobrancas.reduce((soma, item) => soma + Number(item.valorTotal || 0), 0);
  const boletos = cobrancas.reduce((soma, item) => soma + Number(item.quantidadeBoletos || 0), 0);

  return <Box className="pt-2 pb-4">
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} mb={3}>
        <Box>
          <Typography variant="h4">Cobranças RBX</Typography>
          <Typography color="text.secondary" mt={0.5}>
            Acompanhe os clientes inadimplentes e os dados já armazenados no sistema.
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
        <Grid size={{ xs: 12, md: 4 }}>
          <Indicador titulo="Protocolos ativos" valor={cobrancas.length} legenda="Um protocolo por contrato"
            icone={<PeopleAltRounded />} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Indicador titulo="Boletos vinculados" valor={boletos} legenda="Sem duplicar documentos"
            icone={<ReceiptLongRounded />} cor="warning.main" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Indicador titulo="Valor total em aberto" valor={moeda.format(total)} legenda="Soma das cobranças atuais"
            icone={<AccountBalanceWalletRounded />} cor="success.main" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} mb={2}>
            <Box>
              <Typography variant="h6">Protocolos de cobrança</Typography>
              <Typography variant="body2" color="text.secondary">
                {filtradas.length} registro(s) exibido(s)
              </Typography>
            </Box>
            <TextField
              size="small"
              value={busca}
              onChange={event => {
                setBusca(event.target.value);
                setPagina(0);
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
              minWidth: 820,
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
                  <TableCell sx={{ width: 48 }} align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {carregando ? <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" color="text.secondary" mt={1}>Consultando o banco...</Typography>
                    </TableCell>
                  </TableRow> : filtradas.length === 0 ? <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography fontWeight={600}>Nenhuma cobrança encontrada</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sincronize o RBX ou ajuste o termo pesquisado.
                      </Typography>
                    </TableCell>
                  </TableRow> : paginaAtual.map(item => <TableRow hover key={item.referencia}
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
                    <TableCell><Chip size="small" color="warning" label="Em aberto" /></TableCell>
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
            count={filtradas.length}
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
    </Box>;
}
