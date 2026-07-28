package br.com.w4solution.cob4.services.planejamento;

import br.com.w4solution.cob4.domain.Atendimento;
import br.com.w4solution.cob4.domain.Cobranca;
import br.com.w4solution.cob4.dto.planejamento.MetricasMensaisDTO;
import br.com.w4solution.cob4.repositories.AtendimentoRepository;
import br.com.w4solution.cob4.repositories.CobrancaRepository;
import br.com.w4solution.cob4.repositories.HistoricoAtrasoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MetricasService {
	private static final ZoneId ZONA = ZoneId.of("America/Sao_Paulo");
	private final CobrancaRepository cobrancaRepository;
	private final AtendimentoRepository atendimentoRepository;
	private final HistoricoAtrasoRepository historicoRepository;

	public MetricasService(CobrancaRepository cobrancaRepository, AtendimentoRepository atendimentoRepository,
						  HistoricoAtrasoRepository historicoRepository) {
		this.cobrancaRepository = cobrancaRepository; this.atendimentoRepository = atendimentoRepository;
		this.historicoRepository = historicoRepository;
	}

	@Transactional(readOnly = true)
	public MetricasMensaisDTO consultar(YearMonth competencia) {
		OffsetDateTime inicio = competencia.atDay(1).atStartOfDay(ZONA).toOffsetDateTime();
		OffsetDateTime fim = competencia.plusMonths(1).atDay(1).atStartOfDay(ZONA).toOffsetDateTime();
		var cobrancas = cobrancaRepository.findAll();
		var atendimentos = atendimentoRepository.findAll();
		var criadas = cobrancas.stream().filter(c -> dentro(c.getCriadaEm(), inicio, fim)).toList();
		var atendimentosMes = atendimentos.stream().filter(a -> dentro(a.getRealizadoEm(), inicio, fim)).toList();
		Map<Long, Optional<Atendimento>> primeiro = atendimentos.stream()
				.collect(Collectors.groupingBy(a -> a.getCobranca().getId(),
						Collectors.minBy(Comparator.comparing(Atendimento::getRealizadoEm))));
		long noSla = criadas.stream().filter(c -> primeiro.getOrDefault(c.getId(), Optional.empty())
				.filter(a -> Duration.between(c.getCriadaEm(), a.getRealizadoEm()).toMinutes() <= 30).isPresent()).count();
		long contatos = atendimentosMes.stream().filter(a -> a.getResultado() != Atendimento.Resultado.SEM_CONTATO).count();
		long negociacoes = atendimentosMes.stream().filter(a -> EnumSet.of(Atendimento.Resultado.NEGOCIACAO,
				Atendimento.Resultado.PROMESSA, Atendimento.Resultado.PAGAMENTO).contains(a.getResultado())).count();
		var encerradas = cobrancas.stream().filter(c -> dentro(c.getEncerradaEm(), inicio, fim)).toList();
		double mediaHoras = encerradas.stream().mapToLong(c -> Duration.between(c.getCriadaEm(), c.getEncerradaEm()).toHours())
				.average().orElse(0);
		OffsetDateTime referencia = fim.isBefore(OffsetDateTime.now()) ? fim : OffsetDateTime.now();
		long ativas = cobrancas.stream().filter(c -> !c.encerrada() && c.getCriadaEm().isBefore(fim)).count();
		long semMovimento = cobrancas.stream().filter(c -> !c.encerrada() && c.getCriadaEm().isBefore(fim)
				&& c.getUltimaMovimentacaoEm().plusHours(c.getSlaHoras()).isBefore(referencia)).count();
		long consistentes = criadas.stream().filter(c -> texto(c.getCpfAgregador()) && texto(c.getContratoReferencia())
				&& c.getValorTotal() != null && c.getValorTotal().signum() >= 0).count();
		BigDecimal recuperado = historicoRepository.findAll().stream()
				.filter(h -> h.getDataPagamento() != null && !h.getDataPagamento().isBefore(competencia.atDay(1))
						&& h.getDataPagamento().isBefore(competencia.plusMonths(1).atDay(1)))
				.map(h -> h.getValor()).reduce(BigDecimal.ZERO, BigDecimal::add);

		var indicadores = new ArrayList<MetricasMensaisDTO.IndicadorDTO>();
		indicadores.add(ind("PRIMEIRO_CONTATO_SLA", "Primeiro contato no SLA", "%", percentual(noSla, criadas.size()),
				noSla, (long) criadas.size(), "≥ 90%", "DISPONIVEL", "Contato em até 30 minutos da criação."));
		indicadores.add(ind("TAXA_CONTATO", "Taxa de contato", "%", percentual(contatos, atendimentosMes.size()),
				contatos, (long) atendimentosMes.size(), "≥ 60%", "DISPONIVEL", "Atendimentos com resultado diferente de sem contato."));
		indicadores.add(ind("TAXA_NEGOCIACAO", "Taxa de negociação", "%", percentual(negociacoes, contatos),
				negociacoes, contatos, "≥ 35%", "DISPONIVEL", "Negociação, promessa ou pagamento sobre contatos efetivos."));
		indicadores.add(ind("VALOR_RECUPERADO", "Valor recuperado", "BRL", recuperado, null, null,
				"Acompanhar", "PARCIAL", "Baixas com data de pagamento importada do histórico RBX."));
		indicadores.add(ind("TEMPO_RESOLUCAO", "Tempo médio de resolução", "HORAS",
				BigDecimal.valueOf(mediaHoras).setScale(1, RoundingMode.HALF_UP), null, null,
				"Acompanhar por faixa", "DISPONIVEL", "Entre criação e encerramento dos protocolos encerrados no mês."));
		indicadores.add(ind("SEM_MOVIMENTACAO", "Protocolos fora do SLA", "%", percentual(semMovimento, ativas),
				semMovimento, ativas, "≤ 5%", "DISPONIVEL", "Protocolos ativos sem movimentação dentro do SLA."));
		indicadores.add(ind("QUALIDADE_CADASTRAL", "Qualidade cadastral", "%", percentual(consistentes, criadas.size()),
				consistentes, (long) criadas.size(), "≥ 98%", "DISPONIVEL", "CPF, contrato e valor presentes."));
		indicadores.add(ind("PROMESSAS_CUMPRIDAS", "Promessas cumpridas", "%", null, null, null,
				"≥ 70%", "INDISPONIVEL", "Depende do módulo estruturado de promessas de pagamento."));
		indicadores.add(ind("DESCONTO_MEDIO", "Desconto médio", "%", null, null, null,
				"Conforme política", "INDISPONIVEL", "Depende do registro estruturado de acordos e descontos."));
		indicadores.add(ind("VISITAS_EFETIVAS", "Visitas efetivas", "%", null, null, null,
				"≥ 85%", "INDISPONIVEL", "Depende do módulo de execução e resultado das visitas."));

		var produtividade = atendimentosMes.stream().collect(Collectors.groupingBy(
				Atendimento::getOperadorNome, Collectors.counting())).entrySet().stream()
				.sorted(Map.Entry.<String, Long>comparingByValue().reversed())
				.map(e -> new MetricasMensaisDTO.ProdutividadeDTO(e.getKey(), e.getValue())).toList();
		return new MetricasMensaisDTO(competencia, indicadores, produtividade);
	}

	private boolean dentro(OffsetDateTime data, OffsetDateTime inicio, OffsetDateTime fim) {
		return data != null && !data.isBefore(inicio) && data.isBefore(fim);
	}
	private boolean texto(String valor) { return valor != null && !valor.isBlank(); }
	private BigDecimal percentual(long n, long d) {
		return d == 0 ? BigDecimal.ZERO : BigDecimal.valueOf(n * 100.0 / d).setScale(1, RoundingMode.HALF_UP);
	}
	private MetricasMensaisDTO.IndicadorDTO ind(String codigo, String nome, String unidade, BigDecimal valor,
											   Long n, Long d, String meta, String disponibilidade, String obs) {
		return new MetricasMensaisDTO.IndicadorDTO(codigo, nome, unidade, valor, n, d, meta, disponibilidade, obs);
	}
}
