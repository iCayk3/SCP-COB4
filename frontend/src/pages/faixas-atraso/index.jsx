import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, MenuItem, Stack, TextField, Typography
} from '@mui/material';
import { listarFaixasAtraso, salvarFaixasAtraso } from '@/services/cobrancas';

const PRIORIDADES = [
  ['BAIXA', 'Baixa'], ['MEDIA', 'Média'], ['ALTA', 'Alta'], ['CRITICA', 'Crítica']
];

export default function FaixasAtrasoPage() {
  const [faixas, setFaixas] = useState([]);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    listarFaixasAtraso().then(setFaixas)
      .catch(() => setErro('Não foi possível carregar as faixas de atraso.'));
  }, []);

  const alterar = (indice, campo, valor) => setFaixas(atuais => atuais.map((faixa, i) =>
    i === indice ? { ...faixa, [campo]: valor } : faixa));

  const salvar = async () => {
    setSalvando(true); setErro(''); setAviso('');
    try {
      setFaixas(await salvarFaixasAtraso(faixas));
      setAviso('Política atualizada e aplicada aos protocolos ativos.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Não foi possível salvar. Verifique se as faixas são contínuas e não se sobrepõem.');
    } finally {
      setSalvando(false);
    }
  };

  return <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Faixas de atraso</Typography>
        <Typography color="text.secondary">
          Configure os períodos e a prioridade. A primeira faixa começa no dia 1 e a última não possui limite.
        </Typography>
      </Box>
      {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
      {aviso && <Alert severity="success" onClose={() => setAviso('')}>{aviso}</Alert>}
      <Card><CardContent><Stack spacing={2}>
        {faixas.map((faixa, indice) => <Stack key={faixa.codigo}
          direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <Typography width={{ md: 45 }} fontWeight={700}>F{indice + 1}</Typography>
          <TextField size="small" label="Nome" value={faixa.nome} sx={{ flex: 1 }}
            onChange={event => alterar(indice, 'nome', event.target.value)} />
          <TextField size="small" type="number" label="Dia inicial" value={faixa.diasInicio}
            sx={{ width: { md: 130 } }} inputProps={{ min: 1 }}
            onChange={event => alterar(indice, 'diasInicio', Number(event.target.value))} />
          <TextField size="small" type="number" label="Dia final"
            value={faixa.diasFim ?? ''} disabled={indice === faixas.length - 1}
            placeholder={indice === faixas.length - 1 ? 'Sem limite' : ''}
            sx={{ width: { md: 130 } }}
            onChange={event => alterar(indice, 'diasFim',
              event.target.value === '' ? null : Number(event.target.value))} />
          <TextField select size="small" label="Prioridade" value={faixa.prioridade}
            sx={{ width: { md: 150 } }}
            onChange={event => alterar(indice, 'prioridade', event.target.value)}>
            {PRIORIDADES.map(([valor, nome]) => <MenuItem key={valor} value={valor}>{nome}</MenuItem>)}
          </TextField>
        </Stack>)}
        <Alert severity="info">
          Visita é habilitada a partir da F4, retirada a partir da F5 e jurídico na F6.
        </Alert>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" onClick={salvar} disabled={salvando || faixas.length !== 6}>
            {salvando ? 'Salvando...' : 'Salvar política'}
          </Button>
        </Stack>
      </Stack></CardContent></Card>
    </Stack>;
}
