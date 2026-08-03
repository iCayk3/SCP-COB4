import { useEffect, useState } from 'react';
import { Alert, Card, CardContent, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { listarCobrancasAbertas } from '@/services/cobrancas';
import { listarTimeline } from '@/services/atendimentos';

export default function TimelinePage() {
  const [processos, setProcessos] = useState([]);
  const [referencia, setReferencia] = useState('');
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    listarCobrancasAbertas().then(lista => {
      setProcessos(lista);
      if (lista.length) setReferencia(lista[0].referencia);
    }).catch(() => setErro('Não foi possível carregar os processos.')).finally(() => setCarregando(false));
  }, []);
  useEffect(() => {
    if (!referencia) return;
    setCarregando(true);
    listarTimeline(referencia).then(pagina => setEventos(pagina.itens)).catch(() => setErro('Não foi possível carregar a timeline.'))
      .finally(() => setCarregando(false));
  }, [referencia]);

  return <Stack spacing={3}>
      <div><Typography variant="h4" fontWeight={700}>Timeline e logs</Typography>
        <Typography color="text.secondary">Eventos imutáveis registrados para cada processo</Typography></div>
      {erro && <Alert severity="error">{erro}</Alert>}
      <FormControl fullWidth><InputLabel>Processo</InputLabel>
        <Select value={referencia} label="Processo" onChange={e => setReferencia(e.target.value)}>
          {processos.map(item => <MenuItem key={item.referencia} value={item.referencia}>
            {item.referencia} — {item.cliente} — {item.cpf}
          </MenuItem>)}
        </Select>
      </FormControl>
      {carregando && <CircularProgress />}
      {!carregando && referencia && eventos.length === 0 && <Alert severity="info">Este processo ainda não possui eventos.</Alert>}
      <Stack spacing={2}>{eventos.map(evento => <Card key={evento.id}>
        <CardContent sx={{ borderLeft: 4, borderColor: 'primary.main' }}>
          <Typography variant="caption" color="text.secondary">
            {new Date(evento.criadoEm).toLocaleString('pt-BR')} • {evento.autorNome}
          </Typography>
          <Typography variant="h6">{evento.evento.replaceAll('_', ' ')}</Typography>
          <Typography>{evento.descricao}</Typography>
          <Typography variant="caption" color="text.disabled">Operador: {evento.autorIdentificador}</Typography>
        </CardContent>
      </Card>)}</Stack>
    </Stack>;
}
