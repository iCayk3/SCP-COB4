import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

const MODULOS = [
  {
    titulo: 'Sincronizacao automatica RBX',
    descricao: 'Defina os dois horarios diarios da sincronizacao e ative ou desative a rotina automatica.',
    caminho: '/dashboard/configuracoes/sincronizacao-rbx',
    categoria: 'Integracao'
  },
  {
    titulo: 'Fluxos de cobranca',
    descricao: 'Configure estados, transicoes permitidas, ordem operacional e movimentos automaticos.',
    caminho: '/dashboard/configuracoes/fluxos',
    categoria: 'Processo'
  },
  {
    titulo: 'Faixas de atraso',
    descricao: 'Defina os intervalos de dias, nomes e prioridades usados para classificar os protocolos.',
    caminho: '/dashboard/configuracoes/faixas-atraso',
    categoria: 'Politica'
  },
  {
    titulo: 'Catalogos de motivos',
    descricao: 'Administre motivos de movimentacao, encerramento, visita, retirada, juridico e fechamento.',
    caminho: '/dashboard/configuracoes/catalogos-motivos',
    categoria: 'Padronizacao'
  },
  {
    titulo: 'LGPD e retencao',
    descricao: 'Documente dados pessoais, finalidade, base legal, acesso, retencao e destino final.',
    caminho: '/dashboard/configuracoes/lgpd',
    categoria: 'Governanca'
  }
];

export default function ConfiguracoesPage() {
  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Configuracoes do SGC</Typography>
      <Typography color="text.secondary">
        Parametros que alteram o comportamento da cobranca, organizados por assunto.
      </Typography>
    </Box>
    <Grid container spacing={3}>
      {MODULOS.map(modulo => <Grid key={modulo.titulo} size={{ xs: 12, md: 4 }}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ height: '100%' }}>
            <Stack spacing={2} alignItems="flex-start" height="100%">
              <Chip size="small" color="primary" variant="outlined" label={modulo.categoria} />
              <Typography variant="h6">{modulo.titulo}</Typography>
              <Typography color="text.secondary" sx={{ flex: 1 }}>{modulo.descricao}</Typography>
              <Button component={Link} to={modulo.caminho} variant="contained">
                Configurar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>)}
    </Grid>
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700}>Governanca das configuracoes</Typography>
        <Typography color="text.secondary">
          Alteracoes passam a valer para as proximas operacoes. Codigos usados em historicos permanecem
          imutaveis; opcoes antigas devem ser inativadas para preservar a auditoria.
        </Typography>
      </CardContent>
    </Card>
  </Stack>;
}
