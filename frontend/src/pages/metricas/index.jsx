import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Stack, TextField, Typography
} from '@mui/material';
import { consultarMetricas, gerarFechamento, listarFechamentos } from '@/services/planejamento';

const mesAtual = new Date().toISOString().slice(0, 7);
const cores = { DISPONIVEL: 'success', PARCIAL: 'warning', INDISPONIVEL: 'default' };
const rotulos = { DISPONIVEL: 'Disponivel', PARCIAL: 'Parcial', INDISPONIVEL: 'Aguardando modulo' };
const formatar = indicador => {
  if (indicador.valor === null || indicador.valor === undefined) return '-';
  if (indicador.unidade === 'BRL') return Number(indicador.valor).toLocaleString('pt-BR',
    { style: 'currency', currency: 'BRL' });
  return `${Number(indicador.valor).toLocaleString('pt-BR')} ${indicador.unidade === '%' ? '%' : indicador.unidade.toLowerCase()}`;
};

export default function MetricasPage() {
  const [competencia, setCompetencia] = useState(mesAtual);
  const [dados, setDados] = useState(null);
  const [fechamentos, setFechamentos] = useState([]);
  const [erro, setErro] = useState('');
  const [gerando, setGerando] = useState(false);

  const carregarFechamentos = async mes => setFechamentos(await listarFechamentos(mes).catch(() => []));

  useEffect(() => {
    setErro('');
    consultarMetricas(competencia).then(setDados)
      .catch(() => setErro('Nao foi possivel calcular as metricas da competencia.'));
    carregarFechamentos(competencia);
  }, [competencia]);

  const gerar = async () => {
    setGerando(true); setErro('');
    try {
      await gerarFechamento({ competencia, usuario: 'Supervisor' });
      await carregarFechamentos(competencia);
    } catch {
      setErro('Nao foi possivel gerar o fechamento da competencia.');
    } finally { setGerando(false); }
  };

  return <Stack spacing={3}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Metricas mensais</Typography>
        <Typography color="text.secondary">Indicadores calculados com fonte, meta e disponibilidade explicitas.</Typography>
      </Box>
      <TextField type="month" label="Competencia" value={competencia} size="small"
        onChange={event => setCompetencia(event.target.value)} InputLabelProps={{ shrink: true }} />
    </Stack>
    {erro && <Alert severity="error">{erro}</Alert>}
    {!dados && !erro && <LinearProgress />}
    <Grid container spacing={2}>
      {dados?.indicadores.map(item => <Grid key={item.codigo} size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card sx={{ height: '100%' }}><CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
              <Typography fontWeight={700}>{item.nome}</Typography>
              <Chip size="small" color={cores[item.disponibilidade]} label={rotulos[item.disponibilidade]} />
            </Stack>
            <Typography variant="h4" color={item.disponibilidade === 'INDISPONIVEL' ? 'text.disabled' : 'primary.main'}>
              {formatar(item)}
            </Typography>
            <Typography variant="body2"><b>Meta:</b> {item.meta}</Typography>
            {item.denominador !== null && <Typography variant="caption" color="text.secondary">
              {item.numerador} de {item.denominador}
            </Typography>}
            <Typography variant="caption" color="text.secondary">{item.observacao}</Typography>
          </Stack>
        </CardContent></Card>
      </Grid>)}
    </Grid>
    <Card><CardContent><Stack spacing={1.5}>
      <Typography variant="h6">Produtividade por operador</Typography>
      {!dados?.produtividade.length && <Typography color="text.secondary">Nenhum atendimento na competencia.</Typography>}
      {dados?.produtividade.map(item => <Stack key={item.operador} direction="row" justifyContent="space-between"
        borderBottom={1} borderColor="divider" py={1}>
        <Typography>{item.operador}</Typography><Chip label={`${item.atendimentos} atendimento(s)`} />
      </Stack>)}
    </Stack></CardContent></Card>
    <Card><CardContent><Stack spacing={1.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={1}>
        <Box>
          <Typography variant="h6">Fechamento mensal</Typography>
          <Typography variant="body2" color="text.secondary">Versoes geradas para a competencia selecionada.</Typography>
        </Box>
        <Button variant="contained" onClick={gerar} disabled={gerando}>
          {gerando ? 'Gerando...' : 'Gerar fechamento'}
        </Button>
      </Stack>
      {!fechamentos.length && <Typography color="text.secondary">Nenhum fechamento gerado.</Typography>}
      {fechamentos.map(item => <Stack key={item.id} direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between" gap={1} borderBottom={1} borderColor="divider" py={1}>
        <Box>
          <Typography fontWeight={700}>Versao {item.versao} - {item.status}</Typography>
          <Typography variant="caption" color="text.secondary">
            Gerado por {item.geradoPor} em {new Date(item.geradoEm).toLocaleString('pt-BR')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={Number(item.valorRecuperado || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Chip label={`${item.protocolosEncerrados} encerrado(s)`} />
          <Chip label={`${item.promessasCriadas} promessa(s)`} />
          <Chip label={`${item.atendimentosRegistrados} atendimento(s)`} />
        </Stack>
      </Stack>)}
    </Stack></CardContent></Card>
  </Stack>;
}
