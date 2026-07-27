import {
  Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography
} from '@mui/material';
import { Scrollbar } from '@/components/scrollbar';

export default function AllMessages({ processos, selecionado, onSelecionar, pagina, paginacao, onMudarPagina }) {
  return <Box mt={2}>
      <Typography variant="body2" fontWeight={500} color="text.secondary" px={3} mb={1}>
        Processos em atendimento
      </Typography>
      <Scrollbar style={{ maxHeight: 520 }}>
        <List disablePadding>
          {processos.map(processo => <ListItemButton
            key={processo.referencia}
            selected={selecionado?.referencia === processo.referencia}
            onClick={() => onSelecionar(processo)}
          >
            <ListItemAvatar>
              <Avatar>{processo.cliente?.charAt(0) || '?'}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={processo.cliente}
              secondary={`${processo.referencia} • ${processo.quantidadeBoletos} boleto(s)`}
              slotProps={{ primary: { fontSize: 14, fontWeight: 600 }, secondary: { fontSize: 11 } }}
            />
          </ListItemButton>)}
        </List>
      </Scrollbar>
      <Stack direction="row" alignItems="center" justifyContent="space-between" px={2} pt={1}>
        <Button size="small" disabled={paginacao.primeira} onClick={() => onMudarPagina(pagina - 1)}>
          Anterior
        </Button>
        <Typography variant="caption" color="text.secondary">
          {paginacao.totalElementos} processos • página {pagina + 1} de {Math.max(paginacao.totalPaginas, 1)}
        </Typography>
        <Button size="small" disabled={paginacao.ultima} onClick={() => onMudarPagina(pagina + 1)}>
          Próxima
        </Button>
      </Stack>
    </Box>;
}
