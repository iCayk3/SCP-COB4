import { useEffect, useMemo, useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, Checkbox, Chip, CircularProgress, Divider,
  FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField, Typography
} from '@mui/material';
import { buscarProtocolosDoCliente } from '@/services/cobrancas';
import {
  alterarEstadoProcesso, alterarEstadoProcessosEmLote, consultarEstadoProcesso
} from '@/services/fluxos';
import { useAuth } from '@/hooks/useAuth';
import { listarMotivos } from '@/services/catalogos';

const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL'
});
const rotulo = valor => valor?.replaceAll('_', ' ') || '—';

export default function ClientInfoPanel({ processo, onAtualizar }) {
  const { user } = useAuth();
  const [visao, setVisao] = useState(null);
  const [estados, setEstados] = useState({});
  const [selecionados, setSelecionados] = useState([]);
  const [destino, setDestino] = useState('');
  const [observacao, setObservacao] = useState('');
  const [motivos, setMotivos] = useState([]);
  const [motivoCodigo, setMotivoCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const carregar = async () => {
    if (!processo) return;
    setCarregando(true); setErro('');
    try {
      const consolidado = await buscarProtocolosDoCliente(processo.cpf);
      const detalhes = await Promise.all(consolidado.protocolos.map(async protocolo => [
        protocolo.referencia, await consultarEstadoProcesso(protocolo.referencia)
      ]));
      setVisao(consolidado);
      setEstados(Object.fromEntries(detalhes));
      setSelecionados(atuais => {
        const validos = atuais.filter(ref => consolidado.protocolos.some(p => p.referencia === ref));
        return validos.length ? validos : [processo.referencia];
      });
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Não foi possível consultar os protocolos do cliente.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    setVisao(null); setEstados({}); setSelecionados([]); setDestino('');
    setMotivoCodigo(''); setObservacao(''); setErro(''); setSucesso('');
    carregar();
  }, [processo?.cpf]);

  useEffect(() => {
    setMotivoCodigo('');
    if (!destino) {
      setMotivos([]);
      return;
    }
    const tipo = ({ VISITA: 'VISITA', RETIRADA: 'RETIRADA', JURIDICO: 'JURIDICO',
      ENCERRADO: 'ENCERRAMENTO' })[destino] || 'MOVIMENTACAO';
    listarMotivos({ tipo }).then(setMotivos)
      .catch(() => setErro('Não foi possível carregar os motivos desta ação.'));
  }, [destino]);

  const destinosComuns = useMemo(() => {
    if (!selecionados.length) return [];
    const listas = selecionados.map(ref => estados[ref]?.destinos || []);
    return listas[0]?.filter(item => listas.every(lista => lista.some(d => d.codigo === item.codigo))) || [];
  }, [estados, selecionados]);

  useEffect(() => {
    if (!destinosComuns.some(item => item.codigo === destino)) setDestino('');
  }, [destinosComuns, destino]);

  const alternar = referencia => {
    setSelecionados(atuais => atuais.includes(referencia)
      ? atuais.filter(item => item !== referencia) : [...atuais, referencia]);
  };

  const movimentar = async () => {
    if (!destino || !selecionados.length) return;
    setCarregando(true); setErro(''); setSucesso('');
    const operadorNome = user?.displayName || user?.name || 'Operador SGC';
    const operadorIdentificador = user?.email || user?.id || 'OPERADOR_SGC';
    try {
      if (selecionados.length === 1) {
        await alterarEstadoProcesso(selecionados[0], {
          destino, operadorNome, operadorIdentificador, motivoCodigo, observacao
        });
        setSucesso('Protocolo movimentado com sucesso.');
      } else {
        const resultado = await alterarEstadoProcessosEmLote({
          referencias: selecionados, destino, operadorNome, operadorIdentificador, motivoCodigo, observacao
        });
        setSucesso(`${selecionados.length} protocolos movimentados na operação ${resultado.operacaoId}.`);
      }
      setDestino(''); setMotivoCodigo(''); setObservacao('');
      await carregar();
      onAtualizar?.();
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro
        || 'Não foi possível movimentar os protocolos.');
    } finally {
      setCarregando(false);
    }
  };

  if (!processo) return <Card sx={{ height: '100%', p: 3 }}>
      <Typography color="text.secondary">Selecione um atendimento.</Typography>
    </Card>;

  return <Card sx={{ minHeight: '100%' }}>
      <Stack spacing={2} p={2.5}>
        <Stack alignItems="center" textAlign="center" spacing={1}>
          <Avatar sx={{ width: 64, height: 64, fontSize: 26 }}>{processo.cliente?.charAt(0) || '?'}</Avatar>
          <Typography variant="h6">{processo.cliente}</Typography>
          <Chip size="small" color="primary"
            label={`${visao?.protocolos?.length || 0} protocolo(s) ativo(s)`} />
        </Stack>
        <Divider />
        {carregando && !visao && <Box textAlign="center"><CircularProgress size={24} /></Box>}
        {erro && <Alert severity="error">{erro}</Alert>}
        {sucesso && <Alert severity="success">{sucesso}</Alert>}
        {visao && <>
          <Box>
            <Typography variant="caption" color="text.secondary">Total em aberto do cliente</Typography>
            <Typography variant="h5" color="primary.main">{moeda(visao.valorTotal)}</Typography>
          </Box>
          <Typography variant="subtitle2">Protocolos do cliente</Typography>
          <Stack spacing={1}>
            {visao.protocolos.map(protocolo => <Box key={protocolo.referencia}
              border={1} borderColor={selecionados.includes(protocolo.referencia) ? 'primary.main' : 'divider'}
              borderRadius={2} p={1}>
              <FormControlLabel sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                control={<Checkbox size="small" checked={selecionados.includes(protocolo.referencia)}
                  onChange={() => alternar(protocolo.referencia)} />}
                label={<Box pt={0.5}>
                  <Typography variant="body2" fontWeight={700}>{protocolo.referencia}</Typography>
                  <Typography variant="caption" display="block">Contrato {protocolo.contratoReferencia}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {rotulo(estados[protocolo.referencia]?.estadoNome || protocolo.estadoFluxo)}
                    {' • '}{moeda(protocolo.valorTotal)}
                  </Typography>
                  <Typography variant="caption" display="block" color="warning.main">
                    {protocolo.diasAtraso || 0} dias • {rotulo(protocolo.faixaAtraso)}
                  </Typography>
                </Box>} />
            </Box>)}
          </Stack>
          <Divider />
          <Typography variant="subtitle2">
            Movimentar {selecionados.length} protocolo(s)
          </Typography>
          {selecionados.length > 1 && <Alert severity="info">
            A operação será aplicada a todos ou a nenhum protocolo.
          </Alert>}
          <FormControl fullWidth size="small" disabled={!selecionados.length}>
            <InputLabel>Próximo estado comum</InputLabel>
            <Select label="Próximo estado comum" value={destino}
              onChange={event => setDestino(event.target.value)}>
              {destinosComuns.map(item => <MenuItem key={item.codigo} value={item.codigo}>
                {item.nome} — {item.transicao}
              </MenuItem>)}
            </Select>
          </FormControl>
          {selecionados.length > 0 && destinosComuns.length === 0 &&
            <Alert severity="warning">Os protocolos selecionados não possuem uma próxima transição em comum.</Alert>}
          <FormControl fullWidth size="small" disabled={!destino}>
            <InputLabel>Motivo</InputLabel>
            <Select label="Motivo" value={motivoCodigo}
              onChange={event => setMotivoCodigo(event.target.value)}>
              {motivos.map(item => <MenuItem key={item.codigo} value={item.codigo}>
                {item.nome}{item.exigeObservacao ? ' — exige observação' : ''}
              </MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" label="Observação da negociação" multiline minRows={2}
            value={observacao} onChange={event => setObservacao(event.target.value)} />
          <Button variant="contained" disabled={!destino || !motivoCodigo || carregando} onClick={movimentar}>
            {selecionados.length > 1 ? 'Movimentar protocolos' : 'Movimentar protocolo'}
          </Button>
        </>}
      </Stack>
    </Card>;
}
