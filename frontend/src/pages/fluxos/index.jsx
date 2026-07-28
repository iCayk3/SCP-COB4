import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, Chip, Divider, FormControlLabel,
  Grid, IconButton, MenuItem, Select, Snackbar, Stack, Switch, TextField, Typography
} from '@mui/material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import { criarFluxo, editarFluxo, listarFluxos } from '@/services/fluxos';

const novoFluxo = () => ({
  id: null, codigo: '', nome: 'Novo fluxo', ativo: true, padrao: false,
  estados: [
    { codigo: 'NOVO', nome: 'Novo', ordem: 1, inicial: true, terminal: false },
    { codigo: 'ENCERRADO', nome: 'Encerrado', ordem: 2, inicial: false, terminal: true }
  ],
  transicoes: [
    { origemCodigo: 'NOVO', destinoCodigo: 'ENCERRADO', nome: 'Encerrar', automatica: false, horasSemResposta: null }
  ]
});

export default function FluxosPage() {
  const [fluxos, setFluxos] = useState([]);
  const [draft, setDraft] = useState(null);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState('');

  const carregar = async () => {
    try {
      const dados = await listarFluxos();
      setFluxos(dados);
      setDraft(atual => atual || dados[0] || novoFluxo());
    } catch {
      setErro('Não foi possível carregar os fluxos.');
    }
  };
  useEffect(() => { carregar(); }, []);

  const alterarEstado = (indice, campo, valor) => {
    const estados = draft.estados.map((item, i) => ({
      ...item,
      ...(campo === 'inicial' && valor ? { inicial: i === indice } : {}),
      ...(i === indice ? { [campo]: valor } : {})
    }));
    setDraft({ ...draft, estados });
  };
  const salvar = async () => {
    setSalvando(true); setErro('');
    try {
      const salvo = draft.id ? await editarFluxo(draft.id, draft) : await criarFluxo(draft);
      setDraft(salvo); setAviso('Fluxo salvo com sucesso.');
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || error.response?.data?.message || 'Não foi possível salvar o fluxo.');
    } finally {
      setSalvando(false);
    }
  };

  return <Stack spacing={3}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
        <div><Typography variant="h4" fontWeight={700}>Fluxos de cobrança</Typography>
          <Typography color="text.secondary">Crie estados e defina as transições permitidas.</Typography></div>
        <Button startIcon={<Add />} variant="contained" onClick={() => setDraft(novoFluxo())}>Novo fluxo</Button>
      </Stack>
      {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card><CardContent><Stack spacing={1}>
            {fluxos.map(fluxo => <Button key={fluxo.id} onClick={() => setDraft(structuredClone(fluxo))}
              variant={draft?.id === fluxo.id ? 'contained' : 'text'} sx={{ justifyContent: 'flex-start' }}>
              {fluxo.nome}{fluxo.padrao ? ' • Padrão' : ''}
            </Button>)}
          </Stack></CardContent></Card>
        </Grid>
        <Grid size={{ xs: 12, md: 9 }}>
          {draft && <Card><CardContent><Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField fullWidth label="Nome do fluxo" value={draft.nome}
                onChange={e => setDraft({ ...draft, nome: e.target.value })} />
              <TextField fullWidth label="Código" value={draft.codigo || ''} disabled={Boolean(draft.id)}
                onChange={e => setDraft({ ...draft, codigo: e.target.value })} />
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControlLabel control={<Switch checked={draft.ativo}
                onChange={e => setDraft({ ...draft, ativo: e.target.checked })} />} label="Ativo" />
              <FormControlLabel control={<Switch checked={draft.padrao}
                onChange={e => setDraft({ ...draft, padrao: e.target.checked })} />} label="Fluxo padrão" />
            </Stack>
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Estados</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => setDraft({
                ...draft, estados: [...draft.estados, {
                  codigo: `ESTADO_${draft.estados.length + 1}`, nome: 'Novo estado',
                  ordem: draft.estados.length + 1, inicial: false, terminal: false
                }]
              })}>Adicionar estado</Button>
            </Stack>
            {draft.estados.map((estado, indice) => <Stack key={`${estado.codigo}-${indice}`}
              direction={{ xs: 'column', lg: 'row' }} spacing={1} alignItems={{ lg: 'center' }}>
              <TextField size="small" label="Código" value={estado.codigo}
                onChange={e => alterarEstado(indice, 'codigo', e.target.value)} />
              <TextField size="small" label="Nome" value={estado.nome} sx={{ flex: 1 }}
                onChange={e => alterarEstado(indice, 'nome', e.target.value)} />
              <TextField size="small" type="number" label="Ordem" value={estado.ordem} sx={{ width: 90 }}
                onChange={e => alterarEstado(indice, 'ordem', Number(e.target.value))} />
              <FormControlLabel control={<Checkbox checked={estado.inicial}
                onChange={e => alterarEstado(indice, 'inicial', e.target.checked)} />} label="Inicial" />
              <FormControlLabel control={<Checkbox checked={estado.terminal}
                onChange={e => alterarEstado(indice, 'terminal', e.target.checked)} />} label="Final" />
              <IconButton color="error" disabled={draft.estados.length <= 2} onClick={() => setDraft({
                ...draft, estados: draft.estados.filter((_, i) => i !== indice)
              })}><DeleteOutline /></IconButton>
            </Stack>)}
            <Divider />
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Transições</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => setDraft({
                ...draft, transicoes: [...draft.transicoes, {
                  origemCodigo: draft.estados[0]?.codigo || '', destinoCodigo: draft.estados[1]?.codigo || '',
                  nome: 'Nova transição', automatica: false, horasSemResposta: null
                }]
              })}>Adicionar transição</Button>
            </Stack>
            {draft.transicoes.map((transicao, indice) => <Box key={indice} p={1.5} border={1}
              borderColor="divider" borderRadius={1}>
              <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1} alignItems={{ lg: 'center' }}>
                <Select size="small" value={transicao.origemCodigo} sx={{ minWidth: 145 }}
                  onChange={e => setDraft({ ...draft, transicoes: draft.transicoes.map((t, i) =>
                    i === indice ? { ...t, origemCodigo: e.target.value } : t) })}>
                  {draft.estados.map(e => <MenuItem key={e.codigo} value={e.codigo}>{e.nome}</MenuItem>)}
                </Select>
                <Typography>→</Typography>
                <Select size="small" value={transicao.destinoCodigo} sx={{ minWidth: 145 }}
                  onChange={e => setDraft({ ...draft, transicoes: draft.transicoes.map((t, i) =>
                    i === indice ? { ...t, destinoCodigo: e.target.value } : t) })}>
                  {draft.estados.map(e => <MenuItem key={e.codigo} value={e.codigo}>{e.nome}</MenuItem>)}
                </Select>
                <TextField size="small" label="Ação" value={transicao.nome} sx={{ flex: 1 }}
                  onChange={e => setDraft({ ...draft, transicoes: draft.transicoes.map((t, i) =>
                    i === indice ? { ...t, nome: e.target.value } : t) })} />
                <FormControlLabel control={<Switch checked={transicao.automatica}
                  onChange={e => setDraft({ ...draft, transicoes: draft.transicoes.map((t, i) =>
                    i === indice ? { ...t, automatica: e.target.checked,
                      horasSemResposta: e.target.checked ? (t.horasSemResposta || 18) : null } : t) })} />}
                  label="Automática" />
                {transicao.automatica && <TextField size="small" type="number" label="Horas"
                  value={transicao.horasSemResposta || 18} sx={{ width: 90 }}
                  onChange={e => setDraft({ ...draft, transicoes: draft.transicoes.map((t, i) =>
                    i === indice ? { ...t, horasSemResposta: Number(e.target.value) } : t) })} />}
                <IconButton color="error" disabled={draft.transicoes.length <= 1} onClick={() => setDraft({
                  ...draft, transicoes: draft.transicoes.filter((_, i) => i !== indice)
                })}><DeleteOutline /></IconButton>
              </Stack>
            </Box>)}
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" size="large" onClick={salvar} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar fluxo'}
              </Button>
            </Stack>
          </Stack></CardContent></Card>}
        </Grid>
      </Grid>
      <Snackbar open={Boolean(aviso)} autoHideDuration={5000} onClose={() => setAviso('')} message={aviso} />
    </Stack>;
}
