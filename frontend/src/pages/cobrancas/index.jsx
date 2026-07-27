import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
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
import SyncRounded from '@mui/icons-material/SyncRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import { listarCobrancasAbertas, sincronizarCobrancasRbx } from '@/services/cobrancas';

const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const dataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

function formatarCpf(cpf = '') {
  const numeros = cpf.replace(/\D/g, '');
  if (numeros.length !== 11) return cpf || '—';
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function contato(telefone, email) {
  if (!telefone && !email) return <Typography color="text.secondary">Não informado</Typography>;
  return <Stack spacing={0.25}>
      {telefone && <Typography variant="body2">{telefone}</Typography>}
      {email && <Typography variant="caption" color="text.secondary">{email}</Typography>}
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
  const [sincronizando, setSincronizando] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState(null);
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

  const sincronizar = async () => {
    setSincronizando(true);
    setErro('');
    try {
      const resumo = await sincronizarCobrancasRbx();
      setResultado(resumo);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || 'A sincronização com o RBX não pôde ser concluída.');
    } finally {
      setSincronizando(false);
    }
  };

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
              <IconButton onClick={carregar} disabled={carregando || sincronizando}>
                <RefreshRounded />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={sincronizando ? <CircularProgress size={18} color="inherit" /> : <SyncRounded />}
            onClick={sincronizar}
            disabled={sincronizando}
          >
            {sincronizando ? 'Sincronizando...' : 'Sincronizar RBX'}
          </Button>
        </Stack>
      </Stack>

      {erro && <Alert severity="error" sx={{ mb: 3 }}>{erro}</Alert>}

      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Indicador titulo="Cobranças abertas" valor={cobrancas.length} legenda="Agrupadas por CPF"
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
              <Typography variant="h6">Clientes em cobrança</Typography>
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
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Contato</TableCell>
                  <TableCell>Referência</TableCell>
                  <TableCell align="center">Boletos</TableCell>
                  <TableCell align="right">Valor em aberto</TableCell>
                  <TableCell>Atualização</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {carregando ? <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={30} />
                      <Typography variant="body2" color="text.secondary" mt={1}>Consultando o banco...</Typography>
                    </TableCell>
                  </TableRow> : filtradas.length === 0 ? <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography fontWeight={600}>Nenhuma cobrança encontrada</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sincronize o RBX ou ajuste o termo pesquisado.
                      </Typography>
                    </TableCell>
                  </TableRow> : paginaAtual.map(item => <TableRow hover key={item.referencia}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{item.cliente}</Typography>
                    </TableCell>
                    <TableCell>{formatarCpf(item.cpf)}</TableCell>
                    <TableCell>{contato(item.telefone, item.email)}</TableCell>
                    <TableCell><Typography variant="caption">{item.referencia}</Typography></TableCell>
                    <TableCell align="center">{item.quantidadeBoletos}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={700}>{moeda.format(item.valorTotal)}</Typography>
                    </TableCell>
                    <TableCell>
                      {item.atualizadaEm ? dataHora.format(new Date(item.atualizadaEm)) : '—'}
                    </TableCell>
                    <TableCell><Chip size="small" color="warning" label="Em aberto" /></TableCell>
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

      <Snackbar
        open={Boolean(resultado)}
        autoHideDuration={8000}
        onClose={() => setResultado(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setResultado(null)}>
          Sincronização concluída: {resultado?.boletosCriados || 0} novo(s),{' '}
          {resultado?.boletosAtualizados || 0} atualizado(s) e{' '}
          {resultado?.documentosIgnorados || 0} ignorado(s).
        </Alert>
      </Snackbar>
    </Box>;
}
