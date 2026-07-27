import { Avatar, Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';

const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL'
});

const mascararCpf = cpf => {
  const numeros = String(cpf || '').replace(/\D/g, '');
  if (numeros.length !== 11) return 'Não informado';
  return `${numeros.slice(0, 3)}.***.***-${numeros.slice(-2)}`;
};

const rotulo = valor => String(valor || '').replaceAll('_', ' ');

function Campo({ titulo, valor, destaque }) {
  return <Box>
      <Typography variant="caption" color="text.secondary">{titulo}</Typography>
      <Typography variant={destaque ? 'h6' : 'body2'} fontWeight={destaque ? 700 : 500}
        color={destaque ? 'error.main' : 'text.primary'} sx={{ wordBreak: 'break-word' }}>
        {valor || 'Não informado'}
      </Typography>
    </Box>;
}

export default function ClientInfoPanel({ processo }) {
  if (!processo) return <Card sx={{ height: '100%', p: 3 }}>
      <Typography color="text.secondary">Selecione uma conversa para visualizar o cliente.</Typography>
    </Card>;

  return <Card sx={{ height: '100%' }}>
      <Stack spacing={2.25} p={2.5}>
        <Stack alignItems="center" textAlign="center" spacing={1}>
          <Avatar sx={{ width: 64, height: 64, fontSize: 26 }}>
            {processo.cliente?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="h6">{processo.cliente}</Typography>
          <Chip size="small" color={processo.status === 'EM_ANDAMENTO' ? 'info' : 'warning'}
            label={rotulo(processo.status)} />
        </Stack>
        <Divider />
        <Campo titulo="Valor devedor" valor={moeda(processo.valorTotal)} destaque />
        <Campo titulo="CPF" valor={mascararCpf(processo.cpf)} />
        <Campo titulo="Código RBX (CliFlor)" valor={processo.clienteRbxCodigo} />
        <Campo titulo="Contrato(s)" valor={processo.contratoReferencia} />
        <Campo titulo="Processo" valor={processo.referencia} />
        <Stack direction="row" spacing={3}>
          <Campo titulo="Boletos vencidos" valor={processo.quantidadeBoletos} />
          <Campo titulo="Prioridade" valor={rotulo(processo.prioridade)} />
        </Stack>
        <Stack direction="row" spacing={3}>
          <Campo titulo="SLA" valor={`${processo.slaHoras || 0} horas`} />
          <Campo titulo="Responsável" valor={processo.responsavelNome} />
        </Stack>
        <Divider />
        <Campo titulo="Telefone" valor={processo.telefone} />
        <Campo titulo="E-mail" valor={processo.email} />
        <Campo titulo="Última atualização"
          valor={processo.atualizadaEm ? new Date(processo.atualizadaEm).toLocaleString('pt-BR') : null} />
        <Typography variant="caption" color="text.disabled">
          Dados consultados no SGC. CPF mascarado para visualização.
        </Typography>
      </Stack>
    </Card>;
}
