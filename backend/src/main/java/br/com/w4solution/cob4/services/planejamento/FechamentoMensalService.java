package br.com.w4solution.cob4.services.planejamento;

import br.com.w4solution.cob4.domain.FechamentoMensal;
import br.com.w4solution.cob4.dto.planejamento.FechamentoMensalDTO;
import br.com.w4solution.cob4.repositories.AtendimentoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.FechamentoMensalRepository;
import br.com.w4solution.cob4.repositories.HistoricoAtrasoRepository;
import br.com.w4solution.cob4.repositories.PromessaPagamentoRepository;
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

	public FechamentoMensalService(FechamentoMensalRepository fechamentoRepository,
			HistoricoAtrasoRepository historicoRepository, CobrancaRepository cobrancaRepository,
			PromessaPagamentoRepository promessaRepository, AtendimentoRepository atendimentoRepository) {
		this.fechamentoRepository = fechamentoRepository;
		this.historicoRepository = historicoRepository;
		this.cobrancaRepository = cobrancaRepository;
		this.promessaRepository = promessaRepository;
		this.atendimentoRepository = atendimentoRepository;
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
		return dto(fechamentoRepository.save(fechamento));
	}

	@Transactional
	public FechamentoMensalDTO aprovar(Long id) {
		FechamentoMensal fechamento = fechamentoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Fechamento nao encontrado"));
		fechamento.setStatus(FechamentoMensal.Status.APROVADO);
		return dto(fechamentoRepository.save(fechamento));
	}

	@Transactional
	public FechamentoMensalDTO cancelar(Long id, String motivo) {
		FechamentoMensal fechamento = fechamentoRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Fechamento nao encontrado"));
		fechamento.setStatus(FechamentoMensal.Status.CANCELADO);
		fechamento.setObservacao(motivo == null || motivo.isBlank() ? "Cancelado" : motivo.trim());
		return dto(fechamentoRepository.save(fechamento));
	}

	private FechamentoMensalDTO dto(FechamentoMensal f) {
		return new FechamentoMensalDTO(f.getId(), f.getCompetencia(), f.getVersao(), f.getStatus().name(),
				f.getValorRecuperado(), f.getProtocolosEncerrados(), f.getPromessasCriadas(),
				f.getAtendimentosRegistrados(), f.getGeradoEm(), f.getGeradoPor(), f.getObservacao());
	}
}
