import { Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router';

const MODULOS = [
  ['Processos e cobranças', 'Inadimplentes do RBX, valores agregados por CPF e processos.', '/dashboard/cobrancas'],
  ['Regras de negócio', 'Regras dos módulos de Processos, Atendimentos e Timeline.', '/dashboard/verificacao/regras'],
  ['Timeline e logs', 'Eventos imutáveis de cada processo em ordem cronológica.', '/dashboard/verificacao/timeline']
];

export default function VerificacaoPage() {
  return <Stack spacing={3}>
      <div>
        <Typography variant="h4" fontWeight={700}>Central de verificação do SGC</Typography>
        <Typography color="text.secondary">Área temporária para visualizar e testar o que já está implementado.</Typography>
      </div>
      <Grid container spacing={3}>
        {MODULOS.map(([titulo, descricao, caminho]) => <Grid key={titulo} size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: '100%' }}><CardContent>
              <Stack spacing={2} alignItems="flex-start">
                <Chip size="small" color="success" label="Disponível" />
                <Typography variant="h6">{titulo}</Typography>
                <Typography color="text.secondary">{descricao}</Typography>
                <Button component={Link} to={caminho} variant="contained">Visualizar</Button>
              </Stack>
            </CardContent></Card>
          </Grid>)}
      </Grid>
    </Stack>;
}
