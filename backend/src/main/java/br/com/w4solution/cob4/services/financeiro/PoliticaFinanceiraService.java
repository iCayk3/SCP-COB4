package br.com.w4solution.cob4.services.financeiro;

import br.com.w4solution.cob4.domain.AlcadaDesconto;
import br.com.w4solution.cob4.domain.PoliticaFinanceira;
import br.com.w4solution.cob4.dto.financeiro.AlcadaDescontoDTO;
import br.com.w4solution.cob4.dto.financeiro.PoliticaFinanceiraDTO;
import br.com.w4solution.cob4.repositories.PoliticaFinanceiraRepository;
import br.com.w4solution.cob4.security.PerfilUsuario;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.EnumSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PoliticaFinanceiraService {
	private static final EnumSet<PerfilUsuario> PERFIS = EnumSet.of(PerfilUsuario.OPERADOR,
			PerfilUsuario.SUPERVISOR, PerfilUsuario.GERENTE, PerfilUsuario.FINANCEIRO,
			PerfilUsuario.ADMINISTRADOR);
	private final PoliticaFinanceiraRepository repository;

	public PoliticaFinanceiraService(PoliticaFinanceiraRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public PoliticaFinanceiraDTO vigente() {
		return repository.findByVigenteTrue().map(this::dto)
				.orElseThrow(() -> new IllegalStateException("Politica financeira vigente nao encontrada"));
	}

	@Transactional(readOnly = true)
	public List<PoliticaFinanceiraDTO> historico() {
		return repository.findAllByOrderByVersaoDesc().stream().map(this::dto).toList();
	}

	@Transactional
	public PoliticaFinanceiraDTO publicar(PoliticaFinanceiraDTO dados, String usuario) {
		validar(dados);
		repository.findByVigenteTrue().ifPresent(atual -> {
			atual.setVigente(false);
			repository.save(atual);
		});
		PoliticaFinanceira politica = copiar(dados);
		politica.setVersao(repository.findTopByOrderByVersaoDesc().map(p -> p.getVersao() + 1).orElse(1));
		politica.setVigente(true);
		politica.setPublicadaEm(OffsetDateTime.now());
		politica.setPublicadaPor(usuario);
		for (AlcadaDescontoDTO entrada : dados.alcadas()) {
			AlcadaDesconto alcada = new AlcadaDesconto();
			alcada.setPolitica(politica);
			alcada.setPerfil(entrada.perfil());
			alcada.setPercentualMaximo(entrada.percentualMaximo());
			alcada.setValorMaximo(entrada.valorMaximo());
			alcada.setPermitePrincipal(entrada.permitePrincipal());
			alcada.setPermiteJuros(entrada.permiteJuros());
			alcada.setPermiteMulta(entrada.permiteMulta());
			alcada.setExigeAprovacao(entrada.exigeAprovacao());
			politica.getAlcadas().add(alcada);
		}
		return dto(repository.save(politica));
	}

	private void validar(PoliticaFinanceiraDTO dados) {
		var recebidos = dados.alcadas().stream().map(AlcadaDescontoDTO::perfil).collect(Collectors.toSet());
		if (!recebidos.equals(PERFIS)) {
			throw new IllegalArgumentException("Informe uma unica alcada para Operador, Supervisor, Gerente, Financeiro e Administrador");
		}
		if (dados.jurosInicio() != PoliticaFinanceira.InicioEncargos.APOS_CARENCIA && dados.jurosCarenciaDias() != 0) {
			throw new IllegalArgumentException("Carencia de juros so pode ser usada com inicio apos carencia");
		}
		if (dados.multaInicio() != PoliticaFinanceira.InicioEncargos.APOS_CARENCIA && dados.multaCarenciaDias() != 0) {
			throw new IllegalArgumentException("Carencia de multa so pode ser usada com inicio apos carencia");
		}
		if (!dados.permiteRenegociacao() && dados.maximoRenegociacoes() != 0) {
			throw new IllegalArgumentException("Maximo de renegociacoes deve ser zero quando renegociacao estiver desabilitada");
		}
	}

	private PoliticaFinanceira copiar(PoliticaFinanceiraDTO d) {
		PoliticaFinanceira p = new PoliticaFinanceira();
		p.setJurosTipo(d.jurosTipo()); p.setJurosPercentual(d.jurosPercentual());
		p.setJurosPeriodicidade(d.jurosPeriodicidade()); p.setJurosInicio(d.jurosInicio());
		p.setJurosCarenciaDias(d.jurosCarenciaDias()); p.setJurosSobreMulta(d.jurosSobreMulta());
		p.setJurosLimitePercentual(d.jurosLimitePercentual()); p.setMultaTipo(d.multaTipo());
		p.setMultaValor(d.multaValor()); p.setMultaLimite(d.multaLimite()); p.setMultaInicio(d.multaInicio());
		p.setMultaCarenciaDias(d.multaCarenciaDias()); p.setMultaRecorrente(d.multaRecorrente());
		p.setCasasDecimais(d.casasDecimais()); p.setMetodoArredondamento(d.metodoArredondamento());
		p.setMomentoArredondamento(d.momentoArredondamento()); p.setDestinoCentavos(d.destinoCentavos());
		p.setMaximoParcelas(d.maximoParcelas()); p.setValorMinimoParcela(d.valorMinimoParcela());
		p.setIntervaloParcelasDias(d.intervaloParcelasDias()); p.setAjusteDiaNaoUtil(d.ajusteDiaNaoUtil());
		p.setEntradaObrigatoria(d.entradaObrigatoria()); p.setEntradaPercentualMinimo(d.entradaPercentualMinimo());
		p.setEntradaValorMinimo(d.entradaValorMinimo()); p.setEntradaPrazoDias(d.entradaPrazoDias());
		p.setPrimeiraParcelaDias(d.primeiraParcelaDias()); p.setPermiteMultiplosContratos(d.permiteMultiplosContratos());
		p.setBloqueiaContratoJuridico(d.bloqueiaContratoJuridico()); p.setValidadePropostaDias(d.validadePropostaDias());
		p.setToleranciaParcelaDias(d.toleranciaParcelaDias()); p.setParcelasVencidasParaQuebra(d.parcelasVencidasParaQuebra());
		p.setPerdeDescontoNaQuebra(d.perdeDescontoNaQuebra()); p.setPermiteRenegociacao(d.permiteRenegociacao());
		p.setMaximoRenegociacoes(d.maximoRenegociacoes());
		return p;
	}

	private PoliticaFinanceiraDTO dto(PoliticaFinanceira p) {
		return new PoliticaFinanceiraDTO(p.getId(), p.getVersao(), p.isVigente(), p.getJurosTipo(),
				p.getJurosPercentual(), p.getJurosPeriodicidade(), p.getJurosInicio(), p.getJurosCarenciaDias(),
				p.isJurosSobreMulta(), p.getJurosLimitePercentual(), p.getMultaTipo(), p.getMultaValor(),
				p.getMultaLimite(), p.getMultaInicio(), p.getMultaCarenciaDias(), p.isMultaRecorrente(),
				p.getCasasDecimais(), p.getMetodoArredondamento(), p.getMomentoArredondamento(), p.getDestinoCentavos(),
				p.getMaximoParcelas(), p.getValorMinimoParcela(), p.getIntervaloParcelasDias(), p.getAjusteDiaNaoUtil(),
				p.isEntradaObrigatoria(), p.getEntradaPercentualMinimo(), p.getEntradaValorMinimo(), p.getEntradaPrazoDias(),
				p.getPrimeiraParcelaDias(), p.isPermiteMultiplosContratos(), p.isBloqueiaContratoJuridico(),
				p.getValidadePropostaDias(), p.getToleranciaParcelaDias(), p.getParcelasVencidasParaQuebra(),
				p.isPerdeDescontoNaQuebra(), p.isPermiteRenegociacao(), p.getMaximoRenegociacoes(),
				p.getAlcadas().stream().map(a -> new AlcadaDescontoDTO(a.getPerfil(), a.getPercentualMaximo(),
						a.getValorMaximo(), a.isPermitePrincipal(), a.isPermiteJuros(), a.isPermiteMulta(),
						a.isExigeAprovacao())).toList(), p.getPublicadaEm(), p.getPublicadaPor());
	}
}
