import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog,
  DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton,
  MenuItem, Stack, Switch, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Edit from '@mui/icons-material/Edit';
import LockReset from '@mui/icons-material/LockReset';
import { RoleBasedGuard } from '@/components/auth';
import { atualizarUsuario, criarUsuario, listarUsuarios } from '@/services/usuarios';

const PERFIS = [
  ['ADMINISTRADOR', 'Administrador'],
  ['GERENTE', 'Gerente'],
  ['SUPERVISOR', 'Supervisor'],
  ['OPERADOR', 'Operador'],
  ['FINANCEIRO', 'Financeiro'],
  ['CAMPO', 'Campo'],
  ['JURIDICO', 'Jurídico']
];

const VAZIO = {
  nome: '',
  identificador: '',
  senha: '',
  perfil: 'OPERADOR',
  ativo: true,
  presente: true,
  cargaMaxima: 50
};

function UsuariosContent() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [editando, setEditando] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setUsuarios(await listarUsuarios());
    } catch (error) {
      setErro(error.response?.data?.message || 'Não foi possível carregar os usuários.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const resumo = useMemo(() => ({
    ativos: usuarios.filter(item => item.ativo).length,
    operadoresPresentes: usuarios.filter(item => item.perfil === 'OPERADOR' && item.presente && item.ativo).length,
    trocaPendente: usuarios.filter(item => item.trocaSenhaObrigatoria).length
  }), [usuarios]);

  const novo = () => {
    setEditando(null);
    setForm(VAZIO);
    setErro('');
    setAberto(true);
  };

  const editar = usuario => {
    setEditando(usuario);
    setForm({
      nome: usuario.nome,
      identificador: usuario.identificador,
      senha: '',
      perfil: usuario.perfil,
      ativo: usuario.ativo,
      presente: usuario.presente,
      cargaMaxima: usuario.cargaMaxima
    });
    setErro('');
    setAberto(true);
  };

  const alterar = (campo, valor) => setForm(atual => ({ ...atual, [campo]: valor }));

  const salvar = async event => {
    event.preventDefault();
    setSalvando(true);
    setErro('');
    setSucesso('');
    try {
      if (!editando && !form.senha) throw new Error('Informe uma senha temporária.');
      const salvo = editando
        ? await atualizarUsuario(editando.id, form)
        : await criarUsuario(form);
      setUsuarios(atuais => editando
        ? atuais.map(item => item.id === salvo.id ? salvo : item)
        : [...atuais, salvo]);
      setSucesso(editando ? 'Usuário atualizado e sessões incompatíveis revogadas.'
        : 'Usuário criado. A troca da senha temporária será exigida no primeiro acesso.');
      setAberto(false);
    } catch (error) {
      setErro(error.response?.data?.message || error.message || 'Não foi possível salvar o usuário.');
    } finally {
      setSalvando(false);
    }
  };

  return <Stack spacing={3}>
    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Gestão de usuários</Typography>
        <Typography color="text.secondary">
          Perfis, acesso, presença operacional, capacidade e redefinição de senha.
        </Typography>
      </Box>
      <Button variant="contained" startIcon={<Add />} onClick={novo}>Novo usuário</Button>
    </Stack>

    {erro && !aberto && <Alert severity="error">{erro}</Alert>}
    {sucesso && <Alert severity="success" onClose={() => setSucesso('')}>{sucesso}</Alert>}

    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <Resumo titulo="Usuários ativos" valor={resumo.ativos} />
      <Resumo titulo="Operadores presentes" valor={resumo.operadoresPresentes} />
      <Resumo titulo="Trocas de senha pendentes" valor={resumo.trocaPendente} />
    </Stack>

    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Perfil</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Presença</TableCell>
              <TableCell align="right">Carga máxima</TableCell>
              <TableCell>Senha</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carregando && <TableRow><TableCell colSpan={7} align="center">
              <CircularProgress size={28} />
            </TableCell></TableRow>}
            {!carregando && usuarios.map(usuario => <TableRow key={usuario.id} hover>
              <TableCell>
                <Typography fontWeight={600}>{usuario.nome}</Typography>
                <Typography variant="caption" color="text.secondary">{usuario.identificador}</Typography>
              </TableCell>
              <TableCell><Chip size="small" variant="outlined"
                label={PERFIS.find(item => item[0] === usuario.perfil)?.[1] || usuario.perfil} /></TableCell>
              <TableCell><Chip size="small" color={usuario.ativo ? 'success' : 'default'}
                label={usuario.ativo ? 'Ativo' : 'Bloqueado'} /></TableCell>
              <TableCell>{usuario.perfil === 'OPERADOR'
                ? <Chip size="small" color={usuario.presente ? 'info' : 'default'}
                    label={usuario.presente ? 'Presente' : 'Ausente'} />
                : '—'}</TableCell>
              <TableCell align="right">{usuario.perfil === 'OPERADOR' ? usuario.cargaMaxima : '—'}</TableCell>
              <TableCell>{usuario.trocaSenhaObrigatoria
                ? <Chip size="small" color="warning" label="Troca pendente" />
                : <Chip size="small" variant="outlined" label="Definida" />}</TableCell>
              <TableCell align="right">
                <Tooltip title="Editar usuário ou definir senha temporária">
                  <IconButton onClick={() => editar(usuario)}>
                    {usuario.trocaSenhaObrigatoria ? <LockReset /> : <Edit />}
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>)}
            {!carregando && usuarios.length === 0 && <TableRow>
              <TableCell colSpan={7} align="center">Nenhum usuário cadastrado.</TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>

    <Dialog open={aberto} onClose={() => !salvando && setAberto(false)} fullWidth maxWidth="sm"
      component="form" onSubmit={salvar}>
      <DialogTitle>{editando ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField label="Nome" value={form.nome} onChange={e => alterar('nome', e.target.value)} required />
          <TextField label="Identificador de login" value={form.identificador}
            onChange={e => alterar('identificador', e.target.value)} required
            helperText="Use letras, números, ponto, hífen ou sublinhado." />
          <TextField select label="Perfil" value={form.perfil}
            onChange={e => alterar('perfil', e.target.value)}>
            {PERFIS.map(([valor, nome]) => <MenuItem key={valor} value={valor}>{nome}</MenuItem>)}
          </TextField>
          <TextField label={editando ? 'Nova senha temporária (opcional)' : 'Senha temporária'}
            type="password" value={form.senha} onChange={e => alterar('senha', e.target.value)}
            required={!editando}
            helperText="12 a 72 caracteres, com maiúscula, minúscula, número e símbolo." />
          {form.perfil === 'OPERADOR' && <TextField label="Carga máxima" type="number"
            value={form.cargaMaxima} onChange={e => alterar('cargaMaxima', Number(e.target.value))}
            inputProps={{ min: 1 }} required />}
          <Stack direction="row" spacing={3}>
            <FormControlLabel control={<Switch checked={form.ativo}
              onChange={e => alterar('ativo', e.target.checked)} />} label="Usuário ativo" />
            {form.perfil === 'OPERADOR' && <FormControlLabel control={<Switch checked={form.presente}
              onChange={e => alterar('presente', e.target.checked)} />} label="Presente" />}
          </Stack>
          {editando && form.senha && <Alert severity="warning">
            A nova senha será temporária, exigirá troca no próximo acesso e revogará as sessões atuais.
          </Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setAberto(false)} disabled={salvando}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  </Stack>;
}

function Resumo({ titulo, valor }) {
  return <Card sx={{ flex: 1 }}><CardContent>
    <Typography color="text.secondary" variant="body2">{titulo}</Typography>
    <Typography variant="h4" fontWeight={700}>{valor}</Typography>
  </CardContent></Card>;
}

export default function UsuariosPage() {
  return <RoleBasedGuard roles={['administrator', 'admin']}>
    <UsuariosContent />
  </RoleBasedGuard>;
}
