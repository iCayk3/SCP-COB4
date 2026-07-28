import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

const MODULOS = [
  {
    titulo: 'Sincronização RBX',
    descricao: 'Configure os dois horários diários de atualização automática da carteira.',
    caminho: '/dashboard/configuracoes/sincronizacao-rbx',
    categoria: 'Integração'
  },
  {
    titulo: 'Fluxos de cobrança',
    descricao: 'Configure estados, transições permitidas, ordem operacional e movimentos automáticos.',
    caminho: '/dashboard/configuracoes/fluxos',
    categoria: 'Processo'
  },
  {
    titulo: 'Faixas de atraso',
    descricao: 'Defina os intervalos de dias, nomes e prioridades usados para classificar os protocolos.',
    caminho: '/dashboard/configuracoes/faixas-atraso',
    categoria: 'Política'
  },
  {
    titulo: 'Catálogos de motivos',
    descricao: 'Administre motivos de movimentação, encerramento, visita, retirada, jurídico e fechamento.',
    caminho: '/dashboard/configuracoes/catalogos-motivos',
    categoria: 'Padronização'
  },
  {
    titulo: 'LGPD e retenção',
    descricao: 'Documente dados pessoais, finalidade, base legal, acesso, retenção e destino final.',
    caminho: '/dashboard/configuracoes/lgpd',
    categoria: 'Governança'
  }
];

export default function ConfiguracoesPage() {
  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Configurações do SGC</Typography>
      <Typography color="text.secondary">
        Parâmetros que alteram o comportamento da cobrança, organizados por assunto.
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
        <Typography variant="subtitle1" fontWeight={700}>Governança das configurações</Typography>
        <Typography color="text.secondary">
          Alterações passam a valer para as próximas operações. Códigos usados em históricos permanecem
          imutáveis; opções antigas devem ser inativadas para preservar a auditoria.
        </Typography>
      </CardContent>
    </Card>
  </Stack>;
}
