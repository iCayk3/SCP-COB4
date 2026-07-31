package br.com.w4solution.cob4.services.planejamento;

import br.com.w4solution.cob4.domain.FechamentoMensal;
import br.com.w4solution.cob4.dto.planejamento.FechamentoMensalDTO;
import br.com.w4solution.cob4.repositories.AtendimentoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.FechamentoMensalRepository;
import br.com.w4solution.cob4.repositories.HistoricoAtrasoRepository;
import br.com.w4solution.cob4.repositories.PromessaPagamentoRepository;
import br.com.w4solution.cob4.repositories.PagamentoFinanceiroRepository;
import br.com.w4solution.cob4.repositories.AcordoFinanceiroRepository;
import br.com.w4solution.cob4.domain.PagamentoFinanceiro;
import br.com.w4solution.cob4.domain.AcordoFinanceiro;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;

@Service
public class FechamentoMensalService {
	private static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");
	private final FechamentoMensalRepository fechamentoRepository;
	private final HistoricoAtrasoRepository historicoRepository;
	private final CobrancaRepository cobrancaRepository;
	private final PromessaPagamentoRepository promessaRepository;
	private final AtendimentoRepository atendimentoRepository;
	private final PagamentoFinanceiroRepository pagamentoRepository;
	private final AcordoFinanceiroRepository acordoRepository;
	private final ObjectMapper objectMapper;

	public FechamentoMensalService(FechamentoMensalRepository fechamentoRepository,
			HistoricoAtrasoRepository historicoRepository, CobrancaRepository cobrancaRepository,
			PromessaPagamentoRepository promessaRepository, AtendimentoRepository atendimentoRepository,
			PagamentoFinanceiroRepository pagamentoRepository, AcordoFinanceiroRepository acordoRepository,
			ObjectMapper objectMapper) {
		this.fechamentoRepository = fechamentoRepository;
		this.historicoRepository = historicoRepository;
		this.cobrancaRepository = cobrancaRepository;
		this.promessaRepository = promessaRepository;
		this.atendimentoRepository = atendimentoRepository;
		this.pagamentoRepository = pagamentoRepository;
		this.acordoRepository = acordoRepository;
		this.objectMapper = objectMapper;
	}

	@Transactional(readOnly = true)
	public List<FechamentoMensalDTO> listar(YearMonth competencia) {
		return fechamentoRepository.findByCompetenciaOrderByVersaoDesc(competencia.toString())
				.stream().map(this::dto).toList();
	}

	@Transactional
	public FechamentoMensalDTO gerar(YearMonth competencia, String usuario, String observacao) {
		OffsetDateTime inicio = competencia.atDay(1).atStartOfDay(ZONA).toOffsetDateTime();
		OffsetDateTime fim = competencia.plusMonths(1).atDay(1).atStartOfDay(ZONA).toOffsetDateTime();
		BigDecimal recuperado = historicoRepository.findAll().stream()
				.filter(h -> h.getDataPagamento() != null
						&& !h.getDataPagamento().isBefore(competencia.atDay(1))
						&& h.getDataPagamento().isBefore(competencia.plusMonths(1).atDay(1)))
				.map(h -> h.getValor()).reduce(BigDecimal.ZERO, BigDecimal::add);
		long encerrados = cobrancaRepository.findAll().stream()
				.filter(c -> c.getEncerradaEm() != null && !c.getEncerradaEm().isBefore(inicio)
						&& c.getEncerradaEm().isBefore(fim)).count();
		long promessas = promessaRepository.countByCriadaEmBetween(inicio, fim);
		long atendimentos = atendimentoRepository.findAll().stream()
				.filter(a -> a.getRealizadoEm() != null && !a.getRealizadoEm().isBefore(inicio)
						&& a.getRealizadoEm().isBefore(fim)).count();
		int versao = fechamentoRepository.findTopByCompetenciaOrderByVersaoDesc(competencia.toString())
				.map(f -> f.getVersao() + 1).orElse(1);
		FechamentoMensal fechamento = new FechamentoMensal();
		fechamento.setCompetencia(competencia.toString());
		fechamento.setVersao(versao);
		fechamento.setValorRecuperado(recuperado);
		fechamento.setProtocolosEncerrados(encerrados);
		fechamento.setPromessasCriadas(promessas);
		fechamento.setAtendimentosRegistrados(atendimentos);
		fechamento.setGeradoEm(OffsetDateTime.now());
		fechamento.setGeradoPor(usuario == null || usuario.isBlank() ? "Sistema" : usuario.trim());
		fechamento.setObservacao(observacao == null || observacao.isBlank() ? null : observacao.trim());
		fechamentoRepository.findTopByCompetenciaOrderByVersaoDesc(competencia.toString())
				.filter(anterior -> anterior.getStatus() == FechamentoMensal.Status.CANCELADO)
				.ifPresent(fechamento::setSubstitui);
		var pagamentos = pagamentoRepository.findByDataPagamentoBetweenAndStatusIn(competencia.atDay(1),
				competencia.plusMonths(1).atDay(1).minusDays(1), List.of(PagamentoFinanceiro.Status.CONFIRMADO,
						PagamentoFinanceiro.Status.CONCILIADO, PagamentoFinanceiro.Status.DIVERGENTE,
						PagamentoFinanceiro.Status.ESTORNADO));
		fechamento.setTotalPagamentos(pagamentos.stream().filter(p -> p.getStatus() != PagamentoFinanceiro.Status.ESTORNADO)
				.map(PagamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add));
		fechamento.setTotalEstornos(pagamentos.stream().filter(p -> p.getStatus() == PagamentoFinanceiro.Status.ESTORNADO)
				.map(PagamentoFinanceiro::getValor).reduce(BigDecimal.ZERO, BigDecimal::add));
		var acordos = acordoRepository.findAll().stream().filter(a -> !a.getCriadoEm().isBefore(inicio) && a.getCriadoEm().isBefore(fim)).toList();
		fechamento.setTotalDescontos(acordos.stream().map(AcordoFinanceiro::getDesconto).reduce(BigDecimal.ZERO, BigDecimal::add));
		fechamento.setTotalJuros(acordos.stream().map(AcordoFinanceiro::getJuros).reduce(BigDecimal.ZERO, BigDecimal::add));
		fechamento.setTotalMultas(acordos.stream().map(AcordoFinanceiro::getMulta).reduce(BigDecimal.ZERO, BigDecimal::add));
		fechamento.setDivergenciasAbertas(pagamentos.stream().filter(p -> p.getStatus() == PagamentoFinanceiro.Status.DIVERGENTE).count());
		try {
			fechamento.setSnapshotJson(objectMapper.writeValueAsString(java.util.Map.of(
					"pagamentos", pagamentos.stream().map(PagamentoFinanceiro::getId).toList(),
					"acordos", acordos.stream().map(AcordoFinanceiro::getId).toList(), "geradoEm", OffsetDateTime.now().toString())));
		} catch (Exception e) { throw new IllegalStateException("Falha ao gerar snapshot do fechamento", e); }
		return dto(fechamentoRepository.save(fechamento));
	}

	@Transactional
	public FechamentoMensalDTO aprovar(Long id, String usuario) {
		FechamentoMensal fechamento = fechamentoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Fechamento nao encontrado"));
		if (fechamento.getGeradoPor().equals(usuario)) throw new IllegalArgumentException("O gerador nao pode aprovar o proprio fechamento");
		if (fechamento.getDivergenciasAbertas() > 0) throw new IllegalStateException("Fechamento possui divergencias financeiras abertas");
		fechamento.setStatus(FechamentoMensal.Status.APROVADO); fechamento.setAprovadoEm(OffsetDateTime.now()); fechamento.setAprovadoPor(usuario);
		return dto(fechamentoRepository.save(fechamento));
	}

	@Transactional
	public FechamentoMensalDTO cancelar(Long id, String motivo, String usuario) {
		FechamentoMensal fechamento = fechamentoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Fechamento nao encontrado"));
		if (motivo == null || motivo.isBlank()) throw new IllegalArgumentException("Motivo do cancelamento e obrigatorio");
		fechamento.setStatus(FechamentoMensal.Status.CANCELADO); fechamento.setCanceladoEm(OffsetDateTime.now()); fechamento.setCanceladoPor(usuario);
		fechamento.setObservacao(motivo.trim());
		return dto(fechamentoRepository.save(fechamento));
	}

	private FechamentoMensalDTO dto(FechamentoMensal f) {
		return new FechamentoMensalDTO(f.getId(), f.getCompetencia(), f.getVersao(), f.getStatus().name(),
				f.getValorRecuperado(), f.getProtocolosEncerrados(), f.getPromessasCriadas(),
				f.getAtendimentosRegistrados(), f.getGeradoEm(), f.getGeradoPor(), f.getObservacao(),
				f.getTotalPagamentos(), f.getTotalEstornos(), f.getTotalDescontos(), f.getTotalJuros(), f.getTotalMultas(),
				f.getDivergenciasAbertas(), f.getSubstitui() == null ? null : f.getSubstitui().getId(), f.getAprovadoEm(), f.getAprovadoPor());
	}
}
