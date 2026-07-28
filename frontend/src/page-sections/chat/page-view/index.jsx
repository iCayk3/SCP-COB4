import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CircularProgress, Drawer, Grid, Snackbar, Stack, TextField, Typography
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AllMessages from '../AllMessages';
import Conversation from '../conversation';
import ClientInfoPanel from '../ClientInfoPanel';
import { buscarCobrancasParaAtendimento } from '@/services/cobrancas';
import { gerarSimulacoesAtendimento } from '@/services/atendimentos';

export default function ChatPageView() {
  const [processos, setProcessos] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [busca, setBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [pagina, setPagina] = useState(0);
  const [paginacao, setPaginacao] = useState({ totalElementos: 0, totalPaginas: 0, primeira: true, ultima: true });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [openLeftDrawer, setOpenLeftDrawer] = useState(false);
  const downMd = useMediaQuery(theme => theme.breakpoints.down('md'));

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await buscarCobrancasParaAtendimento({ pagina, tamanho: 30, busca: buscaAplicada });
      setProcessos(dados.itens);
      setPaginacao(dados);
      setSelecionado(atual => dados.itens.some(item => item.referencia === atual?.referencia)
        ? atual : dados.itens[0] || null);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível carregar os processos.');
    } finally {
      setCarregando(false);
    }
  }, [pagina, buscaAplicada]);

  useEffect(() => { carregar(); }, [carregar]);
  useEffect(() => {
    const temporizador = setTimeout(() => {
      setPagina(0);
      setBuscaAplicada(busca.trim());
    }, 400);
    return () => clearTimeout(temporizador);
  }, [busca]);
  const simular = async () => {
    setSimulando(true);
    setErro('');
    try {
      const resultado = await gerarSimulacoesAtendimento();
      setAviso(`${resultado.conversasCriadas} conversa(s) criada(s); ${resultado.jaExistentes} já existia(m).`);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível gerar as conversas fictícias.');
    } finally {
      setSimulando(false);
    }
  };
  const selecionar = processo => {
    setSelecionado(processo);
    setOpenLeftDrawer(false);
  };
  const lista = <Card sx={{ height: '100%', pb: 1 }}>
      <Box p={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Atendimentos</Typography>
          <Button size="small" variant="outlined" onClick={simular} disabled={simulando}>
            {simulando ? 'Gerando...' : 'Gerar simulações'}
          </Button>
        </Stack>
        <TextField fullWidth size="small" value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar cliente, CPF ou processo" />
      </Box>
      {carregando ? <Box textAlign="center" py={4}><CircularProgress size={28} /></Box>
        : <AllMessages processos={processos} selecionado={selecionado} onSelecionar={selecionar}
            pagina={pagina} paginacao={paginacao} onMudarPagina={setPagina} />}
    </Card>;

  return <Box className="pt-2 pb-4">
      {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
      <Snackbar open={Boolean(aviso)} autoHideDuration={6000} onClose={() => setAviso('')} message={aviso} />
      <Grid container spacing={3}>
        {downMd ? <Drawer anchor="left" open={openLeftDrawer} onClose={() => setOpenLeftDrawer(false)}>
            <Box width={340} p={1}>{lista}</Box>
          </Drawer> : <Grid size={{ lg: 3, md: 4, xs: 12 }}>{lista}</Grid>}
        <Grid size={{ lg: 6, md: 8, xs: 12 }}>
          <Conversation processo={selecionado} handleOpen={() => setOpenLeftDrawer(true)} />
        </Grid>
        <Grid size={{ lg: 3, md: 12, xs: 12 }}>
          <ClientInfoPanel processo={selecionado} onAtualizar={carregar} />
        </Grid>
      </Grid>
    </Box>;
}
