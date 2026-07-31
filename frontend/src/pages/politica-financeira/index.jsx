import { useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Checkbox, Chip, Divider, FormControlLabel,
  Grid, MenuItem, Stack, TextField, Typography
} from '@mui/material';
import {
  consultarPoliticaFinanceira, listarHistoricoPoliticaFinanceira, publicarPoliticaFinanceira
} from '@/services/politicaFinanceira';

const opcoes = {
  jurosTipo: [['SIMPLES', 'Simples'], ['COMPOSTO', 'Composto']],
  jurosPeriodicidade: [['DIARIA', 'Diaria'], ['MENSAL', 'Mensal'], ['ANUAL', 'Anual']],
  inicio: [['NO_VENCIMENTO', 'No vencimento'], ['DIA_SEGUINTE', 'Dia seguinte'], ['APOS_CARENCIA', 'Apos carencia']],
  multaTipo: [['PERCENTUAL', 'Percentual'], ['VALOR_FIXO', 'Valor fixo']],
  metodo: [['MEIO_PARA_CIMA', 'Meio para cima'], ['MEIO_PARA_BAIXO', 'Meio para baixo'],
    ['MEIO_PAR', 'Meio par'], ['TRUNCAR', 'Truncar'], ['PARA_CIMA', 'Para cima'], ['PARA_BAIXO', 'Para baixo']],
  momento: [['POR_COMPONENTE', 'Por componente'], ['POR_PARCELA', 'Por parcela'], ['TOTAL_FINAL', 'Total final']],
  centavos: [['PRIMEIRA_PARCELA', 'Primeira parcela'], ['ULTIMA_PARCELA', 'Ultima parcela'], ['DISTRIBUIR', 'Distribuir']],
  diaNaoUtil: [['PROXIMO_DIA_UTIL', 'Proximo dia util'], ['DIA_UTIL_ANTERIOR', 'Dia util anterior'], ['MANTER', 'Manter data']]
};

const CampoNumero = ({ label, value, onChange, ...props }) => <TextField size="small" type="number"
  label={label} value={value ?? ''} onChange={event => onChange(event.target.value === '' ? null : Number(event.target.value))}
  inputProps={{ min: 0, step: '0.01' }} fullWidth {...props} />;
const CampoSelecao = ({ label, value, onChange, items }) => <TextField select size="small" fullWidth
  label={label} value={value} onChange={event => onChange(event.target.value)}>
  {items.map(([codigo, nome]) => <MenuItem key={codigo} value={codigo}>{nome}</MenuItem>)}
</TextField>;
const Secao = ({ titulo, children }) => <Card><CardContent><Stack spacing={2}>
  <Typography variant="h6">{titulo}</Typography><Divider />{children}
</Stack></CardContent></Card>;

export default function PoliticaFinanceiraPage() {
  const [politica, setPolitica] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [salvando, setSalvando] = useState(false);

  const carregar = async () => {
    const [atual, versoes] = await Promise.all([
      consultarPoliticaFinanceira(), listarHistoricoPoliticaFinanceira()
    ]);
    setPolitica(atual); setHistorico(versoes);
  };
  useEffect(() => { carregar().catch(() => setErro('Nao foi possivel carregar a politica financeira.')); }, []);
  const alterar = (campo, valor) => setPolitica(atual => ({ ...atual, [campo]: valor }));
  const alterarAlcada = (indice, campo, valor) => setPolitica(atual => ({ ...atual,
    alcadas: atual.alcadas.map((item, i) => i === indice ? { ...item, [campo]: valor } : item)
  }));
  const publicar = async () => {
    setSalvando(true); setErro(''); setAviso('');
    try {
      const nova = await publicarPoliticaFinanceira(politica);
      setPolitica(nova); await carregar();
      setAviso(`Versao ${nova.versao} publicada. Novas negociacoes usarao esta configuracao.`);
    } catch (error) {
      setErro(error.response?.data?.message || error.response?.data?.erro || 'Nao foi possivel publicar a politica.');
    } finally { setSalvando(false); }
  };
  if (!politica) return <Stack spacing={2}><Typography variant="h4">Politica financeira</Typography>{erro && <Alert severity="error">{erro}</Alert>}</Stack>;

  return <Stack spacing={3}>
    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
      <Box><Typography variant="h4" fontWeight={700}>Politica financeira</Typography>
        <Typography color="text.secondary">Configure encargos, parcelamento, entrada, quebra e alcadas. Publicar cria uma nova versao imutavel.</Typography></Box>
      <Chip color="success" label={`Versao vigente: ${politica.versao}`} />
    </Stack>
    {erro && <Alert severity="error" onClose={() => setErro('')}>{erro}</Alert>}
    {aviso && <Alert severity="success" onClose={() => setAviso('')}>{aviso}</Alert>}
    <Secao titulo="Juros">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Tipo" value={politica.jurosTipo} items={opcoes.jurosTipo} onChange={v => alterar('jurosTipo', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Percentual (%)" value={politica.jurosPercentual} onChange={v => alterar('jurosPercentual', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Periodicidade" value={politica.jurosPeriodicidade} items={opcoes.jurosPeriodicidade} onChange={v => alterar('jurosPeriodicidade', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Inicio" value={politica.jurosInicio} items={opcoes.inicio} onChange={v => { alterar('jurosInicio', v); if (v !== 'APOS_CARENCIA') alterar('jurosCarenciaDias', 0); }} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Carencia (dias)" value={politica.jurosCarenciaDias} disabled={politica.jurosInicio !== 'APOS_CARENCIA'} onChange={v => alterar('jurosCarenciaDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Limite percentual" value={politica.jurosLimitePercentual} onChange={v => alterar('jurosLimitePercentual', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormControlLabel control={<Checkbox checked={politica.jurosSobreMulta} onChange={e => alterar('jurosSobreMulta', e.target.checked)} />} label="Aplicar juros sobre multa" /></Grid>
      </Grid>
    </Secao>
    <Secao titulo="Multa">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Tipo" value={politica.multaTipo} items={opcoes.multaTipo} onChange={v => alterar('multaTipo', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label={politica.multaTipo === 'PERCENTUAL' ? 'Percentual (%)' : 'Valor fixo'} value={politica.multaValor} onChange={v => alterar('multaValor', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Limite monetario" value={politica.multaLimite} onChange={v => alterar('multaLimite', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Inicio" value={politica.multaInicio} items={opcoes.inicio} onChange={v => { alterar('multaInicio', v); if (v !== 'APOS_CARENCIA') alterar('multaCarenciaDias', 0); }} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Carencia (dias)" value={politica.multaCarenciaDias} disabled={politica.multaInicio !== 'APOS_CARENCIA'} onChange={v => alterar('multaCarenciaDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><FormControlLabel control={<Checkbox checked={politica.multaRecorrente} onChange={e => alterar('multaRecorrente', e.target.checked)} />} label="Multa recorrente" /></Grid>
      </Grid>
    </Secao>
    <Secao titulo="Arredondamento e centavos">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Casas decimais" value={politica.casasDecimais} onChange={v => alterar('casasDecimais', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Metodo" value={politica.metodoArredondamento} items={opcoes.metodo} onChange={v => alterar('metodoArredondamento', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Momento" value={politica.momentoArredondamento} items={opcoes.momento} onChange={v => alterar('momentoArredondamento', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Diferenca de centavos" value={politica.destinoCentavos} items={opcoes.centavos} onChange={v => alterar('destinoCentavos', v)} /></Grid>
      </Grid>
    </Secao>
    <Secao titulo="Parcelamento e entrada">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Maximo de parcelas" value={politica.maximoParcelas} onChange={v => alterar('maximoParcelas', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Valor minimo da parcela" value={politica.valorMinimoParcela} onChange={v => alterar('valorMinimoParcela', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Intervalo entre parcelas (dias)" value={politica.intervaloParcelasDias} onChange={v => alterar('intervaloParcelasDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoSelecao label="Dia nao util" value={politica.ajusteDiaNaoUtil} items={opcoes.diaNaoUtil} onChange={v => alterar('ajusteDiaNaoUtil', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Entrada minima (%)" value={politica.entradaPercentualMinimo} onChange={v => alterar('entradaPercentualMinimo', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Entrada minima (R$)" value={politica.entradaValorMinimo} onChange={v => alterar('entradaValorMinimo', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Prazo da entrada (dias)" value={politica.entradaPrazoDias} onChange={v => alterar('entradaPrazoDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Primeira parcela apos (dias)" value={politica.primeiraParcelaDias} onChange={v => alterar('primeiraParcelaDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormControlLabel control={<Checkbox checked={politica.entradaObrigatoria} onChange={e => alterar('entradaObrigatoria', e.target.checked)} />} label="Entrada obrigatoria" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormControlLabel control={<Checkbox checked={politica.permiteMultiplosContratos} onChange={e => alterar('permiteMultiplosContratos', e.target.checked)} />} label="Permitir varios contratos" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormControlLabel control={<Checkbox checked={politica.bloqueiaContratoJuridico} onChange={e => alterar('bloqueiaContratoJuridico', e.target.checked)} />} label="Bloquear contrato no juridico" /></Grid>
      </Grid>
    </Secao>
    <Secao titulo="Validade e quebra do acordo">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Validade da proposta (dias)" value={politica.validadePropostaDias} onChange={v => alterar('validadePropostaDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Tolerancia da parcela (dias)" value={politica.toleranciaParcelaDias} onChange={v => alterar('toleranciaParcelaDias', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Parcelas vencidas para quebra" value={politica.parcelasVencidasParaQuebra} onChange={v => alterar('parcelasVencidasParaQuebra', v)} /></Grid>
        <Grid size={{ xs: 12, md: 3 }}><CampoNumero label="Maximo de renegociacoes" value={politica.maximoRenegociacoes} disabled={!politica.permiteRenegociacao} onChange={v => alterar('maximoRenegociacoes', v)} /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormControlLabel control={<Checkbox checked={politica.perdeDescontoNaQuebra} onChange={e => alterar('perdeDescontoNaQuebra', e.target.checked)} />} label="Perder desconto na quebra" /></Grid>
        <Grid size={{ xs: 12, md: 4 }}><FormControlLabel control={<Checkbox checked={politica.permiteRenegociacao} onChange={e => { alterar('permiteRenegociacao', e.target.checked); if (!e.target.checked) alterar('maximoRenegociacoes', 0); }} />} label="Permitir renegociacao" /></Grid>
      </Grid>
    </Secao>
    <Secao titulo="Alcadas de desconto por perfil">
      {politica.alcadas.map((alcada, indice) => <Stack key={alcada.perfil} direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'center' }}>
        <Typography fontWeight={700} width={{ lg: 150 }}>{alcada.perfil}</Typography>
        <Box width={{ lg: 180 }}><CampoNumero label="Percentual maximo" value={alcada.percentualMaximo} onChange={v => alterarAlcada(indice, 'percentualMaximo', v)} /></Box>
        <Box width={{ lg: 180 }}><CampoNumero label="Valor maximo" value={alcada.valorMaximo} onChange={v => alterarAlcada(indice, 'valorMaximo', v)} /></Box>
        {['permitePrincipal', 'permiteJuros', 'permiteMulta', 'exigeAprovacao'].map(campo => <FormControlLabel key={campo}
          control={<Checkbox checked={alcada[campo]} onChange={e => alterarAlcada(indice, campo, e.target.checked)} />}
          label={{ permitePrincipal: 'Principal', permiteJuros: 'Juros', permiteMulta: 'Multa', exigeAprovacao: 'Exige aprovacao' }[campo]} />)}
      </Stack>)}
      <Alert severity="info">Acima da alcada, a proposta exigira aprovacao. O aprovador somente podera aprovar ou rejeitar.</Alert>
    </Secao>
    <Secao titulo="Historico de publicacoes">
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {historico.map(item => <Chip key={item.id} color={item.vigente ? 'success' : 'default'}
          label={`v${item.versao} - ${item.publicadaPor} - ${new Date(item.publicadaEm).toLocaleString('pt-BR')}`} />)}
      </Stack>
    </Secao>
    <Stack direction="row" justifyContent="flex-end">
      <Button variant="contained" size="large" onClick={publicar} disabled={salvando}>
        {salvando ? 'Publicando...' : 'Publicar nova versao'}
      </Button>
    </Stack>
  </Stack>;
}
