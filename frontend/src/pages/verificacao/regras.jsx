import { useEffect, useMemo, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { listarRegras } from '@/services/regras';

export default function RegrasPage() {
  const [regras, setRegras] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  useEffect(() => {
    listarRegras().then(setRegras).catch(() => setErro('Não foi possível carregar as regras.'))
      .finally(() => setCarregando(false));
  }, []);
  const modulos = useMemo(() => regras.reduce((grupos, regra) => {
    (grupos[regra.modulo] ||= []).push(regra);
    return grupos;
  }, {}), [regras]);

  return <Stack spacing={3}>
      <div><Typography variant="h4" fontWeight={700}>Regras de negócio</Typography>
        <Typography color="text.secondary">{regras.length} regra(s) implementada(s)</Typography></div>
      {carregando && <CircularProgress />}
      {erro && <Alert severity="error">{erro}</Alert>}
      {Object.entries(modulos).map(([modulo, itens]) => <Stack key={modulo} spacing={1}>
        <Typography variant="h6">{modulo}</Typography>
        {itens.map(regra => <Accordion key={regra.codigo}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={1} alignItems={{ sm: 'center' }}>
              <Chip label={regra.codigo} size="small" color="primary" />
              <Typography fontWeight={600}>{regra.nome}</Typography>
              <Chip label={regra.prioridade} size="small" variant="outlined" />
            </Stack>
          </AccordionSummary>
          <AccordionDetails><Stack spacing={1}>
            <Typography>{regra.descricao}</Typography>
            <Typography variant="body2"><b>Tipo:</b> {regra.tipo}</Typography>
            <Typography variant="body2"><b>Evento:</b> {regra.eventoDisparador}</Typography>
            <Typography variant="body2"><b>Ações:</b> {regra.acoes?.join(' • ') || '—'}</Typography>
            <Typography variant="body2"><b>Exceções:</b> {regra.excecoes?.join(' • ') || 'Nenhuma'}</Typography>
          </Stack></AccordionDetails>
        </Accordion>)}
      </Stack>)}
    </Stack>;
}
