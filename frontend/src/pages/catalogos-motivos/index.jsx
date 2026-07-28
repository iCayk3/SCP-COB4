import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, FormControlLabel, MenuItem,
  Stack, TextField, Typography
} from '@mui/material';
import { listarMotivos, salvarMotivos } from '@/services/catalogos';

const TIPOS = [
  ['MOVIMENTACAO', 'Movimentação'], ['ENCERRAMENTO', 'Encerramento'],
  ['REABERTURA', 'Reabertura'], ['VISITA', 'Visita de campo'],
  ['RETIRADA', 'Retirada'], ['JURIDICO', 'Encaminhamento jurídico'],
  ['CANCELAMENTO_FECHAMENTO', 'Cancelamento de fechamento']
];
const vazio = tipo => ({ id: null, tipo, codigo: '', nome: '', descricao: '', ativo: true,
  ordem: 100, exigeObservacao: false });

export default function CatalogosMotivosPage() {
  const [motivos, setMotivos] = useState([]);
  const [tipo, setTipo] = useState('MOVIMENTACAO');
  const [novo, setNovo] = useState(vazio('MOVIMENTACAO'));
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const carregar = () => listarMotivos({ somenteAtivos: false }).then(setMotivos)
    .catch(() => setErro('Não foi possível carregar os catálogos de motivos.'));
  useEffect(() => { carregar(); }, []);
  useEffect(() => { setNovo(vazio(tipo)); }, [tipo]);
  const visiveis = useMemo(() => motivos.filter(item => item.tipo === tipo), [motivos, tipo]);
  const alterar = (id, campo, valor) => setMotivos(atuais => atuais.map(item =>
    item.id === id ? { ...item, [campo]: valor } : item));
  const salvar = async dados => {
    setSalvando(true); setErro(''); setSucesso('');
    try {
      setMotivos(await salvarMotivos(dados)); setNovo(vazio(tipo));
      setSucesso('Catálogo atualizado. As próximas ações já usarão esta configuração.');
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Não foi possível salvar o catálogo.');
    } finally { setSalvando(false); }
  };

  return <Stack spacing={3}>
    <Box>
      <Typography variant="h4" fontWeight={700}>Catálogos de motivos</Typography>
      <Typography color="text.secondary">
        Códigos existentes são permanentes. Desative um item para preservar o histórico.
      </Typography>
    </Box>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}
    <TextField select label="Catálogo" value={tipo} sx={{ maxWidth: 360 }}
      onChange={event => setTipo(event.target.value)}>
      {TIPOS.map(([valor, nome]) => <MenuItem key={valor} value={valor}>{nome}</MenuItem>)}
    </TextField>
    <Card><CardContent><Stack spacing={2}>
      {visiveis.map(item => <Stack key={item.id} spacing={1} p={2} border={1} borderColor="divider" borderRadius={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField size="small" label="Código" value={item.codigo} disabled sx={{ minWidth: 220 }} />
          <TextField size="small" label="Nome" value={item.nome} sx={{ flex: 1 }}
            onChange={event => alterar(item.id, 'nome', event.target.value)} />
          <TextField size="small" type="number" label="Ordem" value={item.ordem} sx={{ width: 110 }}
            onChange={event => alterar(item.id, 'ordem', Number(event.target.value))} />
        </Stack>
        <TextField size="small" label="Descrição" value={item.descricao || ''}
          onChange={event => alterar(item.id, 'descricao', event.target.value)} />
        <Stack direction="row" spacing={3}>
          <FormControlLabel control={<Checkbox checked={item.ativo}
            onChange={event => alterar(item.id, 'ativo', event.target.checked)} />} label="Ativo" />
          <FormControlLabel control={<Checkbox checked={item.exigeObservacao}
            onChange={event => alterar(item.id, 'exigeObservacao', event.target.checked)} />}
            label="Exige observação" />
        </Stack>
      </Stack>)}
      <Button variant="outlined" disabled={salvando || !visiveis.length}
        onClick={() => salvar(visiveis)}>Salvar alterações</Button>
    </Stack></CardContent></Card>
    <Card><CardContent><Stack spacing={2}>
      <Typography variant="h6">Adicionar motivo</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField size="small" label="Código" value={novo.codigo} sx={{ minWidth: 220 }}
          helperText="Será normalizado e não poderá ser alterado"
          onChange={event => setNovo({ ...novo, codigo: event.target.value })} />
        <TextField size="small" label="Nome" value={novo.nome} sx={{ flex: 1 }}
          onChange={event => setNovo({ ...novo, nome: event.target.value })} />
        <TextField size="small" type="number" label="Ordem" value={novo.ordem} sx={{ width: 110 }}
          onChange={event => setNovo({ ...novo, ordem: Number(event.target.value) })} />
      </Stack>
      <TextField size="small" label="Descrição" value={novo.descricao}
        onChange={event => setNovo({ ...novo, descricao: event.target.value })} />
      <FormControlLabel control={<Checkbox checked={novo.exigeObservacao}
        onChange={event => setNovo({ ...novo, exigeObservacao: event.target.checked })} />}
        label="Exige observação" />
      <Button variant="contained" disabled={salvando || !novo.codigo.trim() || !novo.nome.trim()}
        onClick={() => salvar([novo])}>Adicionar ao catálogo</Button>
    </Stack></CardContent></Card>
  </Stack>;
}
