import { useEffect, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControl, InputBase, InputLabel, MenuItem,
  Select, Snackbar, Stack, TextField, Typography
} from '@mui/material';
import ChevronRight from '@mui/icons-material/ChevronRight';
import SendRounded from '@mui/icons-material/SendRounded';
import TaskAltRounded from '@mui/icons-material/TaskAltRounded';
import AttachFileRounded from '@mui/icons-material/AttachFileRounded';
import { FlexBetween, FlexBox } from '@/components/flexbox';
import { Scrollbar } from '@/components/scrollbar';
import { StyledIconButton, ToggleBtn } from './styles';
import { listarAtendimentos, registrarAtendimento } from '@/services/atendimentos';
import { enviarAnexo } from '@/services/atendimentos';
import { useAuth } from '@/hooks/useAuth';

const RESULTADOS = [
  ['SEM_CONTATO', 'Sem contato'], ['ATENDEU', 'Atendeu'], ['NEGOCIACAO', 'Negociacao'],
  ['PROMESSA', 'Promessa'], ['PAGAMENTO', 'Pagamento'], ['VISITA', 'Visita'],
  ['SUPERVISOR', 'Supervisor'], ['ENCERRAMENTO', 'Encerramento']
];

const rotulo = valor => valor?.replaceAll('_', ' ') || 'ABERTA';

export default function Conversation({ handleOpen, processo }) {
  const { user } = useAuth();
  const [texto, setTexto] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [dialogo, setDialogo] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
	const [classificacaoAnexo, setClassificacaoAnexo] = useState('OUTRO');
  const [form, setForm] = useState({ resultado: '', observacao: '', proximaAcao: '' });

  useEffect(() => {
    setMensagens([]);
    setHistorico([]);
    setErro('');
    if (processo) {
      listarAtendimentos(processo.referencia).then(setHistorico)
        .catch(() => setErro('Nao foi possivel consultar o historico deste processo.'));
    }
  }, [processo]);

  const enviar = () => {
    if (!texto.trim()) return;
    setMensagens(atuais => [...atuais, {
      autor: 'OPERADOR', mensagem: texto.trim(), enviadaEm: new Date().toISOString()
    }]);
    setTexto('');
  };
  const anexar = async event => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    setSalvando(true); setErro('');
    try {
      await enviarAnexo(processo.referencia, arquivo, classificacaoAnexo);
      setSucesso(true);
    } catch (error) {
      setErro(error.response?.data?.erro || error.response?.data?.message || 'Não foi possível anexar o arquivo.');
    } finally { setSalvando(false); event.target.value = ''; }
  };

  const salvar = async () => {
    if (!form.resultado || !form.observacao.trim() || !form.proximaAcao.trim() || mensagens.length === 0) {
      setErro('Informe resultado, observacao, proxima acao e envie ao menos uma mensagem.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      const operadorNome = user?.displayName || user?.name || 'Operador SGC';
      const operadorIdentificador = user?.email || user?.id || 'OPERADOR_SGC';
      const atendimento = await registrarAtendimento(processo.referencia, {
        canal: 'CHAT',
        resultado: form.resultado,
        observacao: form.observacao,
        proximaAcao: form.proximaAcao,
        operadorNome,
        operadorIdentificador,
        mensagens: mensagens.map(({ autor, mensagem }) => ({ autor, mensagem }))
      });
      setHistorico(atuais => [atendimento, ...atuais]);
      setMensagens([]);
      setForm({ resultado: '', observacao: '', proximaAcao: '' });
      setDialogo(false);
      setSucesso(true);
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Nao foi possivel registrar o atendimento.');
    } finally {
      setSalvando(false);
    }
  };

  if (!processo) {
    return <Card sx={{ minHeight: 680, display: 'grid', placeItems: 'center' }}>
      <Typography color="text.secondary">Selecione um processo para iniciar o atendimento.</Typography>
    </Card>;
  }

  return <Card className="h-full" sx={{
    height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'
  }}>
    <FlexBetween padding={3} sx={{ flexShrink: 0 }}>
      <FlexBox alignItems="center" gap={1.5}>
        <Avatar>{processo.cliente?.charAt(0)}</Avatar>
        <Box>
          <Typography fontWeight={600}>{processo.cliente}</Typography>
          <Typography variant="body2" color="text.secondary">
            {processo.referencia} - {processo.telefone || 'Telefone nao informado'}
          </Typography>
        </Box>
      </FlexBox>
      <Chip color="warning" size="small" label={rotulo(processo.estadoFluxo || processo.status)} />
    </FlexBetween>
    <Divider />

    <Box position="relative" sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <ToggleBtn screen="md" onClick={handleOpen}><ChevronRight sx={{ fontSize: 16, color: 'white' }} /></ToggleBtn>
      <Scrollbar style={{ height: '100%' }}>
        <Stack spacing={2} px={3} py={2} minHeight="100%">
          {historico.map(item => <Alert key={item.id} severity="info" icon={<TaskAltRounded />}>
            <Typography variant="body2" fontWeight={600}>
              {RESULTADOS.find(([valor]) => valor === item.resultado)?.[1] || item.resultado}
            </Typography>
            <Stack spacing={1} my={1}>
              {item.mensagens?.map(mensagem => <Box key={mensagem.id}
                alignSelf={mensagem.autor === 'CLIENTE' ? 'flex-start' : 'flex-end'}
                bgcolor={mensagem.autor === 'CLIENTE' ? 'grey.200' : 'primary.main'}
                color={mensagem.autor === 'CLIENTE' ? 'text.primary' : 'primary.contrastText'}
                px={1.5} py={1} borderRadius={2} maxWidth="85%">
                <Typography variant="caption" fontWeight={600}>
                  {mensagem.autor === 'CLIENTE' ? processo.cliente : item.operadorNome}
                </Typography>
                <Typography variant="body2">{mensagem.mensagem}</Typography>
              </Box>)}
            </Stack>
            <Typography variant="caption">
              {item.observacao} - Proxima acao: {item.proximaAcao}
            </Typography>
          </Alert>)}
          {mensagens.map((item, indice) => <Box key={`${item.enviadaEm}-${indice}`} alignSelf="flex-end"
            maxWidth={{ xs: '85%', md: '65%' }}>
            <Typography variant="caption" color="text.secondary">Operador</Typography>
            <Box bgcolor="primary.main" color="primary.contrastText" px={2} py={1.25} borderRadius={2}>
              <Typography variant="body2">{item.mensagem}</Typography>
            </Box>
          </Box>)}
        </Stack>
      </Scrollbar>
    </Box>
    <Divider />

    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    <Box px={3} py={2} sx={{ flexShrink: 0 }}>
      <FlexBetween gap={2}>
		<TextField select size="small" label="Tipo do anexo" value={classificacaoAnexo} sx={{ minWidth: 170 }} onChange={e => setClassificacaoAnexo(e.target.value)}><MenuItem value="OUTRO">Outro</MenuItem><MenuItem value="DOCUMENTO">Documento</MenuItem><MenuItem value="COMPROVANTE">Comprovante protegido</MenuItem></TextField>
        <Button component="label" size="small" startIcon={<AttachFileRounded />} disabled={salvando}>
          Anexar
          <input hidden type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={anexar} />
        </Button>
        <InputBase fullWidth value={texto} onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') enviar(); }}
          inputProps={{ 'aria-label': 'Mensagem do atendimento' }}
          placeholder="Digite a mensagem do atendimento..." />
        <StyledIconButton onClick={enviar} aria-label="Enviar mensagem"><SendRounded /></StyledIconButton>
      </FlexBetween>
      <FlexBetween mt={2}>
        <Typography variant="caption" color="text.secondary">
          {mensagens.length} mensagem(ns) nesta conversa
        </Typography>
        <Button variant="contained" onClick={() => setDialogo(true)} disabled={!mensagens.length}>
          Concluir atendimento
        </Button>
      </FlexBetween>
    </Box>

    <Dialog open={dialogo} onClose={() => !salvando && setDialogo(false)} fullWidth maxWidth="sm">
      <DialogTitle>Resultado do atendimento</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} mt={1}>
          <FormControl fullWidth required>
            <InputLabel>Resultado</InputLabel>
            <Select label="Resultado" value={form.resultado}
              onChange={e => setForm({ ...form, resultado: e.target.value })}>
              {RESULTADOS.map(([valor, label]) => <MenuItem key={valor} value={valor}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField required multiline minRows={3} label="Observacao" value={form.observacao}
            onChange={e => setForm({ ...form, observacao: e.target.value })} />
          <TextField required multiline minRows={2} label="Proxima acao" value={form.proximaAcao}
            onChange={e => setForm({ ...form, proximaAcao: e.target.value })} />
          <TextField label="Canal" value="Chat" disabled />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogo(false)} disabled={salvando}>Cancelar</Button>
        <Button variant="contained" onClick={salvar} disabled={salvando}
          startIcon={salvando ? <CircularProgress size={16} color="inherit" /> : <TaskAltRounded />}>
          Registrar atendimento
        </Button>
      </DialogActions>
    </Dialog>
    <Snackbar open={sucesso} autoHideDuration={5000} onClose={() => setSucesso(false)}
      message="Atendimento registrado no historico" />
  </Card>;
}
