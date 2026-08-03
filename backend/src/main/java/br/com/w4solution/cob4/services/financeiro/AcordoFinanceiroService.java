package br.com.w4solution.cob4.services.financeiro;

import br.com.w4solution.cob4.domain.*;
import br.com.w4solution.cob4.dto.financeiro.*;
import br.com.w4solution.cob4.dto.api.PaginaDTO;
import br.com.w4solution.cob4.repositories.*;
import br.com.w4solution.cob4.security.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.*;
import java.time.*;
import java.util.*;

@Service
public class AcordoFinanceiroService {
	private final AcordoFinanceiroRepository acordoRepository;
	private final CobrancaRepository cobrancaRepository;
	private final PoliticaFinanceiraRepository politicaRepository;
	private final UsuarioAtualService usuarioAtualService;
	private final CarteiraAccessService carteiraAccess;

	public AcordoFinanceiroService(AcordoFinanceiroRepository acordoRepository, CobrancaRepository cobrancaRepository,
			PoliticaFinanceiraRepository politicaRepository, UsuarioAtualService usuarioAtualService,
			CarteiraAccessService carteiraAccess) {
		this.acordoRepository = acordoRepository; this.cobrancaRepository = cobrancaRepository;
		this.politicaRepository = politicaRepository; this.usuarioAtualService = usuarioAtualService;
		this.carteiraAccess = carteiraAccess;
	}

	@Transactional(readOnly = true)
	public AcordoFinanceiroDTO simular(CriarAcordoDTO dados) { return montar(dados, false); }

	@Transactional
	public AcordoFinanceiroDTO criar(CriarAcordoDTO dados) { return montar(dados, true); }

	@Transactional(readOnly = true)
	public List<AcordoFinanceiroDTO> listar(String cobrancaReferencia) {
		return acordoRepository.findByItensCobrancaReferenciaOrderByCriadoEmDesc(cobrancaReferencia).stream().map(this::dto).toList();
	}

	@Transactional(readOnly = true)
	public PaginaDTO<AcordoFinanceiroDTO> listarPagina(String referencia, int pagina, int tamanho) {
		return PaginaDTO.de(acordoRepository.findByItensCobrancaReferencia(referencia,
				PageRequest.of(pagina, tamanho, Sort.by(Sort.Direction.DESC, "criadoEm"))), this::dto);
	}

	@Transactional
	public AcordoFinanceiroDTO decidir(String protocolo, boolean aprovar, String motivo) {
		var usuario = usuarioAtualService.atual();
		if (!EnumSet.of(PerfilUsuario.SUPERVISOR, PerfilUsuario.GERENTE, PerfilUsuario.ADMINISTRADOR).contains(usuario.perfil()))
			throw new org.springframework.security.access.AccessDeniedException("Perfil sem alcada de aprovacao");
		AcordoFinanceiro a = buscar(protocolo);
		if (a.getStatus() != AcordoFinanceiro.Status.AGUARDANDO_APROVACAO) throw new IllegalStateException("Acordo nao aguarda aprovacao");
		if (a.getCriadoPor().equals(usuario.identificador())) throw new IllegalArgumentException("O solicitante nao pode aprovar a propria proposta");
		BigDecimal bruto = a.getPrincipalOriginal().add(a.getJuros()).add(a.getMulta());
		BigDecimal percentual = bruto.signum() == 0 ? BigDecimal.ZERO : a.getDesconto().multiply(new BigDecimal("100")).divide(bruto, 6, RoundingMode.HALF_UP);
		AlcadaDesconto alcada = a.getPolitica().getAlcadas().stream().filter(x -> x.getPerfil() == usuario.perfil())
				.findFirst().orElseThrow(() -> new IllegalArgumentException("Aprovador sem alcada configurada"));
		if (percentual.compareTo(alcada.getPercentualMaximo()) > 0
				|| alcada.getValorMaximo() != null && a.getDesconto().compareTo(alcada.getValorMaximo()) > 0)
			throw new IllegalArgumentException("Desconto acima da alcada do aprovador");
		a.setStatus(aprovar ? AcordoFinanceiro.Status.APROVADO : AcordoFinanceiro.Status.REJEITADO);
		a.setDecididoEm(OffsetDateTime.now()); a.setDecididoPor(usuario.identificador()); a.setMotivoDecisao(motivo);
		return dto(acordoRepository.save(a));
	}

	@Transactional
	public AcordoFinanceiroDTO ativar(String protocolo) {
		AcordoFinanceiro a = buscar(protocolo);
		exigirAcesso(a.getItens().stream().map(i -> i.getCobranca().getReferencia()).toList());
		if (a.getStatus() != AcordoFinanceiro.Status.APROVADO) throw new IllegalStateException("Somente acordo aprovado pode ser ativado");
		if (OffsetDateTime.now().isAfter(a.getValidoAte())) throw new IllegalStateException("Proposta expirada");
		a.setStatus(AcordoFinanceiro.Status.ATIVO);
		return dto(acordoRepository.save(a));
	}

	private AcordoFinanceiroDTO montar(CriarAcordoDTO dados, boolean salvar) {
		exigirAcesso(dados.cobrancas());
		PoliticaFinanceira p = politicaRepository.findByVigenteTrue().orElseThrow();
		if (dados.parcelas() > p.getMaximoParcelas()) throw new IllegalArgumentException("Quantidade de parcelas acima da politica");
		if (dados.cobrancas().size() > 1 && !p.isPermiteMultiplosContratos()) throw new IllegalArgumentException("Politica nao permite varios contratos");
		List<Cobranca> cobrancas = dados.cobrancas().stream().distinct().map(ref -> cobrancaRepository.findByReferencia(ref)
				.orElseThrow(() -> new IllegalArgumentException("Cobranca nao encontrada: " + ref))).toList();
		if (cobrancas.size() != dados.cobrancas().size()) throw new IllegalArgumentException("Cobranca repetida na proposta");
		if (p.isBloqueiaContratoJuridico() && cobrancas.stream().anyMatch(c -> "JURIDICO".equals(c.getEstadoFluxo())))
			throw new IllegalArgumentException("Contrato no juridico nao pode ser negociado");
		AcordoFinanceiro a = new AcordoFinanceiro(); a.setPolitica(p); a.setProtocolo("AC-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
		BigDecimal principal = cobrancas.stream().map(Cobranca::getValorTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
		for (Cobranca c : cobrancas) {
			BigDecimal j = juros(c.getValorTotal(), c.getDiasAtraso(), p); BigDecimal m = multa(c.getValorTotal(), c.getDiasAtraso(), p);
			BigDecimal bruto = c.getValorTotal().add(j).add(m); BigDecimal d = arredondar(bruto.multiply(dados.descontoPercentual()).divide(new BigDecimal("100")), p);
			AcordoItem item = new AcordoItem(); item.setAcordo(a); item.setCobranca(c); item.setPrincipal(c.getValorTotal());
			item.setJuros(j); item.setMulta(m); item.setDesconto(d); item.setTotal(bruto.subtract(d)); a.getItens().add(item);
		}
		BigDecimal juros = a.getItens().stream().map(AcordoItem::getJuros).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal multa = a.getItens().stream().map(AcordoItem::getMulta).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal desconto = a.getItens().stream().map(AcordoItem::getDesconto).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal negociado = principal.add(juros).add(multa).subtract(desconto);
		BigDecimal entradaMinima = principal.multiply(p.getEntradaPercentualMinimo()).divide(new BigDecimal("100")).max(p.getEntradaValorMinimo());
		if (p.isEntradaObrigatoria() && dados.entrada().compareTo(entradaMinima) < 0) throw new IllegalArgumentException("Entrada abaixo do minimo da politica");
		if (dados.entrada().compareTo(negociado) > 0) throw new IllegalArgumentException("Entrada maior que o acordo");
		BigDecimal parcelado = negociado.subtract(dados.entrada());
		if (parcelado.signum() > 0 && parcelado.divide(BigDecimal.valueOf(dados.parcelas()), 2, RoundingMode.DOWN).compareTo(p.getValorMinimoParcela()) < 0)
			throw new IllegalArgumentException("Valor da parcela abaixo do minimo");
		a.setPrincipalOriginal(principal); a.setJuros(juros); a.setMulta(multa); a.setDesconto(desconto); a.setValorEntrada(dados.entrada());
		a.setValorNegociado(negociado); a.setQuantidadeParcelas(dados.parcelas()); a.setJustificativa(dados.justificativa());
		var usuario = usuarioAtualService.atual(); a.setCriadoPor(usuario.identificador()); a.setCriadoEm(OffsetDateTime.now());
		a.setValidoAte(a.getCriadoEm().plusDays(p.getValidadePropostaDias()));
		boolean exige = exigeAprovacao(p, usuario.perfil(), dados.descontoPercentual());
		a.setStatus(exige ? AcordoFinanceiro.Status.AGUARDANDO_APROVACAO : AcordoFinanceiro.Status.APROVADO);
		if (exige) a.setSolicitadoEm(OffsetDateTime.now());
		gerarParcelas(a, parcelado, dados.primeiroVencimento(), p);
		return dto(salvar ? acordoRepository.save(a) : a);
	}

	private void exigirAcesso(Collection<String> referencias) {
		if (referencias.stream().anyMatch(ref -> !carteiraAccess.podeAcessar(ref)))
			throw new AccessDeniedException("Usuario nao pode negociar processo fora da propria carteira");
	}

	private void gerarParcelas(AcordoFinanceiro a, BigDecimal valor, LocalDate primeira, PoliticaFinanceira p) {
		if (valor.signum() == 0) return;
		BigDecimal base = valor.divide(BigDecimal.valueOf(a.getQuantidadeParcelas()), p.getCasasDecimais(), modo(p));
		BigDecimal restante = valor;
		for (int i = 1; i <= a.getQuantidadeParcelas(); i++) {
			BigDecimal total = i == a.getQuantidadeParcelas() ? restante : base; restante = restante.subtract(total);
			ParcelaAcordo parcela = new ParcelaAcordo(); parcela.setAcordo(a); parcela.setNumero(i);
			parcela.setVencimento(ajustar(primeira.plusDays((long) (i - 1) * p.getIntervaloParcelasDias()), p));
			// O desconto ja foi consolidado; a composicao segue a ordem economica proporcional da proposta.
			parcela.setMulta(ratear(a.getMulta(), a.getValorNegociado(), total)); parcela.setJuros(ratear(a.getJuros(), a.getValorNegociado(), total));
			parcela.setPrincipal(total.subtract(parcela.getMulta()).subtract(parcela.getJuros()).max(BigDecimal.ZERO)); parcela.setTotal(total);
			a.getParcelas().add(parcela);
		}
	}

	private BigDecimal juros(BigDecimal principal, int dias, PoliticaFinanceira p) {
		if (dias <= carencia(p.getJurosInicio(), p.getJurosCarenciaDias())) return BigDecimal.ZERO;
		double periodos = dias / switch (p.getJurosPeriodicidade()) { case DIARIA -> 1d; case MENSAL -> 30d; case ANUAL -> 365d; };
		double taxa = p.getJurosPercentual().doubleValue() / 100d;
		double fator = p.getJurosTipo() == PoliticaFinanceira.TipoJuros.SIMPLES ? taxa * periodos : Math.pow(1d + taxa, periodos) - 1d;
		BigDecimal percentual = BigDecimal.valueOf(fator * 100d);
		if (p.getJurosLimitePercentual() != null) percentual = percentual.min(p.getJurosLimitePercentual());
		return arredondar(principal.multiply(percentual).divide(new BigDecimal("100")), p);
	}
	private BigDecimal multa(BigDecimal principal, int dias, PoliticaFinanceira p) {
		if (dias <= carencia(p.getMultaInicio(), p.getMultaCarenciaDias())) return BigDecimal.ZERO;
		BigDecimal valor = p.getMultaTipo() == PoliticaFinanceira.TipoMulta.PERCENTUAL
				? principal.multiply(p.getMultaValor()).divide(new BigDecimal("100")) : p.getMultaValor();
		if (p.getMultaLimite() != null) valor = valor.min(p.getMultaLimite()); return arredondar(valor, p);
	}
	private int carencia(PoliticaFinanceira.InicioEncargos inicio, int dias) { return inicio == PoliticaFinanceira.InicioEncargos.NO_VENCIMENTO ? -1 : inicio == PoliticaFinanceira.InicioEncargos.DIA_SEGUINTE ? 0 : dias; }
	private boolean exigeAprovacao(PoliticaFinanceira p, PerfilUsuario perfil, BigDecimal desconto) {
		AlcadaDesconto a = p.getAlcadas().stream().filter(x -> x.getPerfil() == perfil).findFirst().orElseThrow(() -> new IllegalArgumentException("Perfil sem alcada configurada"));
		return a.isExigeAprovacao() || desconto.compareTo(a.getPercentualMaximo()) > 0;
	}
	private BigDecimal arredondar(BigDecimal v, PoliticaFinanceira p) { return v.setScale(p.getCasasDecimais(), modo(p)); }
	private RoundingMode modo(PoliticaFinanceira p) { return switch (p.getMetodoArredondamento()) { case MEIO_PARA_CIMA -> RoundingMode.HALF_UP; case MEIO_PARA_BAIXO -> RoundingMode.HALF_DOWN; case MEIO_PAR -> RoundingMode.HALF_EVEN; case TRUNCAR -> RoundingMode.DOWN; case PARA_CIMA -> RoundingMode.UP; case PARA_BAIXO -> RoundingMode.FLOOR; }; }
	private BigDecimal ratear(BigDecimal componente, BigDecimal totalAcordo, BigDecimal parcela) { return totalAcordo.signum() == 0 ? BigDecimal.ZERO : componente.multiply(parcela).divide(totalAcordo, 2, RoundingMode.HALF_UP).min(parcela); }
	private LocalDate ajustar(LocalDate data, PoliticaFinanceira p) { if (p.getAjusteDiaNaoUtil() == PoliticaFinanceira.AjusteDiaNaoUtil.MANTER) return data; int passo = p.getAjusteDiaNaoUtil() == PoliticaFinanceira.AjusteDiaNaoUtil.PROXIMO_DIA_UTIL ? 1 : -1; while (data.getDayOfWeek() == DayOfWeek.SATURDAY || data.getDayOfWeek() == DayOfWeek.SUNDAY) data = data.plusDays(passo); return data; }
	private AcordoFinanceiro buscar(String protocolo) { return acordoRepository.findByProtocolo(protocolo).orElseThrow(() -> new IllegalArgumentException("Acordo nao encontrado")); }
	private AcordoFinanceiroDTO dto(AcordoFinanceiro a) { return new AcordoFinanceiroDTO(a.getId(), a.getProtocolo(), a.getStatus().name(), a.getPolitica().getVersao(), a.getPrincipalOriginal(), a.getJuros(), a.getMulta(), a.getDesconto(), a.getValorEntrada(), a.getValorNegociado(), a.getQuantidadeParcelas(), a.getCriadoEm(), a.getValidoAte(), a.getCriadoPor(), a.getDecididoPor(), a.getJustificativa(), a.getMotivoDecisao(), a.getStatus() == AcordoFinanceiro.Status.AGUARDANDO_APROVACAO,
			a.getItens().stream().map(i -> new AcordoFinanceiroDTO.Item(i.getCobranca().getReferencia(), i.getPrincipal(), i.getJuros(), i.getMulta(), i.getDesconto(), i.getTotal())).toList(),
			a.getParcelas().stream().map(x -> new AcordoFinanceiroDTO.Parcela(x.getId(), x.getNumero(), x.getVencimento(), x.getPrincipal(), x.getJuros(), x.getMulta(), x.getTotal(), x.getValorPago(), x.getStatus().name())).toList()); }
}
